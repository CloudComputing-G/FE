import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://100.28.160.69:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      localStorage.removeItem("accessToken");
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post("/api/auth/refresh", {
        refreshToken: storedRefreshToken,
      });

      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      flushQueue(null, accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
