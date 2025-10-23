import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const parseImages = (imagesString) => {
    try {
      if (!imagesString) return [];
      const parsed = JSON.parse(imagesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const calculateDiscountPercentage = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const shouldShowOriginalPrice = (originalPrice, discountPrice) => {
    return discountPrice && discountPrice < originalPrice;
  };

  const images = parseImages(product.images);
  const mainImage = images[0];
  const discountPercentage = calculateDiscountPercentage(
    product.price,
    product.discountPrice
  );

  return (
    <Card className="bg-artisan-brown-900 border-artisan-brown-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Ảnh sản phẩm */}
      <div className="relative h-48 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-artisan-brown-800">
            <span className="text-artisan-brown-400 text-4xl">📦</span>
          </div>
        )}

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* Sale badge */}
        {product.discountPrice && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            SALE
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Giá sản phẩm */}
        <div className="mb-3">
          {shouldShowOriginalPrice(product.price, product.discountPrice) ? (
            <div className="flex items-center space-x-2">
              <span className="text-artisan-gold-400 font-bold text-lg">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-artisan-brown-400 line-through text-sm">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-artisan-gold-400 font-bold text-lg">
              {formatPrice(product.discountPrice || product.price)}
            </span>
          )}
        </div>

        {/* Rating và favorite */}
        <div className="flex items-center justify-between text-sm text-artisan-brown-300 mb-4">
          <div className="flex items-center">
            <span className="mr-1">⭐</span>
            <span>
              {product.averageRating
                ? `${product.averageRating}/5`
                : "Chưa có đánh giá"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">❤️</span>
            <span>{product.favoriteCount || 0}</span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="space-y-2">
          <Link to={`/products/${product.productId}`} className="block">
            <Button className="w-full bg-artisan-brown-600 hover:bg-artisan-brown-700 text-white">
              Xem chi tiết
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
          >
            Thêm vào giỏ
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
    images: PropTypes.string,
    averageRating: PropTypes.number,
    favoriteCount: PropTypes.number,
  }).isRequired,
};

export default ProductCard;
