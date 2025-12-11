import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";

/**
 * Component xử lý callback từ PayOS khi thanh toán xong
 * PayOS sẽ redirect về URL với các params:
 * - Thành công: ?code=00&id=...&cancel=false&status=PAID&orderCode=...
 * - Thất bại: ?code=...&id=...&cancel=true&status=CANCELLED&orderCode=...
 */
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadCartItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Ref để đảm bảo chỉ xử lý 1 lần (tránh React Strict Mode gọi 2 lần)
  const isProcessed = useRef(false);

  useEffect(() => {
    const handlePaymentResult = async () => {
      // Parse payment result from URL params
      const code = searchParams.get("code");
      const status = searchParams.get("status");
      const orderCode = searchParams.get("orderCode");
      const cancel = searchParams.get("cancel");

      // Nếu không có orderCode, không phải payment callback
      if (!orderCode) {
        setLoading(false);
        return;
      }

      // Kiểm tra đã xử lý chưa (tránh gọi nhiều lần)
      if (isProcessed.current) {
        return;
      }
      isProcessed.current = true;

      // Determine payment status
      // Ưu tiên kiểm tra cancel trước vì có thể có code=00 nhưng cancel=true
      let resultStatus = "pending";
      if (cancel === "true" || status === "CANCELLED") {
        resultStatus = "cancelled";
      } else if (status === "PAID" || code === "00") {
        resultStatus = "success";
      } else {
        resultStatus = "failed";
      }

      setPaymentStatus({
        status: resultStatus,
        orderCode,
        code,
      });

      // Gọi API cập nhật trạng thái đơn hàng
      const newStatus = resultStatus === "success" ? "PAID" : "CANCELLED";

      try {
        await orderService.updateOrderStatus(orderCode, newStatus);
      } catch {
        // Bỏ qua lỗi update status
      }

      // Gọi API tính hoa hồng
      if (resultStatus === "success") {
        try {
          await orderService.calculateCommission(orderCode, "PAID");
        } catch {
          // Bỏ qua lỗi tính hoa hồng
        }
      }

      // Xóa giỏ hàng nếu thanh toán thành công
      if (resultStatus === "success") {
        try {
          // Kiểm tra giỏ hàng có item không trước khi xóa
          const cartResponse = await cartService.getCartItems();
          let cartItems = [];

          if (cartResponse?.isSuccess && cartResponse?.data) {
            cartItems = Array.isArray(cartResponse.data)
              ? cartResponse.data
              : cartResponse.data.items || [];
          }

          if (cartItems.length > 0) {
            // Xóa từng item trong giỏ hàng
            for (const item of cartItems) {
              const itemId = item.cartItemId || item.id;
              if (itemId) {
                try {
                  await cartService.removeFromCart(itemId);
                } catch {
                  // Bỏ qua lỗi khi xóa từng item
                }
              }
            }
          }

          // Reload cart để cập nhật UI
          await loadCartItems(false);
          localStorage.removeItem("pending_cart_items");
        } catch {
          // Bỏ qua lỗi xử lý giỏ hàng
        }
      }

      setLoading(false);
    };

    handlePaymentResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  // Auto redirect sau 5 giây nếu thành công
  useEffect(() => {
    if (paymentStatus?.status === "success") {
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus?.status, navigate]);

  // Nếu không có orderCode trong URL, không hiển thị gì
  if (!searchParams.get("orderCode")) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-artisan-gold-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (paymentStatus?.status) {
      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-artisan-brown-300 mb-2">
              Cảm ơn bạn đã đặt hàng tại ArtisanHub
            </p>
            {paymentStatus.orderCode && (
              <p className="text-artisan-gold-400 font-mono text-lg mb-6">
                Mã đơn hàng: {paymentStatus.orderCode}
              </p>
            )}
            <div className="bg-artisan-brown-800 rounded-lg p-4 mb-6">
              <p className="text-artisan-brown-300 text-sm">
                ✓ Đơn hàng của bạn đã được xác nhận
              </p>
              <p className="text-artisan-brown-300 text-sm">
                ✓ Chúng tôi sẽ liên hệ với bạn sớm nhất
              </p>
              <p className="text-artisan-brown-300 text-sm">
                ✓ Tự động đóng sau 5 giây...
              </p>
            </div>
          </div>
        );

      case "cancelled":
        return (
          <div className="text-center">
            <XCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Thanh toán đã bị hủy
            </h1>
            <p className="text-artisan-brown-300 mb-6">
              Bạn đã hủy giao dịch thanh toán
            </p>
            {paymentStatus.orderCode && (
              <p className="text-artisan-brown-400 font-mono text-sm mb-4">
                Mã đơn hàng: {paymentStatus.orderCode}
              </p>
            )}
          </div>
        );

      case "failed":
        return (
          <div className="text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-artisan-brown-300 mb-6">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <Loader2 className="w-20 h-20 text-artisan-gold-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Đang xử lý...
            </h1>
            <p className="text-artisan-brown-300 mb-6">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-artisan-brown-900 border-artisan-brown-700">
        <CardContent className="pt-12 pb-8 px-8">
          {renderContent()}

          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/", { replace: true })}
              className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Đóng
            </Button>
            <Button
              onClick={() => navigate("/products", { replace: true })}
              variant="outline"
              className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
