import { apiClient } from "./client";
import type { ApiResponse, AssignmentResponse, PresignedUrlResponse, SubmissionResponse } from "./types";

export async function getAssignments(classId: number): Promise<AssignmentResponse[]> {
  const { data } = await apiClient.get<ApiResponse<AssignmentResponse[]>>("/api/assignments", {
    params: { classId },
  });
  return data.data;
}

export async function getAssignment(assignmentId: number): Promise<AssignmentResponse> {
  const { data } = await apiClient.get<ApiResponse<AssignmentResponse>>(
    `/api/assignments/${assignmentId}`
  );
  return data.data;
}

export async function getUploadUrl(
  assignmentId: number,
  ext: string
): Promise<PresignedUrlResponse> {
  const { data } = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
    `/api/assignments/${assignmentId}/submissions/upload-url`,
    null,
    { params: { ext } }
  );
  return data.data;
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
}

export async function confirmUpload(
  assignmentId: number,
  submissionId: number
): Promise<SubmissionResponse> {
  const { data } = await apiClient.post<ApiResponse<SubmissionResponse>>(
    `/api/assignments/${assignmentId}/submissions/${submissionId}/confirm`
  );
  return data.data;
}
