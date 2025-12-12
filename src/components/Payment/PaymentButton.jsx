/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from "react";
import { CreditCard, X, MapPin, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentAccount } from "@/services/accountService";
import { orderService } from "@/services/orderService";
import { cartService } from "@/services/cartService";

/**
 * Nút thanh toán dùng lại được.
 * - Nhận `cartItems` để dựng payload products
 * - Gọi API checkout và chuyển hướng sang paymentUrl
 * - Hiển thị popup để nhập địa chỉ giao hàng trước khi thanh toán
 * @param {Object} props - Component props
 * @param {Array} props.cartItems - Danh sách items trong giỏ hàng
 * @param {string} props.className - CSS class names bổ sung
 */
const PaymentButton = ({ cartItems = [], className = "" }) => {
  const [submitting, setSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    province: "",
  });
  const [errors, setErrors] = useState({});

  // Load thông tin user khi mở dialog
  useEffect(() => {
    if (showDialog) {
      const loadUserInfo = async () => {
        try {
          const me = await getCurrentAccount();
          const userData = me?.data || me;
          setShippingAddress((prev) => ({
            recipientName:
              prev.recipientName || userData?.username || userData?.name || "",
            phone: prev.phone || userData?.phone || "",
            street: prev.street || userData?.address || "",
            ward: prev.ward || "",
            district: prev.district || "",
            province: prev.province || "",
          }));
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng:", error);
        }
      };
      loadUserInfo();
    }
  }, [showDialog]);

  const handleOpenDialog = () => {
    if (!cartItems?.length) return;
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setErrors({});
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!shippingAddress.recipientName.trim()) {
      newErrors.recipientName = "Vui lòng nhập tên người nhận";
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^[0-9]{10,11}$/.test(shippingAddress.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!shippingAddress.street.trim()) {
      newErrors.street = "Vui lòng nhập địa chỉ đường";
    }
    if (!shippingAddress.ward.trim()) {
      newErrors.ward = "Vui lòng nhập phường/xã";
    }
    if (!shippingAddress.district.trim()) {
      newErrors.district = "Vui lòng nhập quận/huyện";
    }
    if (!shippingAddress.province.trim()) {
      newErrors.province = "Vui lòng nhập tỉnh/thành";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [shippingAddress]);

  const handleCheckout = useCallback(async () => {
    if (!cartItems?.length) return;

    // Validate form trước khi checkout
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Lấy account hiện tại để có accountId
      const me = await getCurrentAccount();
      const accountId = me?.accountId || me?.id || me?.data?.accountId;

      // Kiểm tra và đồng bộ cart items lên server nếu có temporary IDs
      const hasTempIds = cartItems.some(
        (item) =>
          String(item.cartItemId || "").startsWith("temp-") || !item.cartItemId
      );

      if (hasTempIds) {
        // Đồng bộ từng item lên server (chỉ những item có temporary ID hoặc không có ID)
        for (const item of cartItems) {
          const cartItemId = item.cartItemId || item.id;
          const isTempId = String(cartItemId || "").startsWith("temp-");

          if (isTempId || !cartItemId) {
            // Item chưa có trên server, thêm vào
            try {
              await cartService.addToCart(
                item.productId || item.product?.productId || item.id,
                item.quantity || 1
              );
            } catch (error) {
              console.error("Lỗi khi đồng bộ item lên server:", error);
            }
          }
        }
      }

      // Luôn lấy lại cart items từ server để đảm bảo có real cartItemIds
      const serverCartResponse = await cartService.getCartItems();
      let serverCartItems = [];

      if (serverCartResponse?.isSuccess && serverCartResponse?.data) {
        if (
          serverCartResponse.data.items &&
          Array.isArray(serverCartResponse.data.items)
        ) {
          serverCartItems = serverCartResponse.data.items;
        } else if (Array.isArray(serverCartResponse.data)) {
          serverCartItems = serverCartResponse.data;
        }
      } else if (Array.isArray(serverCartResponse)) {
        serverCartItems = serverCartResponse;
      }

      // Thu thập CartItemIds từ server cart items (loại bỏ temporary IDs)
      const cartItemIds = serverCartItems
        .map((item) => item.cartItemId || item.id)
        .filter(
          (v) =>
            v !== undefined &&
            v !== null &&
            !String(v).startsWith("temp-") &&
            typeof v === "number"
        );

      if (!cartItemIds.length) {
        throw new Error(
          "Không tìm thấy CartItemIds hợp lệ. Vui lòng thử lại sau."
        );
      }

      // Sử dụng shippingAddress từ form đã nhập
      // ============================================
      // SETUP RETURN URL CHO PAYOS - QUAN TRỌNG!
      // ============================================
      // 1. Lấy frontend URL từ biến môi trường hoặc tự động detect
      const frontendUrl =
        import.meta.env.VITE_FRONTEND_URL || window.location.origin;

      // 2. Tạo returnUrl và cancelUrl - PayOS sẽ redirect về đây sau khi thanh toán
      // PayOS sẽ redirect về root URL với query params: ?code=00&status=PAID&orderCode=...
      const returnUrl = `${frontendUrl}/`;
      const cancelUrl = `${frontendUrl}/`;

      // Debug: Kiểm tra URL đang được gửi
      console.log("🔗 PayOS Return URL Debug:", {
        "VITE_FRONTEND_URL (env)": import.meta.env.VITE_FRONTEND_URL,
        "window.location.origin": window.location.origin,
        "frontendUrl (đang dùng)": frontendUrl,
        "returnUrl (gửi cho backend)": returnUrl,
        "cancelUrl (gửi cho backend)": cancelUrl,
        "⚠️ LƯU Ý":
          "Nếu returnUrl là localhost, kiểm tra biến môi trường VITE_FRONTEND_URL trên Vercel",
      });

      const payload = {
        accountId,
        cartItemIds,
        shippingAddress,
        returnUrl, // Gửi cho backend, backend sẽ truyền cho PayOS
        cancelUrl, // Gửi cho backend, backend sẽ truyền cho PayOS
      };

      // Debug: Kiểm tra payload gửi cho backend
      console.log("📦 Payload gửi cho Backend:", {
        accountId,
        cartItemIds: cartItemIds.length,
        returnUrl,
        cancelUrl,
        "⚠️ QUAN TRỌNG":
          "Backend PHẢI sử dụng returnUrl này để tạo PayOS payment link",
      });

      const res = await orderService.checkout(payload);

      // Debug: Kiểm tra paymentUrl nhận từ backend
      console.log("💳 Payment URL từ Backend:", {
        paymentUrl: res?.data?.paymentUrl || res?.paymentUrl,
        "⚠️ KIỂM TRA": "Backend có truyền returnUrl cho PayOS không?",
      });
      const url =
        res?.data?.paymentUrl ||
        res?.paymentUrl ||
        "https://pay.payos.vn/web/d51babddc18a4401b96a118b7cc19ee0";

      // Đóng dialog và chuyển trang tới PayOS để quét mã
      setShowDialog(false);
      if (url) {
        window.location.href = url;
      }
    } catch (e) {
      alert(
        e?.message || "Không thể khởi tạo thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  }, [cartItems, shippingAddress, validateForm]);

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        disabled={submitting || !cartItems?.length}
        className={`${className} w-full bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white py-3`}
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Thanh toán
      </Button>

      {/* Shipping Address Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDialog();
            }
          }}
        >
          <Card
            className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-artisan-brown-900 border-artisan-brown-700"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-artisan-gold-400" />
                Thông tin giao hàng
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDialog}
                className="text-white hover:bg-artisan-brown-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên người nhận */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-artisan-brown-300 mb-2">
                    Tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-artisan-brown-400" />
                    <input
                      type="text"
                      value={shippingAddress.recipientName}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          recipientName: e.target.value,
                        }))
                      }
                      className={`w-full pl-10 pr-4 py-2 bg-artisan-brown-800 border rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 ${
                        errors.recipientName
                          ? "border-red-500"
                          : "border-artisan-brown-600"
                      }`}
                      placeholder="Nhập tên người nhận"
                    />
                  </div>
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipientName}
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-artisan-brown-300 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-artisan-brown-400" />
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={`w-full pl-10 pr-4 py-2 bg-artisan-brown-800 border rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 ${
                        errors.phone
                          ? "border-red-500"
                          : "border-artisan-brown-600"
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Địa chỉ đường */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-artisan-brown-300 mb-2">
                    Số nhà, đường <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2 bg-artisan-brown-800 border rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 ${
                      errors.street
                        ? "border-red-500"
                        : "border-artisan-brown-600"
                    }`}
                    placeholder="Nhập số nhà, tên đường"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                {/* Phường/Xã */}
                <div>
                  <label className="block text-sm font-medium text-artisan-brown-300 mb-2">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.ward}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        ward: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2 bg-artisan-brown-800 border rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 ${
                      errors.ward
                        ? "border-red-500"
                        : "border-artisan-brown-600"
                    }`}
                    placeholder="Nhập phường/xã"
                  />
                  {errors.ward && (
                    <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
                  )}
                </div>

                {/* Quận/Huyện */}
                <div>
                  <label className="block text-sm font-medium text-artisan-brown-300 mb-2">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.district}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2 bg-artisan-brown-800 border rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 ${
                      errors.district
                        ? "border-red-500"
                        : "border-artisan-brown-600"
                    }`}
                    placeholder="Nhập quận/huyện"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Tỉnh/Thành */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-artisan-brown-300 mb-2">
                    Tỉnh/Thành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.province}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        province: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2 bg-artisan-brown-800 border rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:ring-2 focus:ring-artisan-gold-500 ${
                      errors.province
                        ? "border-red-500"
                        : "border-artisan-brown-600"
                    }`}
                    placeholder="Nhập tỉnh/thành phố"
                  />
                  {errors.province && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.province}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="flex-1 border-artisan-brown-600 text-white hover:bg-artisan-brown-800"
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="flex-1 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {submitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PaymentButton;
