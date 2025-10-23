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
  return axiosClient.post("/api/v1/Account", payload);
}

export function getProfile() {
  return axiosClient.get("/api/v1/Account/me");
}
