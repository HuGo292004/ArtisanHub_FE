import { useState, useEffect } from "react";
import {
  Wallet,
  CheckCircle,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  User,
  Banknote,
  Calendar,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";
import { useToast } from "@/components/ui/Toast";

export default function WithdrawRequestManagement() {
  const toast = useToast();
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState(null);

  // Fetch pending withdraw requests
  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getPendingWithdrawRequests();

      if (response?.isSuccess && response?.data) {
        setWithdrawRequests(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        setWithdrawRequests(response);
      } else {
        setWithdrawRequests([]);
      }
      // Only reset approvingId if the approved request is no longer in the list
      // Don't reset if we're still processing an approval
    } catch (err) {
      console.error("Error fetching withdraw requests:", err);
      setError(err.message || "Không thể tải danh sách yêu cầu rút tiền");
      setWithdrawRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  // Show confirm modal
  const showApproveConfirm = (request) => {
    setRequestToApprove(request);
    setShowConfirmModal(true);
  };

  // Approve withdraw request
  const handleApprove = async () => {
    console.log("Request to approve:", requestToApprove);
    if (!requestToApprove) {
      toast.error("Không tìm thấy thông tin yêu cầu rút tiền");
      return;
    }

    // Try different possible field names
    const withdrawRequestId = requestToApprove.withdrawId;

    if (!withdrawRequestId) {
      toast.error("Không tìm thấy ID yêu cầu rút tiền. Vui lòng thử lại.");
      return;
    }

    // Ensure ID is a number or valid string
    const requestId = Number(withdrawRequestId) || String(withdrawRequestId);

    setShowConfirmModal(false);
    setApprovingId(requestId);
    try {
      const response = await adminService.approveWithdrawRequest(requestId);
      console.log("Response:", response);
      console.log("Response type:", typeof response);

      // Axios might return the data directly if responseType is 'text'
      // Or it might return { data, status, ... } structure
      let responseMessage = "";
      let statusCode = null;

      if (typeof response === "string") {
        // Response is directly the string "Withdrawal request approved."
        responseMessage = response;
        // If we get here without error, it's success (status 200)
        statusCode = 200;
      } else if (response?.data) {
        // Axios response object structure
        statusCode = response?.status || response?.statusCode;
        if (typeof response.data === "string") {
          // Plain text response in data field
          responseMessage = response.data;
        } else if (response.data?.message) {
          // JSON object with message field
          responseMessage = response.data.message;
        } else if (response.data?.data?.message) {
          // Nested message
          responseMessage = response.data.data.message;
        }
      } else if (response?.message) {
        responseMessage = response.message;
        statusCode = response?.status || response?.statusCode || 200;
      }

      // If we get here without error, and have a message, it's success
      // Or if status code is 200-299
      const isSuccess =
        (statusCode >= 200 && statusCode < 300) ||
        (typeof response === "string" &&
          response.toLowerCase().includes("approved")) ||
        (responseMessage && responseMessage.toLowerCase().includes("approved"));

      console.log(
        "Is success:",
        isSuccess,
        "Status code:",
        statusCode,
        "Message:",
        responseMessage
      );

      if (isSuccess) {
        const successMessage =
          responseMessage || "Yêu cầu rút tiền đã được chấp nhận thành công!";
        toast.success(successMessage);
        // Reset approvingId before refresh so buttons are enabled
        setApprovingId(null);
        setRequestToApprove(null);
        // Refresh list
        await fetchWithdrawRequests();
      } else {
        const errorMessage =
          responseMessage ||
          response?.data?.errors?.withdrawRequestId?.[0] ||
          "Không thể chấp nhận yêu cầu rút tiền";
        toast.error(errorMessage);
        setApprovingId(null);
        setRequestToApprove(null);
      }
    } catch (err) {
      console.error("Error approving withdraw request:", err);
      console.error("Error response:", err?.response);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi chấp nhận yêu cầu rút tiền";
      toast.error(errorMessage);
      setApprovingId(null);
      setRequestToApprove(null);
    }
  };

  // View detail
  const viewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedRequest(null);
    setShowDetailModal(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
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

  // Filter requests
  const filteredRequests = withdrawRequests.filter((request) => {
    if (!request) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      String(request.withdrawRequestId || "")
        .toLowerCase()
        .includes(searchLower) ||
      String(request.artistName || "")
        .toLowerCase()
        .includes(searchLower) ||
      String(request.bankName || "")
        .toLowerCase()
        .includes(searchLower) ||
      String(request.accountNumber || "")
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // Loading state
  if (loading && withdrawRequests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-0" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">
            Đang tải yêu cầu rút tiền...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && withdrawRequests.length === 0) {
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
            onClick={fetchWithdrawRequests}
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
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Quản Lý Yêu Cầu Rút Tiền
            </h1>
            <p className="text-amber-100 text-lg">
              Tổng cộng {filteredRequests.length} yêu cầu đang chờ duyệt
            </p>
          </div>
          <Button
            onClick={fetchWithdrawRequests}
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

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo mã yêu cầu, tên nghệ nhân, ngân hàng, số tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Withdraw Requests List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
                  <Loader2 className="w-16 h-16 text-amber-600 animate-spin absolute top-0 left-0" />
                </div>
              </div>
              <p className="text-slate-600 font-medium">
                Đang tải yêu cầu rút tiền...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <div
                key={
                  request.withdrawRequestId ||
                  request.withdrawId ||
                  `withdraw-${index}`
                }
                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-200">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">
                            #{request.withdrawRequestId}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ duyệt
                      </span>
                    </div>

                    {/* Artist Info */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {request.artistName || "N/A"}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: {request.artistId}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg">
                      <p className="text-sm text-amber-100 mb-2">
                        Số tiền yêu cầu rút
                      </p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(request.amount)}
                      </p>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                          <Banknote className="w-4 h-4" />
                          Ngân hàng:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {request.bankName || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Chủ TK:</span>
                        <span className="font-medium text-slate-800">
                          {request.accountHolder || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Số TK:</span>
                        <span className="font-medium text-slate-800 font-mono text-sm">
                          {request.accountNumber || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewDetail(request);
                        }}
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Chi tiết
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          showApproveConfirm(request);
                        }}
                        disabled={
                          approvingId !== null &&
                          String(approvingId) ===
                            String(request.withdrawRequestId)
                        }
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {approvingId !== null &&
                        String(approvingId) ===
                          String(request.withdrawRequestId) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Chấp nhận
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Không có yêu cầu rút tiền nào
                </h3>
                <p className="text-slate-500">
                  {searchTerm
                    ? "Không tìm thấy yêu cầu phù hợp với từ khóa tìm kiếm"
                    : "Hiện tại không có yêu cầu rút tiền nào đang chờ duyệt"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetailModal}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Chi tiết yêu cầu rút tiền
                  </h2>
                  <p className="text-amber-100 text-sm flex items-center gap-2">
                    <span>#{selectedRequest.withdrawRequestId}</span>
                    <span>•</span>
                    <span>{formatDate(selectedRequest.createdAt)}</span>
                  </p>
                </div>
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
                {/* Amount Card */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-100 mb-2">
                        Số tiền yêu cầu rút
                      </p>
                      <p className="text-4xl font-bold">
                        {formatCurrency(selectedRequest.amount)}
                      </p>
                    </div>
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Banknote className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Artist Info */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <User className="w-5 h-5 text-amber-600" />
                    </div>
                    Thông tin nghệ nhân
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Tên nghệ nhân:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedRequest.artistName || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-600">Artist ID:</span>
                      <span className="font-medium text-slate-800">
                        #{selectedRequest.artistId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Wallet className="w-5 h-5 text-amber-600" />
                    </div>
                    Thông tin ngân hàng
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Tên ngân hàng:</span>
                      <span className="font-medium text-slate-800">
                        {selectedRequest.bankName || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Chủ tài khoản:</span>
                      <span className="font-medium text-slate-800">
                        {selectedRequest.accountHolder || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-600">Số tài khoản:</span>
                      <span className="font-medium text-slate-800 font-mono">
                        {selectedRequest.accountNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Request Info */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    Thông tin yêu cầu
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Mã yêu cầu:</span>
                      <span className="font-semibold text-slate-800">
                        #{selectedRequest.withdrawRequestId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Ngày tạo:</span>
                      <span className="font-medium text-slate-800">
                        {formatDate(selectedRequest.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-600">Trạng thái:</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ duyệt
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeDetailModal}
                className="border-slate-300 text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4 mr-2" />
                Đóng
              </Button>
              <Button
                onClick={() => {
                  closeDetailModal();
                  showApproveConfirm(selectedRequest);
                }}
                disabled={
                  approvingId !== null &&
                  String(approvingId) ===
                    String(selectedRequest.withdrawRequestId)
                }
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {approvingId !== null &&
                String(approvingId) ===
                  String(selectedRequest.withdrawRequestId) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Chấp nhận yêu cầu
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve Modal */}
      {showConfirmModal && requestToApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowConfirmModal(false);
              setRequestToApprove(null);
            }}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden m-4">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-amber-500 to-orange-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Xác nhận chấp nhận yêu cầu
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-slate-700 mb-4">
                  Bạn có chắc chắn muốn chấp nhận yêu cầu rút tiền này?
                </p>
              </div>

              {/* Request Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Mã yêu cầu:</span>
                  <span className="font-semibold text-slate-800">
                    #{requestToApprove.withdrawRequestId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Nghệ nhân:</span>
                  <span className="font-medium text-slate-800">
                    {requestToApprove.artistName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Số tiền:</span>
                  <span className="font-bold text-amber-600">
                    {formatCurrency(requestToApprove.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Ngân hàng:</span>
                  <span className="font-medium text-slate-800">
                    {requestToApprove.bankName || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Hành động này không thể hoàn tác. Vui lòng kiểm tra kỹ thông
                  tin trước khi xác nhận.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  setRequestToApprove(null);
                }}
                className="border-slate-300 text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleApprove}
                disabled={
                  approvingId !== null &&
                  String(approvingId) ===
                    String(requestToApprove?.withdrawRequestId)
                }
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {approvingId !== null &&
                String(approvingId) ===
                  String(requestToApprove?.withdrawRequestId) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Xác nhận chấp nhận
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
