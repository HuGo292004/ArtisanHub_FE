import { useState, useEffect } from "react";
import { Star, Heart, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getTrendingProducts(10);

        // Response interceptor đã trả về response.data, nên response chính là data object
        if (response && response.isSuccess) {
          setProducts(response.data || []);
        } else {
          throw new Error("Không thể lấy dữ liệu sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm trending:", err);
        setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  // Helper function để format giá tiền
  const formatPrice = (price) => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Helper function để parse images từ JSON string
  const parseImages = (imagesString) => {
    try {
      if (!imagesString) return null;
      const images = JSON.parse(imagesString);
      return Array.isArray(images) ? images[0] : images;
    } catch {
      return null;
    }
  };

  // Helper function để tính discount percentage
  const calculateDiscount = (price, discountPrice) => {
    if (!discountPrice || !price) return null;
    const discount = Math.round(((price - discountPrice) / price) * 100);
    return discount > 0 ? discount : null;
  };

  return (
    <section className="py-20" id="products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-artisan-gold-100 dark:bg-artisan-gold-900/30 text-artisan-gold-700 dark:text-artisan-gold-300 text-sm font-medium mb-4">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sản phẩm nổi bật
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-artisan-brown-900 dark:text-artisan-brown-50 mb-4">
            Khám phá bộ sưu tập
            <span className="text-gradient-gold"> đặc sắc</span>
          </h2>
          <p className="text-lg text-artisan-brown-600 dark:text-artisan-brown-400 max-w-2xl mx-auto">
            Những tác phẩm thủ công tinh xảo được tuyển chọn từ các nghệ nhân
            hàng đầu Việt Nam
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-artisan-gold-600" />
              <p className="text-artisan-brown-600 dark:text-artisan-brown-400">
                Đang tải sản phẩm...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-medium">Không thể tải sản phẩm</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Thử lại
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product) => (
              <Card
                key={product.productId}
                className="card-hover bg-white dark:bg-artisan-brown-900 border-artisan-brown-200 dark:border-artisan-brown-800 overflow-hidden group"
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        parseImages(product.images) ||
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop";
                      }}
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.favoriteCount > 10 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Hot
                      </span>
                    )}
                    {calculateDiscount(
                      product.price,
                      product.discountPrice
                    ) && (
                      <span className="bg-artisan-gold-500 text-white px-2 py-1 rounded text-xs font-medium">
                        -
                        {calculateDiscount(
                          product.price,
                          product.discountPrice
                        )}
                        %
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-artisan-gold-600 dark:text-artisan-gold-400 font-medium">
                      {product.categoryName || "Chưa phân loại"}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-artisan-brown-900 dark:text-artisan-brown-50 mb-2 line-clamp-2">
                    {product.name || "Tên sản phẩm"}
                  </h3>
                  <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400 mb-3">
                    {product.artistName || "Nghệ nhân"}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-artisan-gold-500 fill-current" />
                      <span className="text-sm font-medium text-artisan-brown-900 dark:text-artisan-brown-50 ml-1">
                        {product.averageRating
                          ? product.averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                    <span className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400">
                      ({product.favoriteCount || 0} yêu thích)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-artisan-gold-600 dark:text-artisan-gold-400">
                      {formatPrice(product.discountPrice || product.price)}đ
                    </span>
                    {product.discountPrice &&
                      product.price > product.discountPrice && (
                        <span className="text-sm text-artisan-brown-500 line-through">
                          {formatPrice(product.price)}đ
                        </span>
                      )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-artisan-brown-500 mb-4">
              <p className="text-lg font-medium">Chưa có sản phẩm trending</p>
              <p className="text-sm">
                Hãy quay lại sau để xem các sản phẩm nổi bật
              </p>
            </div>
          </div>
        )}

        {/* View more */}
        {!loading && !error && products.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg" className="px-8">
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
