import { apiClient } from "./instance"
import type {
  ApiResponse,
  AssignmentResponse,
  AssignmentCreateRequest,
  AssignmentUpdateRequest,
  QuestionUpdateRequest,
  UploadUrlResponse,
  PresignedUrlResponse,
  SubmissionResponse,
  LeaderboardResponse,
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

// 교사: 문제지/답지 presigned URL
export async function getProblemUploadUrl(
  type: "problem" | "answer",
  ext: string
): Promise<ApiResponse<UploadUrlResponse>> {
  const res = await apiClient.get<ApiResponse<UploadUrlResponse>>(
    "/api/assignments/upload-url",
    { params: { type, ext } }
  )
  return res.data
}

// 학생: 풀이 사진 제출 presigned URL
export async function getUploadUrl(
  assignmentId: number,
  ext: string
): Promise<PresignedUrlResponse> {
  const { data } = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
    `/api/assignments/${assignmentId}/submissions/upload-url`,
    null,
    { params: { ext } }
  )
  return data.data
}

// 학생: S3 직접 업로드
export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  })
}

// 학생: 제출 확인 → AI 채점 시작
export async function confirmUpload(
  assignmentId: number,
  submissionId: number
): Promise<SubmissionResponse> {
  const { data } = await apiClient.post<ApiResponse<SubmissionResponse>>(
    `/api/assignments/${assignmentId}/submissions/${submissionId}/confirm`
  )
  return data.data
}

export async function getLeaderboard(
  assignmentId: number
): Promise<ApiResponse<LeaderboardResponse>> {
  const res = await apiClient.get<ApiResponse<LeaderboardResponse>>(
    `/api/assignments/${assignmentId}/leaderboard`
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
