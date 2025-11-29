import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Palette,
  Star,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtistManagement() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(10);

  useEffect(() => {
    // Mock data - thay thế bằng API calls thực tế
    setArtists([
      {
        id: 1,
        name: "Nguyễn Thị Mai",
        email: "nguyenthimai@email.com",
        phone: "0123456789",
        specialty: "Tranh Thêu",
        status: "active",
        joinDate: "2024-01-15",
        lastActive: "2024-01-20",
        address: "Hà Nội, Việt Nam",
        bio: "Nghệ nhân tranh thêu với hơn 20 năm kinh nghiệm",
        avatar: "/images/detlua_bg.jpg",
        rating: 4.9,
        totalProducts: 15,
        totalSales: 125000000,
        totalOrders: 45,
        verified: true,
        featured: true,
        socialMedia: {
          facebook: "https://facebook.com/nguyenthimai",
          instagram: "https://instagram.com/nguyenthimai",
        },
      },
      {
        id: 2,
        name: "Trần Văn Nam",
        email: "tranvannam@email.com",
        phone: "0987654321",
        specialty: "Gốm Sứ",
        status: "active",
        joinDate: "2024-01-10",
        lastActive: "2024-01-19",
        address: "Bát Tràng, Hà Nội, Việt Nam",
        bio: "Nghệ nhân gốm sứ Bát Tràng truyền thống",
        avatar: "/images/gom_bg.jpg",
        rating: 4.8,
        totalProducts: 22,
        totalSales: 98000000,
        totalOrders: 38,
        verified: true,
        featured: false,
        socialMedia: {
          facebook: "https://facebook.com/tranvannam",
          instagram: "https://instagram.com/tranvannam",
        },
      },
      {
        id: 3,
        name: "Lê Thị Hoa",
        email: "lethihoa@email.com",
        phone: "0369852147",
        specialty: "Nón Lá",
        status: "active",
        joinDate: "2024-01-12",
        lastActive: "2024-01-18",
        address: "Huế, Việt Nam",
        bio: "Nghệ nhân nón lá Huế truyền thống",
        avatar: "/images/nonla_bg.jpg",
        rating: 4.7,
        totalProducts: 18,
        totalSales: 67000000,
        totalOrders: 32,
        verified: true,
        featured: false,
        socialMedia: {
          facebook: "https://facebook.com/lethihoa",
          instagram: "https://instagram.com/lethihoa",
        },
      },
      {
        id: 4,
        name: "Phạm Văn Đức",
        email: "phamvanduc@email.com",
        phone: "0741236985",
        specialty: "Mây Tre",
        status: "inactive",
        joinDate: "2024-01-08",
        lastActive: "2024-01-15",
        address: "Đà Nẵng, Việt Nam",
        bio: "Nghệ nhân mây tre đan thủ công",
        avatar: "/images/maytre_bg.jpg",
        rating: 4.5,
        totalProducts: 12,
        totalSales: 45000000,
        totalOrders: 18,
        verified: false,
        featured: false,
        socialMedia: {
          facebook: "https://facebook.com/phamvanduc",
          instagram: "https://instagram.com/phamvanduc",
        },
      },
      {
        id: 5,
        name: "Hoàng Thị Lan",
        email: "hoangthilan@email.com",
        phone: "0852369741",
        specialty: "Tranh Thêu",
        status: "pending",
        joinDate: "2024-01-20",
        lastActive: "2024-01-20",
        address: "TP. Hồ Chí Minh, Việt Nam",
        bio: "Nghệ nhân tranh thêu mới tham gia",
        avatar: "/images/detlua_bg.jpg",
        rating: 0,
        totalProducts: 0,
        totalSales: 0,
        totalOrders: 0,
        verified: false,
        featured: false,
        socialMedia: {
          facebook: "",
          instagram: "",
        },
      },
    ]);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "pending":
        return "Chờ duyệt";
      case "suspended":
        return "Tạm khóa";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "suspended":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || artist.status === filterStatus;
    const matchesSpecialty =
      filterSpecialty === "all" || artist.specialty === filterSpecialty;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredArtists.slice(
    indexOfFirstArtist,
    indexOfLastArtist
  );
  const totalPages = Math.ceil(filteredArtists.length / artistsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const specialties = ["Tranh Thêu", "Gốm Sứ", "Nón Lá", "Mây Tre", "Gỗ", "Đá"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Nghệ Nhân
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin và hoạt động của nghệ nhân
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Thêm Nghệ Nhân</span>
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
              placeholder="Tìm kiếm nghệ nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="suspended">Tạm khóa</option>
          </select>

          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả chuyên môn</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </Button>
        </div>
      </div>

      {/* Artists Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nghệ nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyên môn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thống kê
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
              {currentArtists.map((artist) => (
                <tr key={artist.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">
                            {artist.name}
                          </div>
                          {artist.verified && (
                            <Award className="h-4 w-4 text-blue-500" />
                          )}
                          {artist.featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {artist.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {artist.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {artist.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Palette className="h-3 w-3 mr-1" />
                      {artist.specialty}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-32">
                      {artist.bio}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {artist.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        <span>{artist.totalProducts} sản phẩm</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>{formatCurrency(artist.totalSales)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {artist.totalOrders} đơn hàng
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        artist.status
                      )}`}
                    >
                      {getStatusIcon(artist.status)}
                      <span className="ml-1">
                        {getStatusText(artist.status)}
                      </span>
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Tham gia: {formatDate(artist.joinDate)}
                    </div>
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
                <span className="font-medium">{indexOfFirstArtist + 1}</span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastArtist, filteredArtists.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredArtists.length}</span>{" "}
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
