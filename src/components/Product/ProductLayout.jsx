import { useState, useEffect } from "react";
import ProductHero from "./components/ProductHero";
import ProductCard from "./components/ProductCard";
import { productService } from "@/services/productService";

export const ProductLayout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    rating: "",
    availability: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    size: 12,
    total: 0,
    totalPages: 0,
  });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      rating: "",
      availability: "",
    });
    setSearchTerm("");
  };

  // Fetch products from API
  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAllProducts({
        page,
        size: pagination.size,
        searchTerm: search,
      });

      if (response && response.isSuccess && response.data) {
        console.log(
          "Sử dụng dữ liệu từ API:",
          response.data.items?.length || 0,
          "sản phẩm"
        );
        setProducts(response.data.items || []);
        setFilteredProducts(response.data.items || []);
        setPagination({
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } else {
        console.warn("API response format không đúng");
        console.log(
          "Expected format: { isSuccess: true, data: { items: [...] } }"
        );
        console.log("Actual response:", response);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setError(err.message || "Không thể tải danh sách sản phẩm");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc sản phẩm theo từ khóa tìm kiếm và filters
  useEffect(() => {
    let filtered = products;

    // Filter by search term (tìm theo tên sản phẩm)
    if (searchTerm.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.category &&
          product.category
            .toLowerCase()
            .includes(filters.category.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.discountPrice || product.price;
        switch (filters.priceRange) {
          case "0-100000":
            return price >= 0 && price <= 100000;
          case "100000-500000":
            return price > 100000 && price <= 500000;
          case "500000-1000000":
            return price > 500000 && price <= 1000000;
          case "1000000+":
            return price > 1000000;
          default:
            return true;
        }
      });
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter((product) => {
        const rating = product.averageRating || 0;
        switch (filters.rating) {
          case "4+":
            return rating >= 4;
          case "3+":
            return rating >= 3;
          case "2+":
            return rating >= 2;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filters, products]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchProducts(newPage, searchTerm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        <ProductHero />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artisan-brown-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-artisan-brown-950">
        <ProductHero />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️{error}</div>
            <button
              onClick={() => fetchProducts()}
              className="bg-artisan-brown-600 text-white px-6 py-2 rounded-lg hover:bg-artisan-brown-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-brown-950">
      <ProductHero />

      {/* Thanh tìm kiếm và bộ lọc */}
      <section className="py-8 bg-artisan-brown-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search by name */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 border border-artisan-brown-700 bg-artisan-brown-800 text-white placeholder-artisan-brown-300 rounded-lg search-input-focus"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-artisan-gold-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Danh mục
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="gốm sứ">Gốm sứ</option>
                  <option value="thêu">Thêu</option>
                  <option value="sơn mài">Sơn mài</option>
                  <option value="tre nứa">Tre nứa</option>
                  <option value="dệt may">Dệt may</option>
                  <option value="mộc">Mộc</option>
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Giá
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả giá</option>
                  <option value="0-100000">Dưới 100.000đ</option>
                  <option value="100000-500000">100.000đ - 500.000đ</option>
                  <option value="500000-1000000">500.000đ - 1.000.000đ</option>
                  <option value="1000000+">Trên 1.000.000đ</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Đánh giá
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters({ ...filters, rating: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả đánh giá</option>
                  <option value="4+">4 sao trở lên</option>
                  <option value="3+">3 sao trở lên</option>
                  <option value="2+">2 sao trở lên</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-artisan-brown-200 text-sm font-medium mb-2">
                  Trạng thái
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) =>
                    setFilters({ ...filters, availability: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-artisan-brown-700 bg-artisan-brown-800 text-white rounded-lg focus:ring-2 focus:ring-artisan-gold-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value="available">Còn hàng</option>
                  <option value="limited">Số lượng có hạn</option>
                </select>
              </div>
            </div>

            {/* Reset button */}
            <div className="text-center">
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-artisan-brown-700 hover:bg-artisan-brown-600 text-white rounded-lg transition-colors text-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách sản phẩm */}
      <section id="products-section" className="py-16 bg-artisan-brown-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-artisan-gold-400 mb-4 mt-8">
              Danh Sách Sản Phẩm
            </h2>
            <p className="text-artisan-brown-200 text-lg">
              Tìm thấy {filteredProducts.length} sản phẩm
              {searchTerm && ` cho "${searchTerm}"`}
            </p>

            {/* Active filters display */}
            {(searchTerm ||
              Object.values(filters).some((filter) => filter !== "")) && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {filters.category && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Danh mục: {filters.category}
                  </span>
                )}
                {filters.priceRange && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Giá:{" "}
                    {filters.priceRange === "0-100000"
                      ? "Dưới 100.000đ"
                      : filters.priceRange === "100000-500000"
                      ? "100.000đ - 500.000đ"
                      : filters.priceRange === "500000-1000000"
                      ? "500.000đ - 1.000.000đ"
                      : "Trên 1.000.000đ"}
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 bg-artisan-gold-500/20 text-artisan-gold-300 rounded-full text-sm">
                    Đánh giá: {filters.rating} sao trở lên
                  </span>
                )}
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-artisan-gold-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-artisan-brown-300">
                Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 bg-artisan-brown-700 hover:bg-artisan-brown-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Trước
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pagination.page
                          ? "bg-artisan-gold-500 text-white"
                          : "bg-artisan-brown-700 hover:bg-artisan-brown-600 text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 bg-artisan-brown-700 hover:bg-artisan-brown-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
