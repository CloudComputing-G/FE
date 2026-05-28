import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://100.28.160.69:8080"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_name")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
