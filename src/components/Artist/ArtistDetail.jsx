import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/Product/ProductCard";
import { artistService } from "@/services/artistService";

export const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artistData, setArtistData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetail = async () => {
      try {
        setLoading(true);
        const response = await artistService.getArtistDetail(id);

        if (response && response.isSuccess && response.data) {
          setArtistData(response.data.artistProfile);
          setProducts(response.data.products || []);
        } else {
          throw new Error("Không thể tải dữ liệu nghệ nhân");
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết nghệ nhân:", err);
        setError(err.message || "Không thể tải thông tin nghệ nhân");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtistDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        {/* Header với nút quay lại */}
        <div className="bg-artisan-brown-900 py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/stores")}
                variant="outline"
                className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Quay lại danh sách
              </Button>
              <div className="text-artisan-brown-300 text-sm">
                Đang tải thông tin cửa hàng...
              </div>
            </div>
          </div>
        </div>

        {/* Loading content */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-artisan-brown-700 border-t-artisan-gold-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-artisan-gold-400 text-2xl">👨‍🎨</div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-artisan-gold-400 mb-2">
                Đang tải thông tin cửa hàng
              </h2>
              <p className="text-artisan-brown-300 text-lg">
                Vui lòng chờ trong giây lát...
              </p>
              <div className="mt-4 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-artisan-gold-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-artisan-gold-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-artisan-gold-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        {/* Header với nút quay lại */}
        <div className="bg-artisan-brown-900 py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/stores")}
                variant="outline"
                className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Quay lại danh sách
              </Button>
              <div className="text-artisan-brown-300 text-sm">
                Có lỗi xảy ra
              </div>
            </div>
          </div>
        </div>

        {/* Error content */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
                <div className="text-red-500 text-4xl">⚠️</div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>

            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-red-400 mb-4">
                Oops! Có lỗi xảy ra
              </h2>
              <p className="text-artisan-brown-300 text-lg mb-6 leading-relaxed">
                {error}
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  🔄 Thử lại
                </Button>

                <div className="text-center">
                  <Button
                    onClick={() => navigate("/stores")}
                    variant="outline"
                    className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    ← Quay lại danh sách cửa hàng
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-artisan-brown-800 rounded-lg">
                <p className="text-artisan-brown-400 text-sm">
                  💡 <strong>Gợi ý:</strong> Kiểm tra kết nối internet hoặc thử
                  lại sau ít phút
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        {/* Header với nút quay lại */}
        <div className="bg-artisan-brown-900 py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/stores")}
                variant="outline"
                className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Quay lại danh sách
              </Button>
              <div className="text-artisan-brown-300 text-sm">
                Không tìm thấy cửa hàng
              </div>
            </div>
          </div>
        </div>

        {/* Not found content */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-artisan-brown-700 rounded-full flex items-center justify-center">
                <div className="text-artisan-brown-400 text-4xl">🔍</div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-artisan-gold-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
            </div>

            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-artisan-gold-400 mb-4">
                Không tìm thấy cửa hàng
              </h2>
              <p className="text-artisan-brown-300 text-lg mb-6 leading-relaxed">
                Cửa hàng bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/stores")}
                  className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  🏪 Xem danh sách cửa hàng
                </Button>

                <div className="text-center">
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    🏠 Về trang chủ
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-artisan-brown-800 rounded-lg">
                <p className="text-artisan-brown-400 text-sm">
                  💡 <strong>Gợi ý:</strong> Kiểm tra lại đường link hoặc tìm
                  kiếm cửa hàng khác
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950">
      {/* Header với nút quay lại */}
      <div className="bg-artisan-brown-900 py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/stores")}
              variant="outline"
              className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách
            </Button>
            <div className="text-artisan-brown-300 text-sm">
              Chi tiết nghệ nhân
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Thông tin nghệ nhân */}
        <Card className="bg-artisan-brown-900 border-artisan-brown-700 mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Ảnh đại diện */}
              <div className="md:w-1/3">
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                  {artistData.profileImage ? (
                    <img
                      src={artistData.profileImage}
                      alt={artistData.artistName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full ${
                      artistData.profileImage ? "hidden" : "flex"
                    } items-center justify-center bg-gradient-to-br from-artisan-brown-200 to-artisan-brown-300`}
                  >
                    <div className="text-center text-artisan-brown-600">
                      <div className="text-2xl mb-2">👨‍🎨</div>
                      <div className="text-sm font-medium">Nghệ nhân</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="md:w-2/3">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-artisan-gold-400 mb-2">
                    {artistData.artistName}
                  </h1>
                  <h2 className="text-xl text-artisan-brown-200 mb-2">
                    {artistData.shopName}
                  </h2>
                  <div className="flex items-center text-artisan-brown-300 mb-4">
                    <span className="mr-2">📍</span>
                    <span>{artistData.location}</span>
                  </div>
                </div>

                {/* Chuyên môn và kinh nghiệm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-artisan-brown-800 p-4 rounded-lg">
                    <h3 className="text-artisan-gold-400 font-semibold mb-2">
                      Chuyên môn
                    </h3>
                    <p className="text-white">{artistData.specialty}</p>
                  </div>
                  <div className="bg-artisan-brown-800 p-4 rounded-lg">
                    <h3 className="text-artisan-gold-400 font-semibold mb-2">
                      Kinh nghiệm
                    </h3>
                    <p className="text-white">
                      {artistData.experienceYears} năm
                    </p>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="mb-6">
                  <h3 className="text-artisan-gold-400 font-semibold mb-2">
                    Giới thiệu
                  </h3>
                  <p className="text-artisan-brown-200 leading-relaxed">
                    {artistData.bio}
                  </p>
                </div>

                {/* Thành tích */}
                <div className="mb-6">
                  <h3 className="text-artisan-gold-400 font-semibold mb-2">
                    Thành tích
                  </h3>
                  {artistData.achievements &&
                  artistData.achievements.length > 0 ? (
                    <div className="space-y-2">
                      {artistData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-artisan-gold-500 mr-2 mt-1">
                            🏆
                          </span>
                          <span className="text-artisan-brown-200">
                            {achievement.description || achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-artisan-brown-400 italic">
                      Chưa có thành tích nào
                    </p>
                  )}
                </div>

                {/* Nút liên hệ */}
                <Button className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white px-8 py-3">
                  Liên hệ nghệ nhân
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Danh sách sản phẩm */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-artisan-gold-400 mb-6">
            Sản phẩm của cửa hàng ({products.length})
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onViewDetail={() =>
                    navigate(`/products/${product.productId}`)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-artisan-brown-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Chưa có sản phẩm nào
              </h3>
              <p className="text-artisan-brown-300">
                Nghệ nhân chưa đăng sản phẩm nào
              </p>
            </div>
          )}
        </div>

        {/* Nút quay lại ở cuối trang */}
        <div className="text-center py-8">
          <Button
            onClick={() => navigate("/stores")}
            variant="outline"
            className="border-artisan-brown-300 text-artisan-brown-300 hover:bg-artisan-brown-800 hover:text-white transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách cửa hàng
          </Button>
        </div>
      </div>
    </div>
  );
};
