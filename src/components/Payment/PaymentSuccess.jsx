import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { useToast } from "@/components/ui/Toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart, loadCartItems } = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const toastShown = useRef(false); // Ref để đảm bảo chỉ hiển thị toast 1 lần

  useEffect(() => {
    const handlePaymentResult = async () => {
      // Parse payment result from URL params
      const code = searchParams.get("code");
      const status = searchParams.get("status");
      const orderCode = searchParams.get("orderCode");
      const cancel = searchParams.get("cancel");

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

      console.log("Payment params:", { code, status, orderCode, cancel });
      console.log("Determined payment status:", resultStatus);

      setPaymentStatus({
        status: resultStatus,
        orderCode,
        code,
      });

      // Hiển thị Toast notification
      if (!toastShown.current && orderCode) {
        toastShown.current = true;
        if (resultStatus === "success") {
          toast.success(
            `🎉 Thanh toán thành công! Mã đơn hàng: ${orderCode}`,
            6000
          );
        } else if (resultStatus === "cancelled") {
          toast.info("Thanh toán đã bị hủy", 4000);
        } else if (resultStatus === "failed") {
          toast.error("Thanh toán thất bại. Vui lòng thử lại.", 5000);
        }
      }

      // Gọi API cập nhật trạng thái đơn hàng
      if (orderCode) {
        try {
          const newStatus = resultStatus === "success" ? "PAID" : "CANCELLED";
          console.log(
            `Đang cập nhật trạng thái đơn hàng ${orderCode} thành ${newStatus}...`
          );

          const updateResult = await orderService.updateOrderStatus(
            orderCode,
            newStatus
          );
          console.log("Kết quả cập nhật trạng thái:", updateResult);

          if (updateResult?.isSuccess) {
            console.log(
              `✓ Đã cập nhật trạng thái đơn hàng ${orderCode} thành ${newStatus}`
            );

            // Nếu thanh toán thành công, gọi API tính hoa hồng
            if (resultStatus === "success") {
              try {
                console.log(`Đang tính hoa hồng cho đơn hàng ${orderCode}...`);
                const commissionResult = await orderService.calculateCommission(
                  orderCode,
                  "PAID"
                );
                console.log("Kết quả tính hoa hồng:", commissionResult);

                if (commissionResult?.isSuccess) {
                  console.log(`✓ Đã tính hoa hồng cho đơn hàng ${orderCode}`);
                } else {
                  console.warn(
                    "API tính hoa hồng không thành công:",
                    commissionResult
                  );
                }
              } catch (commissionError) {
                console.error("Lỗi khi tính hoa hồng:", commissionError);
              }
            }
          } else {
            console.warn(
              "API cập nhật trạng thái không thành công:",
              updateResult
            );
          }
        } catch (statusError) {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng:", statusError);
          // Không throw error vì vẫn muốn hiển thị kết quả thanh toán cho user
        }
      }

      // Xóa giỏ hàng nếu thanh toán thành công
      if (resultStatus === "success") {
        // Lưu orderCode vào localStorage để tracking
        localStorage.setItem("last_paid_order", orderCode);
        localStorage.setItem("payment_success_time", Date.now().toString());
        try {
          console.log("Bắt đầu xóa giỏ hàng sau thanh toán thành công...");

          // Phương pháp 1: Thử gọi API clear
          try {
            const clearResult = await cartService.clearCart();
            console.log("Clear cart API result:", clearResult);

            if (clearResult && clearResult.isSuccess) {
              console.log("✓ Đã xóa giỏ hàng thành công qua API clear");
            } else {
              throw new Error(
                "API clear không thành công, dùng phương pháp backup"
              );
            }
          } catch (clearError) {
            console.warn("API clear thất bại, xóa từng item một:", clearError);

            // Phương pháp 2: Backup - Xóa từng item một
            // Reload cart items trước để có danh sách mới nhất
            await loadCartItems(false);

            // Lấy danh sách cart items hiện tại
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

            console.log(`Tìm thấy ${itemsToDelete.length} items cần xóa`);

            // Xóa từng item
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

          // Reload cart để cập nhật UI
          await loadCartItems(false);

          // Xóa pending cart trong localStorage
          localStorage.removeItem("pending_cart_items");

          console.log("✓ Giỏ hàng đã được xóa hoàn toàn");
        } catch (error) {
          console.error("Lỗi khi xóa giỏ hàng:", error);
          // Vẫn reload cart để đảm bảo UI được cập nhật
          try {
            await loadCartItems(false);
          } catch (reloadError) {
            console.error("Lỗi khi reload cart:", reloadError);
          }
        }
      }

      setLoading(false);

      // Auto redirect sau 10 giây nếu thành công
      if (resultStatus === "success") {
        const timer = setTimeout(() => {
          navigate("/", { replace: true });
        }, 10000); // 10 giây
        return () => clearTimeout(timer);
      }
    };

    handlePaymentResult();
  }, [searchParams, navigate, clearCart, loadCartItems, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-artisan-gold-400 animate-spin mx-auto mb-4" />
          <p className="text-artisan-brown-300 text-lg">
            Đang xử lý thanh toán...
          </p>
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
                ✓ Tự động chuyển về trang chủ sau 10 giây...
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
    <div className="min-h-screen bg-artisan-brown-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-artisan-brown-900 border-artisan-brown-700">
        <CardContent className="pt-12 pb-8 px-8">
          {renderContent()}

          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/", { replace: true })}
              className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
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

export default PaymentSuccess;
