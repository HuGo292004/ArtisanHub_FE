import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import PaymentButton from "@/components/Payment/PaymentButton";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartItemCount,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalPrice,
  } = useCart();

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
    } else {
      updateCartItem(cartItemId, newQuantity);
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId);
  };

  const handleClearCart = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      clearCart();
    }
  };

  // Checkout được tách sang PaymentButton

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artisan-gold-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-artisan-gold-400 hover:text-artisan-gold-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-artisan-gold-400" />
              Giỏ hàng của bạn
            </h1>
          </div>
          {cartItemCount > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tất cả
            </Button>
          )}
        </div>

        {cartItemCount === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="bg-artisan-brown-900 rounded-2xl p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 text-artisan-gold-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Giỏ hàng trống
              </h2>
              <p className="text-artisan-brown-300 mb-8">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản
                phẩm tuyệt vời của chúng tôi!
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white px-8 py-3"
              >
                Khám phá sản phẩm
              </Button>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                // API returns flat structure: productName, price, imageUrl directly on item
                const productName =
                  item.productName ||
                  item.product?.name ||
                  "Sản phẩm không tên";
                const price =
                  item.price ||
                  item.product?.discountPrice ||
                  item.product?.price ||
                  0;
                const imageUrl = item.imageUrl || item.product?.images;
                const category = item.product?.category || "Chưa phân loại";
                const totalPrice = price * item.quantity;

                return (
                  <Card
                    key={item.cartItemId || item.id || `cart-item-${index}`}
                    className="bg-artisan-brown-900 border-artisan-brown-700"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-6 items-start pt-5">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={
                              imageUrl ||
                              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
                            }
                            alt={productName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop";
                            }}
                          />
                        </div>

                        {/* Product Info - Left aligned */}
                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                            {productName}
                          </h3>
                          <p className="text-artisan-brown-300 text-sm mb-2">
                            {category}
                          </p>
                          <p className="text-artisan-gold-400 font-bold text-lg">
                            {formatPrice(price)}đ
                          </p>
                        </div>

                        {/* Right Section - Controls and Total - Centered */}
                        <div className="flex items-center gap-6 pt-8">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(
                                  item.cartItemId || item.id || item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 p-0 border-artisan-brown-600 text-white hover:bg-artisan-brown-700"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-white font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(
                                  item.cartItemId || item.id || item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 p-0 border-artisan-brown-600 text-white hover:bg-artisan-brown-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Total Price */}
                          <div className="text-right min-w-[120px]">
                            <p className="text-artisan-gold-400 font-bold text-lg">
                              {formatPrice(totalPrice)}đ
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveItem(
                                item.cartItemId || item.id || item.productId
                              )
                            }
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-artisan-brown-900 border-artisan-brown-700 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6 gap-6 pt-6">
                    Tóm tắt đơn hàng
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-artisan-brown-300">
                      <span>Số sản phẩm:</span>
                      <span>{cartItemCount} sản phẩm</span>
                    </div>
                    <div className="flex justify-between text-white text-lg font-bold">
                      <span>Tổng tiền:</span>
                      <span className="text-artisan-gold-400">
                        {formatPrice(getTotalPrice())}đ
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <PaymentButton cartItems={cartItems} />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => navigate("/products")}
                    className="w-full border-artisan-brown-600 text-white hover:bg-artisan-brown-700"
                  >
                    Tiếp tục mua sắm
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
