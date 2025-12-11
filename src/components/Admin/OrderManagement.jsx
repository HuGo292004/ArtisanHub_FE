import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  X,
  ShoppingCart,
  Calendar,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  User,
  CreditCard,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchOrders = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API /api/Order/all
      const response = await adminService.getAllOrders({ page, size });

      if (response && response.isSuccess && response.data) {
        // Response format: { isSuccess, data: { size, page, total, totalPages, items } }
        const { items, total, totalPages: pages } = response.data;
        setOrders(items || []);
        setTotalOrders(total || 0);
        setTotalPages(pages || 1);
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết đơn hàng
  const [, setDetailError] = useState(null);

  const viewOrderDetail = async (orderId) => {
    try {
      setLoadingDetail(true);
      setSelectedOrder(orderId);
      setShowDetailModal(true);
      setOrderDetail(null);
      setDetailError(null);

      console.log("=== Đang tải chi tiết đơn hàng ===");
      console.log("Order ID:", orderId);

      // Gọi API /api/Order/{orderId}/admin-detail
      const response = await adminService.getOrderAdminDetail(orderId);
      console.log("API getOrderAdminDetail Response:", response);

      if (response && response.isSuccess && response.data) {
        console.log("✅ Order Detail Data:", response.data);
        setOrderDetail(response.data);
      } else if (response && response.data) {
        // Trường hợp API trả về data trực tiếp không có isSuccess
        console.log("✅ Order Detail Data (no isSuccess):", response.data);
        setOrderDetail(response.data);
      } else if (response && !response.isSuccess) {
        console.warn("❌ API trả về không thành công:", response.message);
        setDetailError(response.message || "Không thể tải chi tiết đơn hàng");

        // Fallback: thử API khác
        console.log("Thử fallback API...");
        const fallbackResponse = await adminService.getOrderById(orderId);
        console.log("Fallback Response:", fallbackResponse);

        if (
          fallbackResponse &&
          fallbackResponse.isSuccess &&
          fallbackResponse.data
        ) {
          setOrderDetail(fallbackResponse.data);
          setDetailError(null);
        } else if (fallbackResponse && fallbackResponse.data) {
          setOrderDetail(fallbackResponse.data);
          setDetailError(null);
        }
      } else {
        console.warn("❌ Response không hợp lệ:", response);
        setDetailError("Response không hợp lệ từ server");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải chi tiết đơn hàng:", err);
      console.error("Error details:", err.response?.data || err.message);

      setDetailError(
        err.response?.data?.message || err.message || "Lỗi kết nối server"
      );

      // Fallback: thử API khác
      try {
        console.log("Thử fallback API sau lỗi...");
        const fallbackResponse = await adminService.getOrderById(orderId);
        console.log("Fallback Response (catch):", fallbackResponse);

        if (
          fallbackResponse &&
          fallbackResponse.isSuccess &&
          fallbackResponse.data
        ) {
          setOrderDetail(fallbackResponse.data);
          setDetailError(null);
        } else if (fallbackResponse && fallbackResponse.data) {
          setOrderDetail(fallbackResponse.data);
          setDetailError(null);
        }
      } catch (fallbackErr) {
        console.error("❌ Fallback API cũng lỗi:", fallbackErr);
        console.error(
          "Fallback error details:",
          fallbackErr.response?.data || fallbackErr.message
        );
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  useEffect(() => {
    fetchOrders(currentPage, ordersPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const getStatusText = (status) => {
    if (!status) return "N/A";
    const statusLower = status.toLowerCase();
    const texts = {
      "waiting for payment": "Chờ thanh toán",
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
      paid: "Đã thanh toán",
    };
    return texts[statusLower] || status;
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-slate-100 text-slate-600 border border-slate-200";
    const statusLower = status.toLowerCase();
    const colors = {
      "waiting for payment":
        "bg-amber-100 text-amber-700 border border-amber-200",
      pending: "bg-amber-100 text-amber-700 border border-amber-200",
      processing: "bg-blue-100 text-blue-700 border border-blue-200",
      shipped: "bg-violet-100 text-violet-700 border border-violet-200",
      delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
      completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    };
    return (
      colors[statusLower] ||
      "bg-slate-100 text-slate-600 border border-slate-200"
    );
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="w-3.5 h-3.5" />;
    const statusLower = status.toLowerCase();
    const icons = {
      "waiting for payment": Clock,
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
      completed: CheckCircle,
      paid: CheckCircle,
    };
    const Icon = icons[statusLower] || Clock;
    return <Icon className="w-3.5 h-3.5" />;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      payos: "PayOS",
      cod: "COD",
      bank_transfer: "Chuyển khoản",
      credit_card: "Thẻ tín dụng",
    };
    return methods[method?.toLowerCase()] || method || "N/A";
  };

  const getPaymentStatusText = (status) => {
    if (!status) return "N/A";
    const statusLower = status.toLowerCase();
    const texts = {
      pending: "Chờ thanh toán",
      "waiting for payment": "Chờ thanh toán",
      completed: "Đã thanh toán",
      paid: "Đã thanh toán",
      failed: "Thất bại",
      refunded: "Đã hoàn tiền",
    };
    return texts[statusLower] || status;
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return "bg-slate-100 text-slate-600";
    const statusLower = status.toLowerCase();
    const colors = {
      pending: "bg-amber-100 text-amber-700",
      "waiting for payment": "bg-amber-100 text-amber-700",
      completed: "bg-emerald-100 text-emerald-700",
      paid: "bg-emerald-100 text-emerald-700",
      failed: "bg-rose-100 text-rose-700",
      refunded: "bg-slate-100 text-slate-600",
    };
    return colors[statusLower] || "bg-slate-100 text-slate-600";
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filter theo search term và status (local filter cho search, API filter cho pagination)
  const filteredOrders = safeOrders.filter((order) => {
    if (!order) return false;

    const orderId = String(order.orderId || "").toLowerCase();
    const orderCode = String(order.orderCode || "").toLowerCase();
    const username = String(order.accountUsername || "").toLowerCase();
    const address = String(order.shippingAddress || "").toLowerCase();
    const orderStatus = (order.status || "").toLowerCase();

    const matchesSearch =
      orderId.includes(searchTerm.toLowerCase()) ||
      orderCode.includes(searchTerm.toLowerCase()) ||
      username.includes(searchTerm.toLowerCase()) ||
      address.includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      orderStatus.includes(filterStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // Vì API đã phân trang, ta dùng trực tiếp filteredOrders
  const currentOrders = filteredOrders;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

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

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-0" />
          </div>
          <p className="text-slate-600 font-medium">Đang tải đơn hàng...</p>
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
            onClick={() => fetchOrders(currentPage, ordersPerPage)}
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
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Đơn Hàng</h1>
            <p className="text-amber-100 text-lg">
              Tổng cộng {totalOrders || filteredOrders.length} đơn hàng
            </p>
          </div>
          <Button
            onClick={() => fetchOrders(currentPage, ordersPerPage)}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
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
            <option value="waiting">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            #{order.orderId}
                          </p>
                          <p className="text-xs text-slate-400">
                            Code: {order.orderCode}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.totalItems} sản phẩm
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-800 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {order.accountUsername || "N/A"}
                        </p>
                        <p className="text-sm text-slate-500 flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {order.shippingAddress || "N/A"}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Phí ship: {formatCurrency(order.shippingFee)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                        {getPaymentMethodText(order.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(order.orderDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewOrderDetail(order.orderId)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không có đơn hàng nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalOrders > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Trang <span className="font-semibold">{currentPage}</span> /{" "}
                <span className="font-semibold">{totalPages}</span> • Tổng{" "}
                <span className="font-semibold">{totalOrders}</span> đơn hàng
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
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetailModal}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden m-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Chi tiết đơn hàng #{selectedOrder}
                </h2>
                {orderDetail?.orderCode && (
                  <p className="text-amber-100 text-sm">
                    Mã đơn: {orderDetail.orderCode}
                  </p>
                )}
              </div>
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
              {loadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                </div>
              ) : orderDetail ? (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-amber-600" />
                        Thông tin khách hàng
                      </h3>
                      <div className="space-y-3">
                        <p className="text-sm text-slate-700">
                          <span className="text-slate-500">Tên:</span>{" "}
                          <span className="font-medium text-slate-900">
                            {orderDetail.customerName || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-slate-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-900">
                            {orderDetail.customerEmail || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-slate-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-900">
                            {orderDetail.customerPhone || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-slate-700 flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-amber-500 mt-0.5" />
                          <span className="text-slate-900">
                            {orderDetail.shippingAddress || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-amber-600" />
                        Thông tin đơn hàng
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">
                            Trạng thái:
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              orderDetail.status
                            )}`}
                          >
                            {getStatusIcon(orderDetail.status)}
                            {getStatusText(orderDetail.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">
                            Thanh toán:
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(
                              orderDetail.status
                            )}`}
                          >
                            {getPaymentStatusText(orderDetail.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-600">Phương thức:</span>
                          <span className="font-medium text-slate-900">
                            {orderDetail.paymentMethod || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-slate-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-600">Ngày đặt:</span>
                          <span className="font-medium text-slate-900">
                            {formatDate(
                              orderDetail.orderDate || orderDetail.createdAt
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-600" />
                      Sản phẩm (
                      {orderDetail.totalItems ||
                        orderDetail.orderItems?.length ||
                        0}
                      )
                    </h3>
                    <div className="space-y-3">
                      {(orderDetail.orderItems || []).map((item, index) => (
                        <div
                          key={item.orderDetailId || index}
                          className="bg-white p-4 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  item.productImage || "/images/placeholder.jpg"
                                }
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/images/placeholder.jpg";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900">
                                {item.productName}
                              </p>
                              <p className="text-sm text-slate-600">
                                Nghệ nhân:{" "}
                                <span className="text-amber-700 font-semibold">
                                  {item.artistName || "N/A"}
                                </span>
                              </p>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-slate-600">
                                  Số lượng:{" "}
                                  <span className="font-semibold text-slate-900">
                                    {item.quantity}
                                  </span>
                                </p>
                                <p className="text-sm text-slate-600">
                                  Đơn giá:{" "}
                                  <span className="font-semibold text-slate-900">
                                    {formatCurrency(item.unitPrice)}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-amber-700 text-lg">
                                {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* Commission info per item */}
                          {(item.commissionRate > 0 ||
                            item.commissionAmount > 0) && (
                            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-slate-50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
                              <div>
                                <span className="text-slate-600">
                                  Tỷ lệ HH:
                                </span>
                                <span className="ml-1 font-bold text-slate-800">
                                  {item.commissionRate}%
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600">
                                  Hoa hồng:
                                </span>
                                <span className="ml-1 font-bold text-amber-700">
                                  {formatCurrency(item.platformCommission)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600">
                                  Nghệ nhân nhận:
                                </span>
                                <span className="ml-1 font-bold text-emerald-700">
                                  {formatCurrency(item.artistEarning)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600">
                                  Đã thanh toán:
                                </span>
                                <span
                                  className={`ml-1 font-bold ${
                                    item.isPaid
                                      ? "text-emerald-700"
                                      : "text-orange-600"
                                  }`}
                                >
                                  {item.isPaid ? "Có" : "Chưa"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Commission Summary */}
                  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                    <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-amber-600" />
                      Tổng kết hoa hồng
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-slate-500">Tạm tính</p>
                        <p className="font-bold text-slate-800 text-lg">
                          {formatCurrency(orderDetail.subTotal)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-slate-500">Phí vận chuyển</p>
                        <p className="font-bold text-slate-800 text-lg">
                          {formatCurrency(orderDetail.shippingFee)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-amber-600">
                          Hoa hồng nền tảng
                        </p>
                        <p className="font-bold text-amber-700 text-lg">
                          {formatCurrency(orderDetail.totalPlatformCommission)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 md:col-span-2">
                        <p className="text-sm text-emerald-600">
                          Tổng nghệ nhân nhận
                        </p>
                        <p className="font-bold text-emerald-700 text-lg">
                          {formatCurrency(orderDetail.totalArtistEarnings)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-slate-800 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">Tổng cộng:</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(
                          orderDetail.totalAmount || orderDetail.total
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">
                    Không thể tải thông tin đơn hàng
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
