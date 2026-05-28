import { apiClient } from "./instance"
import type {
  ApiResponse,
  AssignmentResponse,
  AssignmentCreateRequest,
  AssignmentUpdateRequest,
  QuestionUpdateRequest,
} from "./types"

export async function getAssignments(classId: number): Promise<ApiResponse<AssignmentResponse[]>> {
  const res = await apiClient.get<ApiResponse<AssignmentResponse[]>>("/api/assignments", {
    params: { classId },
  })
  return res.data
}

export async function getAssignment(
  assignmentId: number
): Promise<ApiResponse<AssignmentResponse>> {
  const res = await apiClient.get<ApiResponse<AssignmentResponse>>(
    `/api/assignments/${assignmentId}`
  )
  return res.data
}

export async function createAssignment(
  data: AssignmentCreateRequest
): Promise<ApiResponse<AssignmentResponse>> {
  const res = await apiClient.post<ApiResponse<AssignmentResponse>>("/api/assignments", data)
  return res.data
}

export async function updateAssignment(
  assignmentId: number,
  data: AssignmentUpdateRequest
): Promise<ApiResponse<AssignmentResponse>> {
  const res = await apiClient.put<ApiResponse<AssignmentResponse>>(
    `/api/assignments/${assignmentId}`,
    data
  )
  return res.data
}

export async function deleteAssignment(assignmentId: number): Promise<ApiResponse<void>> {
  const res = await apiClient.delete<ApiResponse<void>>(`/api/assignments/${assignmentId}`)
  return res.data
}

export async function publishAssignment(
  assignmentId: number
): Promise<ApiResponse<AssignmentResponse>> {
  const res = await apiClient.post<ApiResponse<AssignmentResponse>>(
    `/api/assignments/${assignmentId}/publish`
  )
  return res.data
}

export async function updateQuestion(
  assignmentId: number,
  questionId: number,
  data: QuestionUpdateRequest
): Promise<ApiResponse<void>> {
  const res = await apiClient.put<ApiResponse<void>>(
    `/api/assignments/${assignmentId}/questions/${questionId}`,
    data
  )
  return res.data
}
