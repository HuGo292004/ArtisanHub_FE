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
  Loader2,
  AlertCircle,
  X,
  User,
  FileText,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";

export default function ArtistManagement() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Xem chi tiết nghệ nhân
  const viewArtistDetail = (artist) => {
    setSelectedArtist(artist);
    setShowDetailModal(true);
  };

  // Mở modal chỉnh sửa trạng thái
  const openStatusModal = (artist) => {
    setSelectedArtist(artist);
    setNewStatus(artist.status);
    setShowStatusModal(true);
  };

  // Đóng modal
  const closeModals = () => {
    setShowDetailModal(false);
    setShowStatusModal(false);
    setSelectedArtist(null);
    setNewStatus("");
  };

  // Cập nhật trạng thái nghệ nhân
  const updateArtistStatus = async () => {
    if (!selectedArtist || !newStatus) return;

    try {
      setUpdatingStatus(true);
      
      // Gọi API cập nhật trạng thái (cần thêm API này vào adminService)
      // await adminService.updateArtistStatus(selectedArtist.id, newStatus);
      
      // Tạm thời cập nhật local state
      setArtists(prevArtists => 
        prevArtists.map(artist => 
          artist.id === selectedArtist.id 
            ? { ...artist, status: newStatus }
            : artist
        )
      );

      alert(`Đã cập nhật trạng thái nghệ nhân ${selectedArtist.name} thành "${getStatusText(newStatus)}"`);
      closeModals();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy danh sách nghệ nhân
      const response = await adminService.getAllArtists();
      
      // Xử lý response và cập nhật state
      if (response) {
        // API có thể trả về array trực tiếp hoặc object với data property
        const artistsData = Array.isArray(response) ? response : (response.data || response.artists || []);
        setArtists(artistsData);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách nghệ nhân:", err);
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-artisan-gold-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách nghệ nhân...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchArtists}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Nghệ Nhân</h1>
            <p className="text-amber-100 text-lg">
              Quản lý thông tin và hoạt động của nghệ nhân
            </p>
          </div>
          <Button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border-0">
            <Plus className="h-5 w-5" />
            <span>Thêm Nghệ Nhân</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm nghệ nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
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
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="all">Tất cả chuyên môn</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <Button variant="outline" className="flex items-center space-x-2 h-12 border-2 border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </Button>
        </div>
      </div>

      {/* Artists Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Nghệ nhân
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Chuyên môn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thống kê
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {currentArtists.map((artist) => (
                <tr key={artist.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-amber-100">
                          <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-semibold text-slate-900">
                            {artist.name}
                          </div>
                          {artist.verified && (
                            <Award className="h-4 w-4 text-blue-600" />
                          )}
                          {artist.featured && (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <div className="text-sm text-slate-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-amber-500" />
                          {artist.email}
                        </div>
                        <div className="text-sm text-slate-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-amber-500" />
                          {artist.phone}
                        </div>
                        <div className="text-sm text-slate-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-amber-500" />
                          {artist.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                      <Palette className="h-3 w-3 mr-1" />
                      {artist.specialty}
                    </span>
                    <div className="text-xs text-slate-500 mt-1 truncate max-w-32">
                      {artist.bio}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                      <span className="text-sm font-semibold text-slate-900">
                        {artist.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-700">
                        <Package className="h-3 w-3 mr-1 text-amber-600" />
                        <span className="font-medium">{artist.totalProducts}</span>
                        <span className="text-slate-500 ml-1">sản phẩm</span>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <DollarSign className="h-3 w-3 mr-1 text-emerald-600" />
                        <span className="font-semibold text-emerald-700">{formatCurrency(artist.totalSales)}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {artist.totalOrders} đơn hàng
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                        artist.status
                      )}`}
                    >
                      {getStatusIcon(artist.status)}
                      <span className="ml-1">
                        {getStatusText(artist.status)}
                      </span>
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      Tham gia: {formatDate(artist.joinDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewArtistDetail(artist)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openStatusModal(artist)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Chỉnh sửa trạng thái"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Trạng thái
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
              <p className="text-sm text-slate-700">
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

      {/* Artist Detail Modal */}
      {showDetailModal && selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModals}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500">
              <h2 className="text-xl font-bold text-white">
                Chi tiết nghệ nhân
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModals}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar & Basic Info */}
                <div className="md:col-span-1 text-center">
                  <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto overflow-hidden ring-4 ring-amber-100">
                    <img
                      src={selectedArtist.avatar}
                      alt={selectedArtist.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-4 flex items-center justify-center gap-2">
                    {selectedArtist.name}
                    {selectedArtist.verified && (
                      <Award className="w-5 h-5 text-blue-600" />
                    )}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-800">
                      {selectedArtist.rating}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mt-3 ${getStatusColor(
                      selectedArtist.status
                    )}`}
                  >
                    {getStatusIcon(selectedArtist.status)}
                    <span className="ml-1">{getStatusText(selectedArtist.status)}</span>
                  </span>
                </div>

                {/* Details */}
                <div className="md:col-span-2 space-y-4">
                  {/* Contact Info */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-600" />
                      Thông tin liên hệ
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-500" />
                        {selectedArtist.email}
                      </p>
                      <p className="text-sm text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-500" />
                        {selectedArtist.phone}
                      </p>
                      <p className="text-sm text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        {selectedArtist.address}
                      </p>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-600" />
                      Chuyên môn
                    </h4>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedArtist.specialty}
                    </span>
                    {selectedArtist.bio && (
                      <p className="text-sm text-blue-700 mt-2 italic">
                        {selectedArtist.bio}
                      </p>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                      <Package className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-amber-800">
                        {selectedArtist.totalProducts}
                      </p>
                      <p className="text-xs text-amber-600">Sản phẩm</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                      <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-emerald-800">
                        {formatCurrency(selectedArtist.totalSales)}
                      </p>
                      <p className="text-xs text-emerald-600">Doanh thu</p>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-4 text-center border border-violet-100">
                      <ShoppingBag className="w-6 h-6 text-violet-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-violet-800">
                        {selectedArtist.totalOrders}
                      </p>
                      <p className="text-xs text-violet-600">Đơn hàng</p>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Tham gia từ: {formatDate(selectedArtist.joinDate)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={closeModals}
                  className="border-slate-200"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    closeModals();
                    openStatusModal(selectedArtist);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa trạng thái
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Edit Modal */}
      {showStatusModal && selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModals}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-indigo-500">
              <h2 className="text-xl font-bold text-white">
                Chỉnh sửa trạng thái
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModals}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Artist Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                  <img
                    src={selectedArtist.avatar}
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selectedArtist.name}</p>
                  <p className="text-sm text-slate-500">{selectedArtist.email}</p>
                </div>
              </div>

              {/* Current Status */}
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Trạng thái hiện tại:</p>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    selectedArtist.status
                  )}`}
                >
                  {getStatusIcon(selectedArtist.status)}
                  <span className="ml-1">{getStatusText(selectedArtist.status)}</span>
                </span>
              </div>

              {/* New Status Select */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Chọn trạng thái mới:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="active">✅ Hoạt động</option>
                  <option value="inactive">⏸️ Không hoạt động</option>
                  <option value="pending">⏳ Chờ duyệt</option>
                  <option value="suspended">🚫 Tạm khóa</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={closeModals}
                  disabled={updatingStatus}
                  className="border-slate-200"
                >
                  Hủy
                </Button>
                <Button
                  onClick={updateArtistStatus}
                  disabled={updatingStatus || newStatus === selectedArtist.status}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updatingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Cập nhật
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
