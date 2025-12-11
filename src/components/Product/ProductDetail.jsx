/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { getArtistProfile } from "@/services/artistService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOwner, setIsOwner] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  // Check if current user is the owner of this product
  useEffect(() => {
    const checkOwnership = async () => {
      if (!isLoggedIn || !product) return;
      
      try {
        const response = await getArtistProfile();
        if (response?.isSuccess && response?.data) {
          const { artistProfile, products } = response.data;
          // Check if this product belongs to the current artist
          const isMyProduct = products?.some(p => p.productId === product.productId);
          setIsOwner(isMyProduct);
        }
      } catch {
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [isLoggedIn, product]);

  // Parse images from string
  const parseImages = (imagesString) => {
    try {
      if (!imagesString) {
        return [];
      }

      // Nếu đã là array
      if (Array.isArray(imagesString)) {
        return imagesString.filter((img) => img && typeof img === "string");
      }

      // Nếu là string
      if (typeof imagesString === "string") {
        const trimmed = imagesString.trim();

        // Nếu bắt đầu bằng [ thì có thể là JSON array
        if (trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed.filter((img) => img) : [];
          } catch {
            // Không phải JSON hợp lệ, xử lý như string thường
          }
        }

        // Nếu là URL đơn lẻ (bắt đầu bằng http hoặc https)
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          return [trimmed];
        }

        // Nếu có dấu phẩy, có thể là danh sách URL cách nhau bởi dấu phẩy
        if (trimmed.includes(",")) {
          return trimmed
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url);
        }

        // Trả về như URL đơn lẻ nếu có giá trị
        if (trimmed) {
          return [trimmed];
        }
      }

      return [];
    } catch (error) {
      return [];
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  // Fetch product details
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Thử endpoint khác nếu getProductForCustomer không hoạt động
      let response;
      try {
        response = await productService.getProductForCustomer(id);
      } catch (customerError) {
        response = await productService.getProductById(id);
      }

      if (response && response.isSuccess && response.data) {
        setProduct(response.data);
      } else {
        setError("Không tìm thấy sản phẩm");
      }
    } catch (err) {
      setError("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Ngăn click nhiều lần

    try {
      setIsAddingToCart(true);
      const result = await addToCart(product.productId, quantity);
      if (result.success) {
        toast.success(result.message);

        // Nếu sản phẩm được lưu vào pending (chưa đăng nhập), hỏi có muốn đăng nhập ngay
        if (result.isPending) {
          setTimeout(() => {
            if (
              window.confirm("Bạn có muốn đăng nhập ngay để hoàn tất đơn hàng?")
            ) {
              navigate("/login");
            }
          }, 500);
        }
      } else {
        toast.error(result.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artisan-gold-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            ⚠️ {error || "Không tìm thấy sản phẩm"}
          </div>
          <div className="text-artisan-brown-300 mb-4">ID sản phẩm: {id}</div>
          <Button onClick={() => navigate("/products")} variant="outline">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const images = parseImages(product.images);

  // Fallback images nếu không có ảnh từ API
  const fallbackImages = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
  ];

  const finalImages = images.length > 0 ? images : fallbackImages;
  const mainImage = finalImages[selectedImageIndex] || finalImages[0];

  const discountPercentage = calculateDiscountPercentage(
    product.price,
    product.discountPrice
  );
  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="min-h-screen bg-artisan-brown-950">
      {/* Header */}
      <div className="bg-artisan-brown-900 border-b border-artisan-brown-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/products")}
              className="text-artisan-gold-400 hover:text-artisan-gold-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-artisan-brown-800 flex items-center justify-center">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Ẩn ảnh lỗi và hiện placeholder
                    e.target.style.display = "none";
                    const placeholder =
                      e.target.parentElement.querySelector(
                        ".image-placeholder"
                      );
                    if (placeholder) placeholder.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`image-placeholder w-full h-full items-center justify-center ${
                  mainImage ? "hidden" : "flex"
                }`}
                style={{ display: mainImage ? "none" : "flex" }}
              >
                <div className="text-center">
                  <span className="text-artisan-brown-400 text-6xl block mb-2">
                    📦
                  </span>
                  <p className="text-artisan-brown-300 text-sm">
                    Không có ảnh sản phẩm
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {finalImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {finalImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-artisan-gold-500"
                        : "border-artisan-brown-700 hover:border-artisan-brown-600"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Thay thế bằng placeholder khi ảnh lỗi
                        e.target.onerror = null; // Tránh loop vô hạn
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%238B4513' width='100' height='100'/%3E%3Ctext fill='%23FFFFFF' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-artisan-brown-300">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-artisan-gold-500 fill-current" />
                  <span className="ml-1">
                    {product.averageRating
                      ? `${product.averageRating}/5`
                      : "Chưa có đánh giá"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="ml-1">{product.favoriteCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-artisan-gold-400">
                  {formatPrice(currentPrice)}
                </span>
                {product.discountPrice &&
                  product.discountPrice < product.price && (
                    <>
                      <span className="text-xl text-artisan-brown-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Mô tả sản phẩm
                </h3>
                <p className="text-artisan-brown-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart / Edit Button */}
            <div className="space-y-4">
              {isOwner ? (
                /* Owner View - Show Edit Button */
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 text-sm text-center">
                      🎨 Đây là sản phẩm của bạn
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => navigate(`/profile/edit-product/${product.productId}`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa sản phẩm
                    </Button>
                    <Button
                      variant="outline"
                      className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* Customer View - Show Add to Cart */
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">Số lượng:</span>
                    <div className="flex items-center border border-artisan-brown-700 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 text-white min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || cartLoading}
                      className="flex-1 bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isAddingToCart || cartLoading
                        ? "Đang thêm..."
                        : "Thêm vào giỏ"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {!isLoggedIn && (
                    <div className="p-3 bg-artisan-brown-800/30 rounded-lg border border-artisan-gold-500/30 text-center">
                      <p className="text-artisan-gold-400 text-sm">
                        💡 Sản phẩm sẽ được lưu và tự động thêm vào giỏ hàng sau khi
                        bạn đăng nhập
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Product Details */}
            <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Thông tin sản phẩm
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-artisan-brown-300">Danh mục:</span>
                  <span className="text-white">
                    {product.category || "Chưa phân loại"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-artisan-brown-300">Trạng thái:</span>
                  <span className="text-green-400">Còn hàng</span>
                </div>
                {product.artist && (
                  <div className="flex justify-between">
                    <span className="text-artisan-brown-300">Nghệ nhân:</span>
                    <span className="text-white">{product.artist}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-artisan-brown-700">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white px-8 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
