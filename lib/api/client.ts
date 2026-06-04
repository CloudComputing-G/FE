import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://checkmate-g.store";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient.request(error.config);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    }
    return Promise.reject(error);
  },
);
