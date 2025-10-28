import axiosClient from "@/services/axiosClient";

// Lấy danh sách tất cả tài khoản
export function getAccounts(params = {}) {
  return axiosClient.get("/api/v1/Account", { params });
}

// Lấy tất cả tài khoản (không phân trang)
export function getAllAccounts() {
  return axiosClient.get("/api/v1/Account", {
    params: {
      size: 1000, // Số lượng lớn để lấy tất cả
      page: 1,
    },
  });
}

// Lấy thông tin tài khoản theo ID
export function getAccountById(id) {
  return axiosClient.get(`/api/v1/Account/${id}`);
}

// Tạo tài khoản mới
export function createAccount(data) {
  return axiosClient.post("/api/v1/Account", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Cập nhật tài khoản
export function updateAccount(id, data) {
  return axiosClient.put(`/api/v1/Account/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Xóa tài khoản
export function deleteAccount(id) {
  return axiosClient.delete(`/api/v1/Account/${id}`);
}

// Lấy thông tin tài khoản hiện tại
export function getCurrentAccount() {
  return axiosClient.get("/api/v1/Account/me");
}
