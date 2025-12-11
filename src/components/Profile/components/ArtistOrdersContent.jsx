import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  MapPin,
  Phone,
  Mail,
  X,
  ShoppingBag,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getArtistOrders,
  getArtistOrderDetail,
  updateArtistOrderStatus,
} from "@/services/artistService";

// Order status flow for display
const ORDER_STATUS_FLOW = [
  { key: "PAID", label: "Đã thanh toán", icon: DollarSign },
  { key: "Processing", label: "Đang xử lý", icon: Clock },
  { key: "Shipping", label: "Đang giao", icon: Truck },
  { key: "Delivered", label: "Đã giao", icon: PackageCheck },
];

// Artist chỉ có thể chuyển sang Processing hoặc Shipping
// (PAID -> Processing -> Shipping, Delivered do Customer xác nhận)

const ArtistOrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const pageSize = 10;

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getArtistOrders({
        page: currentPage,
        size: pageSize,
        searchTerm: searchTerm,
        status: statusFilter,
      });

      if (response?.isSuccess && response?.data) {
        setOrders(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalOrders(response.data.total || 0);
      } else if (Array.isArray(response?.data)) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  // View order detail
  const handleViewDetail = async (order) => {
    setSelectedOrder(order);
    setLoadingDetail(true);
    try {
      const response = await getArtistOrderDetail(order.orderId);
      if (response?.isSuccess && response?.data) {
        setOrderDetail(response.data);
      } else {
        setOrderDetail(order);
      }
    } catch {
      setOrderDetail(order);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  // Get current status index
  const getStatusIndex = (status) => {
    const normalizedStatus = status === "Paid" ? "PAID" : status;
    return ORDER_STATUS_FLOW.findIndex((s) => s.key === normalizedStatus);
  };

  // Get next status (Artist chỉ được chuyển sang Processing hoặc Shipping)
  const getNextStatus = (currentStatus) => {
    const normalizedStatus = currentStatus === "Paid" ? "PAID" : currentStatus;

    // PAID -> Processing
    if (normalizedStatus === "PAID") {
      return { key: "Processing", label: "Đang xử lý", icon: Clock };
    }
    // Processing -> Shipping
    if (normalizedStatus === "Processing") {
      return { key: "Shipping", label: "Đang giao", icon: Truck };
    }
    // Shipping -> Delivered: Chỉ Customer được xác nhận
    return null;
  };

  // Check if can update status (Artist chỉ được cập nhật PAID và Processing)
  const canUpdateStatus = (status) => {
    const normalizedStatus = status === "Paid" ? "PAID" : status;
    // Artist chỉ có thể chuyển: PAID -> Processing, Processing -> Shipping
    // Shipping -> Delivered là do Customer xác nhận nhận hàng
    return ["PAID", "Paid", "Processing"].includes(normalizedStatus);
  };

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await updateArtistOrderStatus(orderId, newStatus);
      if (response?.isSuccess || response) {
        if (orderDetail) {
          setOrderDetail({ ...orderDetail, status: newStatus });
        }
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: newStatus } : o
          )
        );
        fetchOrders();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      "Waiting for payment": {
        label: "Chờ thanh toán",
        class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
      Pending: {
        label: "Chờ xử lý",
        class: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      },
      PENDING: {
        label: "Chờ xử lý",
        class: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      },
      PAID: {
        label: "Đã thanh toán",
        class: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      Paid: {
        label: "Đã thanh toán",
        class: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      CANCELLED: {
        label: "Đã hủy",
        class: "bg-red-500/20 text-red-400 border-red-500/30",
      },
      Cancelled: {
        label: "Đã hủy",
        class: "bg-red-500/20 text-red-400 border-red-500/30",
      },
      Processing: {
        label: "Đang xử lý",
        class: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      PROCESSING: {
        label: "Đang xử lý",
        class: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      Shipping: {
        label: "Đang giao",
        class: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
      SHIPPING: {
        label: "Đang giao",
        class: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
      Delivered: {
        label: "Đã giao",
        class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      },
      DELIVERED: {
        label: "Đã giao",
        class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      },
    };

    const statusInfo = statusMap[status] || {
      label: status || "Không xác định",
      class: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.class}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Đơn hàng của Shop
        </h1>
        <p className="text-artisan-brown-300">
          Quản lý đơn hàng và cập nhật trạng thái giao hàng
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-artisan-brown-800/50 border-artisan-brown-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-artisan-brown-400 text-sm">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-white">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-artisan-brown-800/50 border-artisan-brown-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-artisan-brown-400 text-sm">Chờ xử lý</p>
              <p className="text-2xl font-bold text-white">
                {
                  orders.filter(
                    (o) => o.status === "PAID" || o.status === "Paid"
                  ).length
                }
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-artisan-brown-800/50 border-artisan-brown-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Truck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-artisan-brown-400 text-sm">Đang giao</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter((o) => o.status === "Shipping").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-artisan-brown-800/50 border-artisan-brown-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <PackageCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-artisan-brown-400 text-sm">Đã giao</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter((o) => o.status === "Delivered").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-artisan-brown-800/50 border-artisan-brown-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-artisan-brown-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-artisan-brown-900 border border-artisan-brown-600 rounded-lg text-white placeholder-artisan-brown-400 focus:outline-none focus:border-artisan-gold-500"
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-artisan-brown-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-artisan-brown-900 border border-artisan-brown-600 rounded-lg text-white focus:outline-none focus:border-artisan-gold-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Shipping">Đang giao</option>
                <option value="Delivered">Đã giao</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-artisan-gold-500 border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="bg-artisan-brown-800/50 border-artisan-brown-700">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-artisan-brown-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-artisan-brown-400">
              Đơn hàng của shop sẽ xuất hiện ở đây khi có khách mua hàng
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-artisan-brown-800/50 rounded-lg border border-artisan-brown-700">
          <table className="w-full">
            <thead className="bg-artisan-brown-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-artisan-brown-300 uppercase">
                  Mã đơn
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-artisan-brown-300 uppercase">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-artisan-brown-300 uppercase">
                  Ngày đặt
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-artisan-brown-300 uppercase">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-artisan-brown-300 uppercase">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-artisan-brown-300 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-artisan-brown-700">
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-artisan-brown-800/50"
                >
                  <td className="px-4 py-4">
                    <span className="text-artisan-gold-400 font-mono font-medium">
                      #{order.orderCode || order.orderId}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">
                      {order.customerName || "N/A"}
                    </div>
                    <div className="text-artisan-brown-400 text-sm">
                      {order.customerEmail || ""}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-artisan-brown-300">
                    {formatDate(order.createdAt || order.orderDate)}
                  </td>
                  <td className="px-4 py-4 text-right text-white font-medium">
                    {formatPrice(order.totalAmount)}đ
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetail(order)}
                      className="text-artisan-gold-400 hover:text-artisan-gold-300 hover:bg-artisan-brown-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-artisan-brown-600 text-artisan-brown-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-artisan-brown-300 px-4">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="border-artisan-brown-600 text-artisan-brown-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-artisan-brown-900 rounded-xl border border-artisan-brown-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-artisan-brown-900 border-b border-artisan-brown-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-6 h-6 text-artisan-gold-400" />
                Chi tiết đơn hàng
                <span className="text-artisan-gold-400 font-mono">
                  #{orderDetail?.orderCode || selectedOrder.orderId}
                </span>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="text-artisan-brown-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-artisan-gold-500 border-t-transparent" />
                </div>
              ) : orderDetail ? (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-artisan-brown-800/50 rounded-lg p-4">
                      <h3 className="text-artisan-gold-400 font-semibold mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Thông tin đơn hàng
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-artisan-brown-400">
                            Mã đơn:
                          </span>
                          <span className="text-white font-mono">
                            #{orderDetail.orderCode || orderDetail.orderId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-artisan-brown-400">
                            Ngày đặt:
                          </span>
                          <span className="text-white">
                            {formatDate(
                              orderDetail.createdAt || orderDetail.orderDate
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-artisan-brown-400">
                            Trạng thái:
                          </span>
                          {getStatusBadge(orderDetail.status)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-artisan-brown-800/50 rounded-lg p-4">
                      <h3 className="text-artisan-gold-400 font-semibold mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Thông tin khách hàng
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-artisan-brown-400" />
                          <span className="text-white">
                            {orderDetail.customerName || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-artisan-brown-400" />
                          <span className="text-white">
                            {orderDetail.customerPhone || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-artisan-brown-400" />
                          <span className="text-white">
                            {orderDetail.customerEmail || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-artisan-brown-400 mt-0.5" />
                          <span className="text-white">
                            {orderDetail.shippingAddress || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-artisan-brown-800/50 rounded-lg p-4">
                    <h3 className="text-artisan-gold-400 font-semibold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Tiến trình đơn hàng
                    </h3>
                    <div className="flex items-center justify-between mb-6">
                      {ORDER_STATUS_FLOW.map((step, index) => {
                        const currentIndex = getStatusIndex(orderDetail.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className="flex items-center flex-1"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : isCurrent
                                    ? "bg-artisan-gold-500 border-artisan-gold-500 text-white animate-pulse"
                                    : "bg-artisan-brown-700 border-artisan-brown-600 text-artisan-brown-400"
                                }`}
                              >
                                {isCompleted && index < currentIndex ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : (
                                  <StepIcon className="w-6 h-6" />
                                )}
                              </div>
                              <span
                                className={`text-xs mt-2 text-center ${
                                  isCompleted
                                    ? "text-green-400 font-medium"
                                    : "text-artisan-brown-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {index < ORDER_STATUS_FLOW.length - 1 && (
                              <div
                                className={`flex-1 h-1 mx-2 rounded ${
                                  index < currentIndex
                                    ? "bg-green-500"
                                    : "bg-artisan-brown-700"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Update Status Button */}
                    {canUpdateStatus(orderDetail.status) && (
                      <div className="flex items-center justify-center gap-4 pt-4 border-t border-artisan-brown-700">
                        {getNextStatus(orderDetail.status) && (
                          <>
                            <span className="text-artisan-brown-300 text-sm">
                              Chuyển sang trạng thái tiếp theo:
                            </span>
                            <Button
                              onClick={() =>
                                handleUpdateStatus(
                                  orderDetail.orderId,
                                  getNextStatus(orderDetail.status).key
                                )
                              }
                              disabled={updatingStatus}
                              className="bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
                            >
                              {updatingStatus ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              ) : (
                                <ArrowRight className="w-4 h-4 mr-2" />
                              )}
                              {getNextStatus(orderDetail.status).label}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="bg-artisan-brown-800/50 rounded-lg p-4">
                    <h3 className="text-artisan-gold-400 font-semibold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Sản phẩm
                    </h3>
                    <div className="space-y-3">
                      {(orderDetail.orderItems || []).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-artisan-brown-900 rounded-lg"
                        >
                          <div className="w-16 h-16 bg-artisan-brown-800 rounded-lg overflow-hidden flex-shrink-0">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-artisan-brown-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">
                              {item.productName}
                            </h4>
                            <p className="text-artisan-brown-400 text-sm">
                              Số lượng: {item.quantity} x{" "}
                              {formatPrice(item.unitPrice)}đ
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-artisan-gold-400 font-semibold">
                              {formatPrice(item.totalPrice)}đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-artisan-brown-800/50 rounded-lg p-4">
                    <h3 className="text-artisan-gold-400 font-semibold mb-3">
                      Tổng kết
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-artisan-brown-400">
                          Tạm tính:
                        </span>
                        <span className="text-white">
                          {formatPrice(orderDetail.subTotal)}đ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-artisan-brown-400">
                          Phí vận chuyển:
                        </span>
                        <span className="text-white">
                          {formatPrice(orderDetail.shippingFee)}đ
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-artisan-brown-700">
                        <span className="text-white font-semibold">
                          Tổng đơn hàng:
                        </span>
                        <span className="text-artisan-gold-400 font-bold text-lg">
                          {formatPrice(orderDetail.totalAmount)}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artist Earnings */}
                  {(orderDetail.artistEarnings > 0 ||
                    orderDetail.totalCommission > 0) && (
                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                      <h3 className="text-green-400 font-semibold mb-3">
                        💰 Thu nhập của bạn
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-artisan-brown-300">
                            Giá trị sản phẩm:
                          </span>
                          <span className="text-white">
                            {formatPrice(
                              orderDetail.totalAmount - orderDetail.shippingFee
                            )}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-artisan-brown-300">
                            Phí nền tảng:
                          </span>
                          <span className="text-red-400">
                            -{formatPrice(orderDetail.platformFee || 0)}đ
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-green-700/30">
                          <span className="text-green-400 font-semibold">
                            Bạn nhận được:
                          </span>
                          <span className="text-green-400 font-bold text-lg">
                            {formatPrice(
                              orderDetail.totalAmount -
                                orderDetail.shippingFee -
                                (orderDetail.platformFee || 0)
                            )}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-artisan-brown-400">
                  Không thể tải chi tiết đơn hàng
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-artisan-brown-900 border-t border-artisan-brown-700 px-6 py-4">
              <Button
                onClick={closeModal}
                className="w-full bg-artisan-gold-500 hover:bg-artisan-gold-600 text-white"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistOrdersContent;
