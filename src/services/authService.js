import axiosClient, { clearAuthTokens } from "@/services/axiosClient";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function logout() {
  clearAuthTokens();
}

export function login(payload) {
  return axiosClient.post("/api/v1/Account/login", payload);
}

export function register(payload) {
  return axiosClient.post("/api/v1/Account", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getProfile() {
  return axiosClient.get("/api/v1/Account/me");
}

export function updateProfile(accountId, formData) {
  return axiosClient.put(`/api/v1/Account/${accountId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getArtistProfile() {
  return axiosClient.get("/api/artist-profiles/me");
}

export function createProduct(formData) {
  return axiosClient.post("/api/my-products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
