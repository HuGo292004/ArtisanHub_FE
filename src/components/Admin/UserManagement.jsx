import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  RefreshCw,
  X,
  User,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Palette,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllAccounts } from "@/services/accountService";
import { useToast } from "@/components/ui/Toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const toast = useToast();

  // View user detail
  const viewUserDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Close modal
  const closeModals = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "suspended":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "inactive":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "suspended":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "artist":
        return <Palette className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      case "artist":
        return "bg-violet-100 text-violet-700 border border-violet-200";
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200";
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllAccounts();

      if (response && response.data) {
        // Try different possible data structures
        let usersData = null;

        if (
          response.data.isSuccess &&
          response.data.data &&
          response.data.data.items
        ) {
          // Standard API response: { isSuccess: true, data: { items: [...] } }
          usersData = response.data.data.items;
        } else if (
          response.data.isSuccess &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Direct array in data: { isSuccess: true, data: [...] }
          usersData = response.data.data;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          // Direct paginated response: { items: [...], total: 24, ... }
          usersData = response.data.items;
        } else if (response.data.data && response.data.data.items) {
          // Nested data structure: { data: { items: [...] } }
          usersData = response.data.data.items;
        } else if (Array.isArray(response.data)) {
          // Direct array response: [...]
          usersData = response.data;
        } else {
          throw new Error(
            "Cấu trúc dữ liệu không đúng - không tìm thấy danh sách người dùng"
          );
        }

        if (!usersData || !Array.isArray(usersData)) {
          throw new Error("Dữ liệu người dùng không phải là mảng");
        }

        // Transform API data to match our component structure
        const transformedUsers = usersData.map((user, index) => ({
          id: user.accountId || user.id || index + 1,
          name:
            user.username ||
            user.fullName ||
            `User ${user.accountId || user.id}`,
          email: user.email,
          phone: user.phone || "N/A",
          role: user.role?.toLowerCase() || "customer",
          status:
            user.status?.toLowerCase() === "active" ? "active" : "inactive",
          joinDate: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "N/A",
          lastLogin: user.updatedAt
            ? new Date(user.updatedAt).toISOString().split("T")[0]
            : "N/A",
          address: user.address || "N/A",
          totalOrders: 0, // These fields might not be in the API response
          totalSpent: 0,
          totalProducts: 0,
        }));

        setUsers(transformedUsers);
      } else {
        throw new Error("Không có dữ liệu từ API");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Không thể tải dữ liệu người dùng");
      toast.error("Đang sử dụng dữ liệu mẫu do lỗi API");

      // Fallback to mock data if API fails
      const mockUsers = [
        {
          id: 1,
          name: "Nguyễn Văn An",
          email: "nguyenvanan@email.com",
          phone: "0123456789",
          role: "customer",
          status: "active",
          joinDate: "2024-01-15",
          lastLogin: "2024-01-20",
          address: "Hà Nội, Việt Nam",
          totalOrders: 5,
          totalSpent: 2500000,
        },
        {
          id: 2,
          name: "Trần Thị Bình",
          email: "tranthibinh@email.com",
          phone: "0987654321",
          role: "artist",
          status: "active",
          joinDate: "2024-01-10",
          lastLogin: "2024-01-19",
          address: "TP. Hồ Chí Minh, Việt Nam",
          totalOrders: 0,
          totalSpent: 0,
          totalProducts: 12,
        },
        {
          id: 3,
          name: "Lê Văn Cường",
          email: "levancuong@email.com",
          phone: "0369852147",
          role: "customer",
          status: "inactive",
          joinDate: "2024-01-05",
          lastLogin: "2024-01-12",
          address: "Đà Nẵng, Việt Nam",
          totalOrders: 2,
          totalSpent: 1200000,
        },
        {
          id: 4,
          name: "Phạm Thị Dung",
          email: "phamthidung@email.com",
          phone: "0741236985",
          role: "artist",
          status: "active",
          joinDate: "2024-01-08",
          lastLogin: "2024-01-20",
          address: "Huế, Việt Nam",
          totalOrders: 0,
          totalSpent: 0,
          totalProducts: 8,
        },
        {
          id: 5,
          name: "Hoàng Văn Em",
          email: "hoangvanem@email.com",
          phone: "0852369741",
          role: "admin",
          status: "active",
          joinDate: "2024-01-01",
          lastLogin: "2024-01-20",
          address: "Hà Nội, Việt Nam",
          totalOrders: 0,
          totalSpent: 0,
        },
      ];

      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete user
  // const handleDeleteUser = async (userId) => {
  //   if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
  //     try {
  //       await deleteAccount(userId);
  //       toast.success("Xóa người dùng thành công");
  //       fetchUsers(); // Refresh the list
  //     } catch (err) {
  //       console.error("Error deleting user:", err);
  //       toast.error(err.message || "Không thể xóa người dùng");
  //     }
  //   }
  // };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format role display
  const formatRole = (role) => {
    const roleMap = {
      customer: "Khách hàng",
      artist: "Nghệ nhân",
      admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  // Format status display
  const formatStatus = (status) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-0" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-7 h-7" />
            Quản lý tài khoản
          </h1>
          <p className="text-amber-100 mt-1">
            Quản lý tất cả tài khoản người dùng trong hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">
                Tổng tài khoản
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-violet-100 rounded-xl">
              <Palette className="h-6 w-6 text-violet-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Nghệ nhân</p>
              <p className="text-2xl font-bold text-violet-600">
                {users.filter((u) => u.role === "artist").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Khách hàng</p>
              <p className="text-2xl font-bold text-amber-600">
                {users.filter((u) => u.role === "customer").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer transition-all"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="artist">Nghệ nhân</option>
              <option value="admin">Quản trị viên</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thống kê
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-amber-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-11 w-11 flex-shrink-0">
                        <img
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name
                            )}&background=random`
                          }
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-800">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Mail className="h-3 w-3 mr-1 text-slate-400" />
                          {user.email}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Phone className="h-3 w-3 mr-1 text-slate-400" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      {formatRole(user.role)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {getStatusIcon(user.status)}
                      {formatStatus(user.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <div className="space-y-1">
                      {user.totalOrders > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <ShoppingBag className="h-3 w-3 text-amber-500" />
                          <span>{user.totalOrders} đơn hàng</span>
                        </div>
                      )}
                      {user.totalSpent > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <CreditCard className="h-3 w-3 text-emerald-500" />
                          <span>{formatCurrency(user.totalSpent)}</span>
                        </div>
                      )}
                      {user.totalProducts > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Palette className="h-3 w-3 text-violet-500" />
                          <span>{user.totalProducts} sản phẩm</span>
                        </div>
                      )}
                      {!user.totalOrders &&
                        !user.totalSpent &&
                        !user.totalProducts && (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {user.joinDate}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewUserDetail(user)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-2"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // TODO: Bổ sung chức năng đổi trạng thái account
                          console.log("Edit status for user:", user.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2"
                        title="Chỉnh sửa trạng thái"
                      >
                        <Edit className="h-4 w-4 mr-1.5" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  trong{" "}
                  <span className="font-medium">{filteredUsers.length}</span>{" "}
                  kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal - Beautiful Design */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-md"
            onClick={closeModals}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Decorative top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>

            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-8 pt-8 pb-20">
              {/* Close button */}
              <button
                onClick={closeModals}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Header content */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Chi tiết tài khoản
                  </h2>
                  <p className="text-amber-100 text-sm">Thông tin người dùng</p>
                </div>
              </div>
            </div>

            {/* Avatar floating card */}
            <div className="relative -mt-14 px-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                      <img
                        src={
                          selectedUser.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            selectedUser.name
                          )}&background=F59E0B&color=fff&size=128&bold=true`
                        }
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Online indicator */}
                    {selectedUser.status === "active" && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white"></div>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800">
                      {selectedUser.name}
                    </h3>
                    <p className="text-slate-500 mt-1">{selectedUser.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${getRoleColor(
                          selectedUser.role
                        )}`}
                      >
                        {getRoleIcon(selectedUser.role)}
                        {formatRole(selectedUser.role)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${getStatusColor(
                          selectedUser.status
                        )}`}
                      >
                        {getStatusIcon(selectedUser.status)}
                        {formatStatus(selectedUser.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-280px)] px-8 py-6 space-y-5">
              {/* Contact Info Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-amber-600" />
                  </div>
                  Thông tin liên hệ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Điện thoại
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        {selectedUser.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 md:col-span-2">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Địa chỉ
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        {selectedUser.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 text-center border border-amber-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-3 flex items-center justify-center shadow-lg shadow-amber-200">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-amber-700">
                    {selectedUser.totalOrders || 0}
                  </p>
                  <p className="text-xs font-medium text-amber-600 mt-1">
                    Đơn hàng
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 text-center border border-emerald-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 mx-auto mb-3 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xl font-bold text-emerald-700">
                    {formatCurrency(selectedUser.totalSpent || 0)}
                  </p>
                  <p className="text-xs font-medium text-emerald-600 mt-1">
                    Chi tiêu
                  </p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 text-center border border-violet-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 mx-auto mb-3 flex items-center justify-center shadow-lg shadow-violet-200">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-violet-700">
                    {selectedUser.totalProducts || 0}
                  </p>
                  <p className="text-xs font-medium text-violet-600 mt-1">
                    Sản phẩm
                  </p>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  Thời gian hoạt động
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Ngày tham gia
                      </p>
                      <p className="text-sm font-bold text-blue-700">
                        {selectedUser.joinDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Đăng nhập cuối
                      </p>
                      <p className="text-sm font-bold text-indigo-700">
                        {selectedUser.lastLogin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-end">
                <Button
                  onClick={closeModals}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-amber-200 hover:shadow-xl transition-all duration-300"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
