import { apiClient } from "./client";
import type { ApiResponse, TokenResponse } from "./types";

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<ApiResponse<TokenResponse>>("/api/auth/login", {
    email,
    password,
  });
  return data.data;
}

export async function signup(
  email: string,
  password: string,
  name: string,
  role: "TEACHER" | "STUDENT"
): Promise<void> {
  await apiClient.post("/api/auth/signup", { email, password, name, role });
}

export function saveTokens(tokens: TokenResponse) {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
