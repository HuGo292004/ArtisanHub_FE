import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();

  // State riêng cho từng card
  const [isAdding, setIsAdding] = useState(false);

  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));
  const {
    productId,
    name,
    price,
    discountPrice,
    averageRating,
    images,
    category,
    description,
  } = product;

  // Format giá tiền
  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Tính phần trăm giảm giá
  const calculateDiscount = (price, discountPrice) => {
    if (price && discountPrice && price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount(price, discountPrice);
  const displayPrice = discountPrice || price;

  const handleProductClick = () => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAdding) return; // Ngăn click nhiều lần

    setIsAdding(true);
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        toast.success(result.message);
        
        // Nếu sản phẩm được lưu vào pending (chưa đăng nhập), hỏi có muốn đăng nhập ngay
        if (result.isPending) {
          setTimeout(() => {
            if (window.confirm("Bạn có muốn đăng nhập ngay để hoàn tất đơn hàng?")) {
              navigate("/login");
            }
          }, 500);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    // TODO: Implement add to wishlist functionality
    console.log("Add to wishlist:", productId);
  };

  return (
    <Card className="overflow-hidden product-card-hover bg-white border border-artisan-brown-200 h-full flex flex-col group">
      {/* Ảnh sản phẩm */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            images ||
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
          }
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop";
          }}
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4">
            <span className="bg-artisan-gold-500 text-white px-2 py-1 rounded text-xs font-medium">
              -{discount}%
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={handleProductClick}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="mb-2">
            <span className="text-xs text-artisan-gold-600 dark:text-artisan-gold-400 font-medium">
              {category || "Chưa phân loại"}
            </span>
          </div>
          <h3
            className="text-xl font-bold text-artisan-brown-900 mb-2 line-clamp-2 cursor-pointer hover:text-artisan-gold-600 transition-colors"
            onClick={handleProductClick}
          >
            {name || "Chưa có tên"}
          </h3>
          <p className="text-artisan-brown-600 text-sm line-clamp-2">
            {description || "Chưa có mô tả"}
          </p>
        </div>

        {/* Rating */}
        {averageRating && (
          <div className="mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-artisan-gold-500 fill-current" />
              <span className="text-sm font-medium text-artisan-brown-900 ml-1">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-artisan-gold-600">
              {formatPrice(displayPrice)}đ
            </span>
            {discountPrice && price > discountPrice && (
              <span className="text-sm text-artisan-brown-500 line-through">
                {formatPrice(price)}đ
              </span>
            )}
          </div>
        </div>

        {/* Spacer để đẩy buttons xuống dưới */}
        <div className="flex-grow"></div>

        {/* Nút hành động - luôn ở dưới cùng */}
        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-artisan-brown-300 text-artisan-brown-700 hover:bg-artisan-brown-50"
            size="sm"
            onClick={handleProductClick}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    averageRating: PropTypes.number,
    images: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
