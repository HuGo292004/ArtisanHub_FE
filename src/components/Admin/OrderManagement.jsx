import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  ShoppingCart,
  User,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    // Mock data - thay thế bằng API calls thực tế
    setOrders([
      {
        id: "ORD001",
        customer: {
          name: "Nguyễn Văn An",
          email: "nguyenvanan@email.com",
          phone: "0123456789",
          address: "123 Đường ABC, Quận 1, TP.HCM",
        },
        products: [
          {
            id: 1,
            name: "Tranh Thêu Tay Hoa Sen",
            quantity: 1,
            price: 2500000,
            image: "/images/detlua_bg.jpg",
          },
        ],
        totalAmount: 2500000,
        status: "pending",
        paymentMethod: "bank_transfer",
        paymentStatus: "pending",
        shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
        notes: "Giao hàng vào buổi chiều",
        createdAt: "2024-01-20T10:30:00Z",
        updatedAt: "2024-01-20T10:30:00Z",
        estimatedDelivery: "2024-01-25",
      },
      {
        id: "ORD002",
        customer: {
          name: "Trần Thị Bình",
          email: "tranthibinh@email.com",
          phone: "0987654321",
          address: "456 Đường XYZ, Quận 2, TP.HCM",
        },
        products: [
          {
            id: 2,
            name: "Gốm Sứ Bát Tràng",
            quantity: 2,
            price: 1800000,
            image: "/images/gom_bg.jpg",
          },
          {
            id: 3,
            name: "Nón Lá Huế",
            quantity: 1,
            price: 450000,
            image: "/images/nonla_bg.jpg",
          },
        ],
        totalAmount: 4050000,
        status: "processing",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        shippingAddress: "456 Đường XYZ, Quận 2, TP.HCM",
        notes: "",
        createdAt: "2024-01-19T14:20:00Z",
        updatedAt: "2024-01-19T15:45:00Z",
        estimatedDelivery: "2024-01-24",
      },
      {
        id: "ORD003",
        customer: {
          name: "Lê Văn Cường",
          email: "levancuong@email.com",
          phone: "0369852147",
          address: "789 Đường DEF, Quận 3, TP.HCM",
        },
        products: [
          {
            id: 4,
            name: "Mây Tre Đan",
            quantity: 3,
            price: 320000,
            image: "/images/maytre_bg.jpg",
          },
        ],
        totalAmount: 960000,
        status: "shipped",
        paymentMethod: "bank_transfer",
        paymentStatus: "completed",
        shippingAddress: "789 Đường DEF, Quận 3, TP.HCM",
        notes: "Giao hàng cẩn thận",
        createdAt: "2024-01-18T09:15:00Z",
        updatedAt: "2024-01-20T11:30:00Z",
        estimatedDelivery: "2024-01-23",
        trackingNumber: "VN123456789",
      },
      {
        id: "ORD004",
        customer: {
          name: "Phạm Thị Dung",
          email: "phamthidung@email.com",
          phone: "0741236985",
          address: "321 Đường GHI, Quận 4, TP.HCM",
        },
        products: [
          {
            id: 5,
            name: "Tranh Thêu Con Cò",
            quantity: 1,
            price: 3200000,
            image: "/images/detlua_bg.jpg",
          },
        ],
        totalAmount: 3200000,
        status: "delivered",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        shippingAddress: "321 Đường GHI, Quận 4, TP.HCM",
        notes: "",
        createdAt: "2024-01-15T16:45:00Z",
        updatedAt: "2024-01-18T14:20:00Z",
        deliveredAt: "2024-01-18T14:20:00Z",
      },
      {
        id: "ORD005",
        customer: {
          name: "Hoàng Văn Em",
          email: "hoangvanem@email.com",
          phone: "0852369741",
          address: "654 Đường JKL, Quận 5, TP.HCM",
        },
        products: [
          {
            id: 1,
            name: "Tranh Thêu Tay Hoa Sen",
            quantity: 1,
            price: 2500000,
            image: "/images/detlua_bg.jpg",
          },
        ],
        totalAmount: 2500000,
        status: "cancelled",
        paymentMethod: "bank_transfer",
        paymentStatus: "refunded",
        shippingAddress: "654 Đường JKL, Quận 5, TP.HCM",
        notes: "Khách hàng yêu cầu hủy đơn",
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-17T15:30:00Z",
        cancelledAt: "2024-01-17T15:30:00Z",
      },
    ]);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã giao hàng";
      case "delivered":
        return "Đã nhận hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ thanh toán";
      case "completed":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Đơn Hàng
            </h1>
            <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
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
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã giao hàng</option>
            <option value="delivered">Đã nhận hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-artisan-gold-100 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-artisan-gold-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.id}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {order.paymentMethod === "credit_card"
                            ? "Thẻ tín dụng"
                            : "Chuyển khoản"}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {order.customer.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {order.customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              x{product.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {getStatusText(order.status)}
                      </span>
                    </span>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Mã vận đơn: {order.trackingNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(order.createdAt)}
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
                <span className="font-medium">{indexOfFirstOrder + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, filteredOrders.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredOrders.length}</span> kết
                quả
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
