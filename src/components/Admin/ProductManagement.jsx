import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  Star,
  DollarSign,
  Calendar,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    // Mock data - thay thế bằng API calls thực tế
    setProducts([
      {
        id: 1,
        code: "SP001",
        name: "Tranh Thêu Tay Hoa Sen",
        category: "Tranh Thêu",
        categoryCode: "TT",
        price: 2500000,
        status: "active",
        description: "Tranh thêu tay hoa sen truyền thống Việt Nam",
        image: "/images/detlua_bg.jpg",
        artist: "Nguyễn Thị Mai",
        stock: 5,
        sold: 12,
        rating: 4.8,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: 2,
        code: "SP002",
        name: "Gốm Sứ Bát Tràng",
        category: "Gốm Sứ",
        categoryCode: "GS",
        price: 1800000,
        status: "active",
        description: "Bộ gốm sứ Bát Tràng cao cấp",
        image: "/images/gom_bg.jpg",
        artist: "Trần Văn Nam",
        stock: 8,
        sold: 25,
        rating: 4.9,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-18",
      },
      {
        id: 3,
        code: "SP003",
        name: "Nón Lá Huế",
        category: "Nón Lá",
        categoryCode: "NL",
        price: 450000,
        status: "active",
        description: "Nón lá Huế thủ công truyền thống",
        image: "/images/nonla_bg.jpg",
        artist: "Lê Thị Hoa",
        stock: 15,
        sold: 8,
        rating: 4.7,
        createdAt: "2024-01-12",
        updatedAt: "2024-01-19",
      },
      {
        id: 4,
        code: "SP004",
        name: "Mây Tre Đan",
        category: "Mây Tre",
        categoryCode: "MT",
        price: 320000,
        status: "inactive",
        description: "Sản phẩm mây tre đan thủ công",
        image: "/images/maytre_bg.jpg",
        artist: "Phạm Văn Đức",
        stock: 0,
        sold: 3,
        rating: 4.5,
        createdAt: "2024-01-08",
        updatedAt: "2024-01-15",
      },
      {
        id: 5,
        code: "SP005",
        name: "Tranh Thêu Con Cò",
        category: "Tranh Thêu",
        categoryCode: "TT",
        price: 3200000,
        status: "active",
        description: "Tranh thêu tay con cò trên đồng lúa",
        image: "/images/detlua_bg.jpg",
        artist: "Nguyễn Thị Mai",
        stock: 3,
        sold: 5,
        rating: 4.9,
        createdAt: "2024-01-05",
        updatedAt: "2024-01-17",
      },
    ]);
  }, []);

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const categories = ["Tranh Thêu", "Gốm Sứ", "Nón Lá", "Mây Tre"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Sản Phẩm
            </h1>
            <p className="text-gray-600">
              Quản lý danh sách sản phẩm và thông tin chi tiết
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Thêm Sản Phẩm</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {product.artist}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {product.rating} ({product.sold} đã bán)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.categoryCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="h-3 w-3 mr-1" />
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {product.stock} sản phẩm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">{indexOfFirstProduct + 1}</span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, filteredProducts.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-l-md"
                >
                  Trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="rounded-none"
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-r-md"
                >
                  Sau
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
