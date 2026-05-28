import apiClient from "./axios";

export interface AuthResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  fieldErrors: {
    field: string;
    rejectedValue: string;
    reason: string;
  }[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", body);
  return data;
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/refresh", {
    refreshToken: token,
  });
  return data;
}
