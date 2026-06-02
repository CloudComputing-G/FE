import { apiClient } from "./client";
import type { ApiResponse, ClassroomResponse } from "./types";

export async function getMyClassrooms(): Promise<ClassroomResponse[]> {
  const { data } = await apiClient.get<ApiResponse<ClassroomResponse[]>>("/api/classrooms");
  return data.data;
}
