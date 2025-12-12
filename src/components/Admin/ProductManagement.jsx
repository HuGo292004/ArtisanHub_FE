import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  Package,
  Star,
  Tag,
  Loader2,
  AlertCircle,
  Heart,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Scale,
  FileText,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const viewProductDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const fetchProducts = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getAllProducts({ page, size });

      if (response && response.isSuccess && response.data) {
        const { items, total, totalPages: pages } = response.data;

        const mappedProducts = items.map((item) => ({
          id: item.productId,
          code: `SP${String(item.productId).padStart(3, "0")}`,
          name: item.name,
          category: item.categoryName,
          categoryCode:
            item.categoryName?.substring(0, 2).toUpperCase() || "XX",
          price: item.price,
          discountPrice: item.discountPrice,
          status: "active",
          description: item.description,
          story: item.story,
          image: parseImages(item.images),
          artist: item.artistName,
          weight: item.weight,
          rating: item.averageRating || 0,
          favoriteCount: item.favoriteCount || 0,
        }));

        setProducts(mappedProducts);
        setTotalProducts(total);
        setTotalPages(pages);

        const uniqueCategories = [
          ...new Set(items.map((item) => item.categoryName).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } else if (response && response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];
        setProducts(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const parseImages = (images) => {
    if (!images) return "/images/placeholder.jpg";
    if (typeof images === "string" && images.startsWith("{")) {
      const parsed = images.slice(1, -1).split(",")[0];
      return parsed.replace(/"/g, "") || "/images/placeholder.jpg";
    }
    if (typeof images === "string") return images;
    if (Array.isArray(images) && images.length > 0) return images[0];
    return "/images/placeholder.jpg";
  };

  useEffect(() => {
    fetchProducts(currentPage, productsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, productsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const currentProducts = filteredProducts;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-slate-100 text-slate-600 border border-slate-200";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-0" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Đã xảy ra lỗi
          </h3>
          <p className="text-slate-600">{error}</p>
          <Button
            onClick={() => fetchProducts(currentPage, productsPerPage)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Sản Phẩm</h1>
            <p className="text-emerald-100 text-lg">
              Tổng cộng {totalProducts} sản phẩm trong hệ thống
            </p>
          </div>
          <Button
            onClick={() => fetchProducts(currentPage, productsPerPage)}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          <Button
            variant="outline"
            className="h-12 border-2 border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc nâng cao
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {product.artist}
                        </p>
                        <p className="text-xs text-slate-400">{product.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {formatCurrency(product.price)}
                      </p>
                      {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <p className="text-sm text-emerald-600 font-medium">
                            → {formatCurrency(product.discountPrice)}
                          </p>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {product.rating > 0 ? (
                          <>
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium text-slate-700">
                              {product.rating.toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400">--</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-rose-500">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{product.favoriteCount}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewProductDetail(product)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Trang <span className="font-semibold">{currentPage}</span> /{" "}
              <span className="font-semibold">{totalPages}</span> • Tổng{" "}
              <span className="font-semibold">{totalProducts}</span> sản phẩm
              {loading && (
                <Loader2 className="inline-block w-4 h-4 ml-2 animate-spin text-amber-600" />
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="border-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                    className={
                      currentPage === pageNum
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "border-slate-200"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="border-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetailModal}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500">
              <h2 className="text-xl font-bold text-white">
                Chi tiết sản phẩm
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDetailModal}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span className="font-semibold text-slate-800">
                        {selectedProduct.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-rose-500">
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold text-slate-800">
                        {selectedProduct.favoriteCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium mb-2">
                      <Tag className="w-3 h-3" />
                      {selectedProduct.category}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Mã: {selectedProduct.code}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm text-amber-700 mb-1">Giá bán</p>
                    <div className="flex items-baseline gap-2">
                      {selectedProduct.discountPrice &&
                      selectedProduct.discountPrice < selectedProduct.price ? (
                        <>
                          <span className="text-2xl font-bold text-amber-600">
                            {formatCurrency(selectedProduct.discountPrice)}
                          </span>
                          <span className="text-lg text-slate-400 line-through">
                            {formatCurrency(selectedProduct.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-amber-600">
                          {formatCurrency(selectedProduct.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Artist */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Nghệ nhân</p>
                      <p className="font-semibold text-slate-800">
                        {selectedProduct.artist || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Scale className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Khối lượng</p>
                      <p className="font-semibold text-slate-800">
                        {selectedProduct.weight || 0} gram
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Trạng thái:</span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedProduct.status
                      )}`}
                    >
                      {getStatusText(selectedProduct.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    Mô tả sản phẩm
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* Story */}
              {selectedProduct.story && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Câu chuyện sản phẩm
                  </h4>
                  <p className="text-amber-700 text-sm leading-relaxed italic">
                    &ldquo;{selectedProduct.story}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
