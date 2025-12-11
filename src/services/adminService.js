import axiosClient from "./axiosClient";

// ===================== DASHBOARD STATISTICS =====================
// GET /api/admin/dashboard-statistics
export function getDashboardStatistics() {
  return axiosClient.get("/api/admin/dashboard-statistics");
}

// ===================== WITHDRAW REQUESTS =====================
// GET /api/admin/WithdrawRequests/Pending
export function getPendingWithdrawRequests() {
  return axiosClient.get("/api/admin/WithdrawRequests/Pending");
}

// POST /api/admin/WithdrawRequests/Approve/{withdrawRequestId}
export function approveWithdrawRequest(withdrawRequestId) {
  return axiosClient.post(
    `/api/admin/WithdrawRequests/Approve/${withdrawRequestId}`
  );
}

// ===================== COMMISSIONS =====================
// GET /api/admin/Commissions/Unpaid/{artistId}
export function getUnpaidCommissions(artistId) {
  return axiosClient.get(`/api/admin/Commissions/Unpaid/${artistId}`);
}

// ===================== ARTIST WALLET =====================
// GET /api/admin/artist-wallet/{artistId}
export function getArtistWallet(artistId) {
  return axiosClient.get(`/api/admin/artist-wallet/${artistId}`);
}

// ===================== TRANSACTIONS =====================
// GET /api/admin/transactions
export function getAllTransactions(params = {}) {
  return axiosClient.get("/api/admin/transactions", { params });
}

// GET /api/admin/transactions/{transactionId}
export function getTransactionById(transactionId) {
  return axiosClient.get(`/api/admin/transactions/${transactionId}`);
}

// ===================== ORDERS =====================
// GET /api/Order/all - Lấy tất cả đơn hàng (có phân trang)
// Params: { page: number, size: number }
// Response: { isSuccess, data: { size, page, total, totalPages, items: Order[] } }
export function getAllOrders(params = { page: 1, size: 10 }) {
  return axiosClient.get("/api/Order/all", { params });
}

// GET /api/Order/{orderId}/admin-detail - Chi tiết đơn hàng cho admin
export function getOrderAdminDetail(orderId) {
  return axiosClient.get(`/api/Order/${orderId}/admin-detail`);
}

// GET /api/admin/orders/{orderId} - Admin xem chi tiết đơn hàng (có hoa hồng)
export function getOrderById(orderId) {
  return axiosClient.get(`/api/admin/orders/${orderId}`);
}

// GET /api/admin/orders/statistics - Thống kê đơn hàng
export function getOrderStatistics(params = {}) {
  return axiosClient.get("/api/admin/orders/statistics", { params });
}

// ===================== ARTISTS =====================
// GET /api/admin/artists - Lấy danh sách tất cả nghệ nhân
export function getAllArtists(params = {}) {
  return axiosClient.get("/api/admin/artists", { params });
}

// GET /api/admin/artists/{artistId}/products - Lấy sản phẩm của nghệ nhân
export function getArtistProducts(artistId) {
  return axiosClient.get(`/api/admin/artists/${artistId}/products`);
}

// GET /api/artist-profiles/orders/{artistId} - Lấy đơn hàng đã bán của nghệ nhân
export function getArtistOrders(artistId) {
  return axiosClient.get(`/api/artist-profiles/orders/${artistId}`);
}

// ===================== STATISTICS =====================
// GET /api/admin/statistics/revenue
export function getRevenueStatistics(params = {}) {
  return axiosClient.get("/api/admin/statistics/revenue", { params });
}

// GET /api/admin/statistics/order-status
export function getOrderStatusStatistics() {
  return axiosClient.get("/api/admin/statistics/order-status");
}

// ===================== PRODUCTS =====================
// GET /api/my-products/all - Lấy danh sách tất cả sản phẩm (có phân trang)
export function getAllProducts(params = { page: 1, size: 10 }) {
  return axiosClient.get("/api/my-products/all", { params });
}

// ===================== EXPORT ALL =====================
const adminService = {
  // Dashboard
  getDashboardStatistics,

  // Withdraw Requests
  getPendingWithdrawRequests,
  approveWithdrawRequest,

  // Commissions
  getUnpaidCommissions,

  // Artist Wallet
  getArtistWallet,

  // Transactions
  getAllTransactions,
  getTransactionById,

  // Orders
  getAllOrders,
  getOrderAdminDetail,
  getOrderById,
  getOrderStatistics,

  // Artists
  getAllArtists,
  getArtistProducts,
  getArtistOrders,

  // Statistics
  getRevenueStatistics,
  getOrderStatusStatistics,

  // Products
  getAllProducts,
};

export default adminService;
