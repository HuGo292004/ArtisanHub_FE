import { useEffect, useState } from "react";
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
      
      console.log("Payment callback params:", { code, status, orderCode, cancel });
      console.log("Determined payment status:", resultStatus);

      setPaymentStatus({
        status: resultStatus,
        orderCode,
        code,
      });

      // Gọi API cập nhật trạng thái đơn hàng
      try {
        const newStatus = resultStatus === "success" ? "PAID" : "CANCELLED";
        console.log(`Đang cập nhật trạng thái đơn hàng ${orderCode} thành ${newStatus}...`);
        
        const updateResult = await orderService.updateOrderStatus(orderCode, newStatus);
        console.log("Kết quả cập nhật trạng thái:", updateResult);
        
        if (updateResult?.isSuccess) {
          console.log(`✓ Đã cập nhật trạng thái đơn hàng ${orderCode} thành ${newStatus}`);
        } else {
          console.warn("API cập nhật trạng thái không thành công:", updateResult);
        }
      } catch (statusError) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", statusError);
      }

      // Xóa giỏ hàng nếu thanh toán thành công
      if (resultStatus === "success") {
        localStorage.setItem("last_paid_order", orderCode);
        localStorage.setItem("payment_success_time", Date.now().toString());
        
        try {
          console.log("Bắt đầu xóa giỏ hàng sau thanh toán thành công...");

          try {
            const clearResult = await cartService.clearCart();
            console.log("Clear cart API result:", clearResult);

            if (clearResult && clearResult.isSuccess) {
              console.log("✓ Đã xóa giỏ hàng thành công qua API clear");
            } else {
              throw new Error("API clear không thành công");
            }
          } catch (clearError) {
            console.warn("API clear thất bại, xóa từng item một:", clearError);

            await loadCartItems(false);
            const currentCartResponse = await cartService.getCartItems();
            let itemsToDelete = [];

            if (currentCartResponse?.isSuccess && currentCartResponse?.data) {
              if (Array.isArray(currentCartResponse.data.items)) {
                itemsToDelete = currentCartResponse.data.items;
              } else if (Array.isArray(currentCartResponse.data)) {
                itemsToDelete = currentCartResponse.data;
              }
            } else if (Array.isArray(currentCartResponse)) {
              itemsToDelete = currentCartResponse;
            }

            for (const item of itemsToDelete) {
              try {
                const itemId = item.cartItemId || item.id;
                if (itemId) {
                  await cartService.removeFromCart(itemId);
                  console.log(`✓ Đã xóa item ${itemId}`);
                }
              } catch (itemError) {
                console.error("Lỗi khi xóa item:", itemError);
              }
            }
          }

          await loadCartItems(false);
          localStorage.removeItem("pending_cart_items");
          console.log("✓ Giỏ hàng đã được xóa hoàn toàn");
        } catch (error) {
          console.error("Lỗi khi xóa giỏ hàng:", error);
          try {
            await loadCartItems(false);
          } catch (reloadError) {
            console.error("Lỗi khi reload cart:", reloadError);
          }
        }
      }

      setLoading(false);

      // Auto redirect sau 5 giây nếu thành công
      if (resultStatus === "success") {
        const timer = setTimeout(() => {
          // Clear URL params và về trang chủ
          navigate("/", { replace: true });
        }, 5000);
        return () => clearTimeout(timer);
      }
    };

    handlePaymentResult();
  }, [searchParams, navigate, loadCartItems]);

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

