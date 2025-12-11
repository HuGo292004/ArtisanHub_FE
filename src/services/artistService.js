import axiosClient from "./axiosClient";

// Đăng ký làm Artist (POST /api/artist-profiles)
export function createArtistProfile(formData) {
  return axiosClient.post("/api/artist-profiles", formData);
}

// Lấy thông tin artist profile của user hiện tại (GET /api/artist-profiles/me)
export function getArtistProfile() {
  return axiosClient.get("/api/artist-profiles/me");
}

// Cập nhật artist profile (PUT /api/artist-profiles/me)
export function updateArtistProfile(formData) {
  return axiosClient.put("/api/artist-profiles/me", formData);
}

// Lấy danh sách tất cả nghệ nhân
export function getAllArtists(params = {}) {
  return axiosClient.get("/api/artist-profiles", { params });
}

// Lấy thông tin chi tiết một nghệ nhân và sản phẩm của họ
export function getArtistDetail(artistId) {
  return axiosClient.get(`/api/my-products/artist/${artistId}/products`);
}

// Lấy thông tin chi tiết một nghệ nhân
export function getArtistById(artistId) {
  return axiosClient.get(`/api/artist-profiles/${artistId}`);
}

// Tìm kiếm nghệ nhân theo tên hoặc chuyên môn
export function searchArtists(query) {
  return axiosClient.get(`/artists/search?q=${encodeURIComponent(query)}`);
}

// Lấy danh sách đơn hàng của artist (GET /api/artist-profiles/my-orders)
export function getArtistOrders(params = {}) {
  const { page = 1, size = 10, searchTerm = "", status = "" } = params;
  return axiosClient.get("/api/artist-profiles/my-orders", {
    params: { page, size, searchTerm, status },
  });
}

// Lấy chi tiết đơn hàng của artist (GET /api/artist-profiles/orders/{orderId})
export function getArtistOrderDetail(orderId) {
  return axiosClient.get(`/api/artist-profiles/orders/${orderId}`);
}

// Cập nhật trạng thái đơn hàng của artist (PUT /api/artist-profiles/orders/{orderId}/status)
// Body: { newStatus: "Processing" | "Shipped" | "Delivered" }
export function updateArtistOrderStatus(orderId, newStatus) {
  return axiosClient.put(`/api/artist-profiles/orders/${orderId}/status`, {
    newStatus: newStatus,
  });
}
