import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  X,
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
  CreditCard,
  Percent,
  Filter,
  Download,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";

// Transaction type mappings
const TRANSACTION_TYPES = {
  commission_pending: {
    label: "Hoa hồng chờ xử lý",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  commission_released: {
    label: "Hoa hồng đã chuyển",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  withdraw_pending: {
    label: "Rút tiền chờ duyệt",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Clock,
  },
  withdraw_completed: {
    label: "Rút tiền hoàn tất",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: ArrowUpRight,
  },
  withdraw_rejected: {
    label: "Rút tiền bị từ chối",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  payment_received: {
    label: "Nhận thanh toán",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: ArrowDownLeft,
  },
  refund: {
    label: "Hoàn tiền",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: ArrowUpRight,
  },
};

// Status mappings
const STATUS_CONFIG = {
  Completed: {
    label: "Hoàn thành",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  Pending: {
    label: "Đang xử lý",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  Failed: {
    label: "Thất bại",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  Cancelled: {
    label: "Đã hủy",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: XCircle,
  },
};

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    totalCommission: 0,
  });

  const fetchTransactions = useCallback(async (page = 1, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getAllTransactions({ page, size });

      if (response && response.isSuccess && response.data) {
        const { items, total, totalPages: pages } = response.data;
        setTransactions(items || []);
        setTotalTransactions(total || 0);
        setTotalPages(pages || 1);

        // Calculate stats
        const transactionItems = items || [];
        const completedTrans = transactionItems.filter(
          (t) => t.status === "Completed"
        );
        const pendingTrans = transactionItems.filter(
          (t) => t.status === "Pending"
        );
        const totalAmt = completedTrans.reduce(
          (sum, t) => sum + (t.amount || 0),
          0
        );
        const totalComm = completedTrans.reduce(
          (sum, t) => sum + (t.platformCommission || 0),
          0
        );

        setStats({
          totalAmount: totalAmt,
          completedCount: completedTrans.length,
          pendingCount: pendingTrans.length,
          totalCommission: totalComm,
        });
      } else {
        setTransactions([]);
        setTotalTransactions(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(currentPage, transactionsPerPage);
  }, [currentPage, transactionsPerPage, fetchTransactions]);

  const viewTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTransaction(null);
  };

  const getTransactionTypeInfo = (type) => {
    return (
      TRANSACTION_TYPES[type] || {
        label: type || "N/A",
        color: "bg-slate-100 text-slate-700 border-slate-200",
        icon: CreditCard,
      }
    );
  };

  const getStatusInfo = (status) => {
    return (
      STATUS_CONFIG[status] || {
        label: status || "N/A",
        color: "bg-slate-100 text-slate-700 border-slate-200",
        icon: Clock,
      }
    );
  };

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

  // Filter transactions
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filteredTransactions = safeTransactions.filter((transaction) => {
    if (!transaction) return false;

    const transactionId = String(transaction.transactionId || "").toLowerCase();
    const artistName = String(transaction.artistName || "").toLowerCase();
    const orderCode = String(transaction.orderCode || "").toLowerCase();
    const productName = String(transaction.productName || "").toLowerCase();
    const transactionStatus = (transaction.status || "").toLowerCase();
    const transactionType = (transaction.transactionType || "").toLowerCase();

    const matchesSearch =
      transactionId.includes(searchTerm.toLowerCase()) ||
      artistName.includes(searchTerm.toLowerCase()) ||
      orderCode.includes(searchTerm.toLowerCase()) ||
      productName.includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      transactionStatus === filterStatus.toLowerCase();

    const matchesType =
      filterType === "all" || transactionType === filterType.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Loading state
  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-0" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">Đang tải giao dịch...</p>
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
            onClick={() => fetchTransactions(currentPage, transactionsPerPage)}
            className="bg-violet-600 hover:bg-violet-700 text-white"
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
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Giao Dịch</h1>
            <p className="text-violet-100 text-lg">
              Tổng cộng {totalTransactions || filteredTransactions.length} giao
              dịch
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                fetchTransactions(currentPage, transactionsPerPage)
              }
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng giao dịch</p>
              <p className="text-2xl font-bold text-slate-800">
                {totalTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-xl">
              <Banknote className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng số tiền</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Đang xử lý</p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-xl">
              <Percent className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tổng hoa hồng</p>
              <p className="text-2xl font-bold text-rose-600">
                {formatCurrency(stats.totalCommission)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-slate-700">Bộ lọc</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo mã GD, nghệ nhân, mã đơn, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Pending">Đang xử lý</option>
            <option value="Failed">Thất bại</option>
            <option value="Cancelled">Đã hủy</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all cursor-pointer"
          >
            <option value="all">Tất cả loại GD</option>
            <option value="commission_pending">Hoa hồng chờ xử lý</option>
            <option value="commission_released">Hoa hồng đã chuyển</option>
            <option value="withdraw_pending">Rút tiền chờ duyệt</option>
            <option value="withdraw_completed">Rút tiền hoàn tất</option>
            <option value="payment_received">Nhận thanh toán</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mã GD
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Nghệ nhân
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Loại giao dịch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Số tiền
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => {
                  const typeInfo = getTransactionTypeInfo(
                    transaction.transactionType
                  );
                  const statusInfo = getStatusInfo(transaction.status);
                  const TypeIcon = typeInfo.icon;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={transaction.transactionId}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-violet-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              #{transaction.transactionId}
                            </p>
                            {transaction.orderCode && (
                              <p className="text-xs text-slate-400">
                                Đơn: {transaction.orderCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-800 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {transaction.artistName || "N/A"}
                          </p>
                          {transaction.productName && (
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">
                                {transaction.productName}
                              </span>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${typeInfo.color}`}
                        >
                          <TypeIcon className="w-3.5 h-3.5" />
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {formatCurrency(transaction.amount)}
                          </p>
                          {transaction.platformCommission > 0 && (
                            <p className="text-xs text-amber-600">
                              HH:{" "}
                              {formatCurrency(transaction.platformCommission)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewTransactionDetail(transaction)}
                          className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không có giao dịch nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalTransactions > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Trang <span className="font-semibold">{currentPage}</span> /{" "}
                <span className="font-semibold">{totalPages}</span> • Tổng{" "}
                <span className="font-semibold">{totalTransactions}</span> giao
                dịch
                {loading && (
                  <Loader2 className="inline-block w-4 h-4 ml-2 animate-spin text-violet-600" />
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
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
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

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetailModal}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-500 to-purple-500">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Chi tiết giao dịch #{selectedTransaction.transactionId}
                </h2>
                {selectedTransaction.orderCode && (
                  <p className="text-violet-100 text-sm">
                    Mã đơn: {selectedTransaction.orderCode}
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
              <div className="space-y-6">
                {/* Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-violet-600" />
                      Thông tin giao dịch
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Mã GD:</span>
                        <span className="font-semibold text-slate-800">
                          #{selectedTransaction.transactionId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Loại:</span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                            getTransactionTypeInfo(
                              selectedTransaction.transactionType
                            ).color
                          }`}
                        >
                          {
                            getTransactionTypeInfo(
                              selectedTransaction.transactionType
                            ).label
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Trạng thái:</span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            getStatusInfo(selectedTransaction.status).color
                          }`}
                        >
                          {getStatusInfo(selectedTransaction.status).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Ngày tạo:</span>
                        <span className="font-medium text-slate-800">
                          {formatDate(selectedTransaction.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-violet-600" />
                      Thông tin nghệ nhân
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Tên:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedTransaction.artistName || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">ID:</span>
                        <span className="font-medium text-slate-800">
                          #{selectedTransaction.artistId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Wallet ID:</span>
                        <span className="font-medium text-slate-800">
                          #{selectedTransaction.walletId}
                        </span>
                      </div>
                      {selectedTransaction.bankName && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Ngân hàng:</span>
                          <span className="font-medium text-slate-800">
                            {selectedTransaction.bankName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product & Order Info */}
                {(selectedTransaction.productName ||
                  selectedTransaction.orderId) && (
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-violet-600" />
                      Thông tin sản phẩm & đơn hàng
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTransaction.productName && (
                        <div>
                          <p className="text-sm text-slate-500">Sản phẩm</p>
                          <p className="font-semibold text-slate-800">
                            {selectedTransaction.productName}
                          </p>
                        </div>
                      )}
                      {selectedTransaction.productId && (
                        <div>
                          <p className="text-sm text-slate-500">Product ID</p>
                          <p className="font-medium text-slate-800">
                            #{selectedTransaction.productId}
                          </p>
                        </div>
                      )}
                      {selectedTransaction.orderId && (
                        <div>
                          <p className="text-sm text-slate-500">Order ID</p>
                          <p className="font-medium text-slate-800">
                            #{selectedTransaction.orderId}
                          </p>
                        </div>
                      )}
                      {selectedTransaction.orderCode && (
                        <div>
                          <p className="text-sm text-slate-500">Mã đơn hàng</p>
                          <p className="font-medium text-slate-800">
                            {selectedTransaction.orderCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Financial Info */}
                <div className="bg-violet-50 rounded-xl p-5 border border-violet-200">
                  <h3 className="font-semibold text-violet-800 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-violet-600" />
                    Thông tin tài chính
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-slate-500">Số tiền GD</p>
                      <p className="font-bold text-violet-700 text-xl">
                        {formatCurrency(selectedTransaction.amount)}
                      </p>
                    </div>
                    {selectedTransaction.commissionAmount > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-slate-500">Tổng hoa hồng</p>
                        <p className="font-bold text-slate-800 text-lg">
                          {formatCurrency(selectedTransaction.commissionAmount)}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.platformCommission > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-amber-600">
                          Hoa hồng nền tảng
                        </p>
                        <p className="font-bold text-amber-700 text-lg">
                          {formatCurrency(
                            selectedTransaction.platformCommission
                          )}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.artistEarning > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-emerald-600">
                          Nghệ nhân nhận
                        </p>
                        <p className="font-bold text-emerald-700 text-lg">
                          {formatCurrency(selectedTransaction.artistEarning)}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.commissionRate > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-slate-500">Tỷ lệ HH</p>
                        <p className="font-bold text-slate-800 text-lg">
                          {(selectedTransaction.commissionRate * 100).toFixed(
                            0
                          )}
                          %
                        </p>
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-slate-500">Đã thanh toán</p>
                      <p
                        className={`font-bold text-lg ${
                          selectedTransaction.isPaid
                            ? "text-emerald-700"
                            : "text-orange-600"
                        }`}
                      >
                        {selectedTransaction.isPaid ? "Có ✓" : "Chưa"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* IDs Info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2 font-medium">
                    Thông tin tham chiếu:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {selectedTransaction.commissionId && (
                      <div>
                        <span className="text-slate-500">Commission ID:</span>
                        <span className="ml-1 font-medium text-slate-800">
                          #{selectedTransaction.commissionId}
                        </span>
                      </div>
                    )}
                    {selectedTransaction.withdrawId && (
                      <div>
                        <span className="text-slate-500">Withdraw ID:</span>
                        <span className="ml-1 font-medium text-slate-800">
                          #{selectedTransaction.withdrawId}
                        </span>
                      </div>
                    )}
                    {selectedTransaction.paymentId && (
                      <div>
                        <span className="text-slate-500">Payment ID:</span>
                        <span className="ml-1 font-medium text-slate-800">
                          #{selectedTransaction.paymentId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
