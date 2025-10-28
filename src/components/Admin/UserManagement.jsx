import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllAccounts, deleteAccount } from "@/services/accountService";
import { useToast } from "@/components/ui/Toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const toast = useToast();

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
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteAccount(userId);
        toast.success("Xóa người dùng thành công");
        fetchUsers(); // Refresh the list
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error(err.message || "Không thể xóa người dùng");
      }
    }
  };

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
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Thêm người dùng</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nghệ nhân</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "artist").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "customer").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="artist">Nghệ nhân</option>
              <option value="admin">Quản trị viên</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thống kê
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
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
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "artist"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formatStatus(user.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      {user.totalOrders > 0 && (
                        <div>Đơn hàng: {user.totalOrders}</div>
                      )}
                      {user.totalSpent > 0 && (
                        <div>Chi tiêu: {formatCurrency(user.totalSpent)}</div>
                      )}
                      {user.totalProducts > 0 && (
                        <div>Sản phẩm: {user.totalProducts}</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết người dùng
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Đóng</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={
                      selectedUser.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedUser.name
                      )}&background=random`
                    }
                    alt={selectedUser.name}
                  />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedUser.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Vai trò
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatRole(selectedUser.role)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Trạng thái
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatStatus(selectedUser.status)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Ngày tham gia
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedUser.joinDate}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Địa chỉ
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tổng đơn hàng
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedUser.totalOrders}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tổng chi tiêu
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatCurrency(selectedUser.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUserModal(false)}
                >
                  Đóng
                </Button>
                <Button>Chỉnh sửa</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
