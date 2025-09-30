import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
export function clearAuthTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
function setAccessToken(token) {
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

let isRefreshing = false;
let pendingQueue = [];
function onRefreshed(newToken) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => (response?.data !== undefined ? response.data : response),
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    if (status === 401 && original && !original._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            if (!newToken) return reject(error);
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
            original._retry = true;
            resolve(axiosClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );
        const newToken =
          refreshRes?.data?.accessToken || refreshRes?.accessToken;
        if (newToken) setAccessToken(newToken);
        onRefreshed(newToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(original);
      } catch (e) {
        onRefreshed(null);
        clearAuthTokens();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      status: status || 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.",
      data: error?.response?.data,
    });
  }
);

export default axiosClient;
