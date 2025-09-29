// Axios client with standard interceptors
// - Base URL from Vite env: VITE_API_BASE_URL
// - Attaches Authorization Bearer token from storage
// - Auto-refreshes access token on 401 once, then retries original request
// - Unwraps response.data

import axios from "axios";

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "/api";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAccessToken(token) {
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore storage error
  }
}

export function clearAuthTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // ignore storage error
  }
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Prevent infinite refresh loops
let isRefreshing = false;
let pendingRequestsQueue = [];

function onRefreshed(newToken) {
  pendingRequestsQueue.forEach((cb) => cb(newToken));
  pendingRequestsQueue = [];
}

// Request interceptor: attach Authorization header
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap data and handle 401
axiosClient.interceptors.response.use(
  (response) => {
    // Normalize: always return response.data if present
    return response?.data !== undefined ? response.data : response;
  },
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    // If unauthorized and we have a refresh token, try to refresh once
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequestsQueue.push((newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            originalRequest._retry = true;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );
        const newToken =
          refreshResponse?.data?.accessToken || refreshResponse?.accessToken;
        if (newToken) setAccessToken(newToken);
        onRefreshed(newToken);
        const headers = originalRequest.headers || {};
        headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers = headers;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        onRefreshed(null);
        clearAuthTokens();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Build a normalized error object
    const normalizedError = {
      status: status || 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.",
      data: error?.response?.data,
    };
    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
