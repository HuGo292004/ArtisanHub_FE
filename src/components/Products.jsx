import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export default function Products() {
  const { addToCart, loading: cartLoading } = useCart();

  const products = [
    {
      id: 1,
      name: "Bình gốm sứ thủ công",
      price: "450,000",
      originalPrice: "600,000",
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      category: "Gốm sứ",
      artisan: "Nghệ nhân Minh Châu",
      isNew: true,
      discount: 25,
    },
    {
      id: 2,
      name: "Túi xách thêu tay",
      price: "320,000",
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      category: "Thêu",
      artisan: "Cô Hương",
      isHot: true,
    },
    {
      id: 3,
      name: "Tranh sơn mài",
      price: "850,000",
      rating: 5.0,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
      category: "Sơn mài",
      artisan: "Thầy Đức",
      isLimited: true,
    },
    {
      id: 4,
      name: "Đèn lồng tre",
      price: "180,000",
      rating: 4.7,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
      category: "Tre nứa",
      artisan: "Làng nghề Phú Vinh",
    },
    {
      id: 5,
      name: "Khăn lụa tơ tằm",
      price: "280,000",
      originalPrice: "350,000",
      rating: 4.6,
      reviews: 203,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      category: "Dệt may",
      artisan: "Làng tơ Vạn Phúc",
      discount: 20,
    },
    {
      id: 6,
      name: "Tượng gỗ thủ công",
      price: "520,000",
      rating: 4.9,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      category: "Mộc",
      artisan: "Làng nghề Đông Ky",
      isNew: true,
    },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="card-hover bg-white dark:bg-artisan-brown-900 border-artisan-brown-200 dark:border-artisan-brown-800 overflow-hidden group"
            >
              <div className="relative">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Mới
                    </span>
                  )}
                  {product.isHot && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Hot
                    </span>
                  )}
                  {product.isLimited && (
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Giới hạn
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-artisan-gold-500 text-white px-2 py-1 rounded text-xs font-medium">
                      -{product.discount}%
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
                    {product.category}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-artisan-brown-900 dark:text-artisan-brown-50 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400 mb-3">
                  {product.artisan}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-artisan-gold-500 fill-current" />
                    <span className="text-sm font-medium text-artisan-brown-900 dark:text-artisan-brown-50 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-artisan-brown-600 dark:text-artisan-brown-400">
                    ({product.reviews} đánh giá)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-artisan-gold-600 dark:text-artisan-gold-400">
                    {product.price}đ
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-artisan-brown-500 line-through">
                      {product.originalPrice}đ
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <Button
                  className="w-full"
                  onClick={async () => {
                    try {
                      const result = await addToCart(product.id, 1);
                      if (result.success) {
                        console.log(result.message);
                      } else {
                        console.error(result.message);
                      }
                    } catch (error) {
                      console.error("Error adding to cart:", error);
                    }
                  }}
                  disabled={cartLoading}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {cartLoading ? "Đang thêm..." : "Thêm vào giỏ"}
                </Button>
                <Link to={`/products/${product.id}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
                  >
                    Xem chi tiết
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View more */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    </section>
  );
}
