import { apiClient } from "./instance"
import type {
  ApiResponse,
  ClassroomResponse,
  ClassroomCreateRequest,
  ClassroomUpdateRequest,
} from "./types"

export async function getClassrooms(): Promise<ApiResponse<ClassroomResponse[]>> {
  const res = await apiClient.get<ApiResponse<ClassroomResponse[]>>("/api/classrooms")
  return res.data
}

export async function getClassroom(classId: number): Promise<ApiResponse<ClassroomResponse>> {
  const res = await apiClient.get<ApiResponse<ClassroomResponse>>(`/api/classrooms/${classId}`)
  return res.data
}

export async function createClassroom(
  data: ClassroomCreateRequest
): Promise<ApiResponse<ClassroomResponse>> {
  const res = await apiClient.post<ApiResponse<ClassroomResponse>>("/api/classrooms", data)
  return res.data
}

export async function updateClassroom(
  classId: number,
  data: ClassroomUpdateRequest
): Promise<ApiResponse<ClassroomResponse>> {
  const res = await apiClient.put<ApiResponse<ClassroomResponse>>(
    `/api/classrooms/${classId}`,
    data
  )
  return res.data
}

export async function deleteClassroom(classId: number): Promise<ApiResponse<void>> {
  const res = await apiClient.delete<ApiResponse<void>>(`/api/classrooms/${classId}`)
  return res.data
}

// 학생 페이지 호환: unwrapped 반환
export async function getMyClassrooms(): Promise<ClassroomResponse[]> {
  const res = await apiClient.get<ApiResponse<ClassroomResponse[]>>("/api/classrooms")
  return res.data.data
}
