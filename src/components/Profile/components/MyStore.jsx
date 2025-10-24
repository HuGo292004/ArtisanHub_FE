import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getArtistProfile } from "@/services/authService";
import PageLoader from "@/components/ui/PageLoader";

const MyStore = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [artistProfile, setArtistProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalViews: 0,
  });

  // Fetch artist profile and products
  const fetchArtistData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getArtistProfile();

      if (response && response.isSuccess && response.data) {
        const { artistProfile: profile, products: productsData } =
          response.data;

        setArtistProfile(profile);
        setProducts(productsData || []);

        // Calculate stats from real data
        const totalProducts = productsData?.length || 0;
        const totalRevenue =
          productsData?.reduce((sum, product) => {
            return sum + (product.discountPrice || product.price);
          }, 0) || 0;

        setStats({
          totalProducts,
          totalSales: 0, // This would need to come from order data
          totalRevenue,
          totalViews: 0, // This would need to come from analytics data
        });
      } else {
        // If no artist profile exists, still show the store with empty data
        setArtistProfile(null);
        setProducts([]);
        setStats({
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          totalViews: 0,
        });
      }
    } catch {
      // If API fails, still show the store with empty data
      setArtistProfile(null);
      setProducts([]);
      setStats({
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalViews: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleEditProduct = (productId) => {
    // Navigate to edit product page
    console.log("Edit product:", productId);
  };

  const handleDeleteProduct = (productId) => {
    // Handle delete product
    console.log("Delete product:", productId);
  };

  const handleViewProduct = (productId) => {
    // Navigate to product detail page
    navigate(`/products/${productId}`);
  };

  const handleRetry = () => {
    fetchArtistData();
  };

  return (
    <PageLoader
      loading={loading}
      error={error}
      onRetry={handleRetry}
      loadingText="Đang tải thông tin cửa hàng..."
      errorTitle="Không thể tải dữ liệu cửa hàng"
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Store Info Header */}
        <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-artisan-brown-800 border-4 border-artisan-gold-500 overflow-hidden">
              {artistProfile?.profileImage ? (
                <img
                  src={artistProfile.profileImage}
                  alt={artistProfile.artistName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-artisan-gold-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {artistProfile?.shopName || "Cửa hàng của tôi"}
              </h1>
              <p className="text-artisan-gold-400 font-medium mb-2">
                {artistProfile?.artistName || "Nghệ nhân"}
              </p>
              <p className="text-artisan-brown-300 text-sm mb-2">
                {artistProfile?.bio || "Chưa cập nhật thông tin cửa hàng"}
              </p>
              <div className="flex items-center space-x-4 text-sm text-artisan-brown-300">
                <span>📍 {artistProfile?.location || "Chưa cập nhật"}</span>
                <span>🎯 {artistProfile?.specialty || "Chưa cập nhật"}</span>
                <span>
                  ⏰ {artistProfile?.experienceYears || 0} năm kinh nghiệm
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Sản phẩm của tôi
            </h2>
            <p className="text-artisan-brown-300">
              Quản lý sản phẩm và theo dõi hiệu suất bán hàng
            </p>
          </div>
          <Button
            className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
            onClick={() => navigate("/profile/add-product")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-artisan-gold-500/20 rounded-lg">
                <Package className="w-6 h-6 text-artisan-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-artisan-brown-300 text-sm">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-artisan-brown-300 text-sm">Tổng bán hàng</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalSales}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-artisan-brown-300 text-sm">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-artisan-brown-900 border-artisan-brown-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-artisan-brown-300 text-sm">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalViews}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Products List */}
        <Card className="bg-artisan-brown-900 border-artisan-brown-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Sản phẩm của tôi
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-artisan-brown-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Chưa có sản phẩm nào
                </h3>
                <p className="text-artisan-brown-300 mb-6">
                  Bắt đầu bán hàng bằng cách thêm sản phẩm đầu tiên của bạn
                </p>
                <Button
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
                  onClick={() => navigate("/products/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.productId}
                    className="bg-artisan-brown-800 rounded-lg overflow-hidden border border-artisan-brown-600 hover:border-artisan-gold-500 transition-colors"
                  >
                    <div className="aspect-w-16 aspect-h-12">
                      <img
                        src={product.images}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {product.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Hoạt động
                        </span>
                      </div>

                      <div className="mb-3">
                        {product.discountPrice &&
                        product.discountPrice < product.price ? (
                          <div>
                            <p className="text-artisan-gold-400 font-bold text-lg">
                              {formatCurrency(product.discountPrice)}
                            </p>
                            <p className="text-artisan-brown-400 line-through text-sm">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-artisan-gold-400 font-bold text-lg">
                            {formatCurrency(product.price)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-artisan-brown-300 mb-4">
                        <span>
                          Đánh giá:{" "}
                          {product.averageRating
                            ? `${product.averageRating}/5`
                            : "Chưa có"}
                        </span>
                        <span>Yêu thích: {product.favoriteCount}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProduct(product.productId)}
                          className="flex-1 border-artisan-gold-500 text-artisan-gold-400 hover:bg-artisan-gold-500 hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product.productId)}
                          className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.productId)}
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageLoader>
  );
};

export default MyStore;
