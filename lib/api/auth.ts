import { apiClient } from "./instance"
import type {
  ApiResponse,
  LoginRequest,
  SignupRequest,
  TokenResponse,
  RefreshRequest,
} from "./types"

export async function login(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
  const res = await apiClient.post<ApiResponse<TokenResponse>>("/api/auth/login", data)
  return res.data
}

export async function signup(data: SignupRequest): Promise<ApiResponse<void>> {
  const res = await apiClient.post<ApiResponse<void>>("/api/auth/signup", data)
  return res.data
}

export async function refreshToken(data: RefreshRequest): Promise<ApiResponse<TokenResponse>> {
  const res = await apiClient.post<ApiResponse<TokenResponse>>("/api/auth/refresh", data)
  return res.data
}
