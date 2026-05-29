import { apiClient } from "./client";
import type { ApiResponse, GradingStatusResponse, SubmissionResultResponse } from "./types";

export async function getGradingStatus(submissionId: number): Promise<GradingStatusResponse> {
  const { data } = await apiClient.get<ApiResponse<GradingStatusResponse>>(
    `/api/submissions/${submissionId}/results/status`
  );
  return data.data;
}

export async function getSubmissionResults(
  submissionId: number
): Promise<SubmissionResultResponse> {
  const { data } = await apiClient.get<ApiResponse<SubmissionResultResponse>>(
    `/api/submissions/${submissionId}/results`
  );
  return data.data;
}

export async function requestRegrade(
  submissionId: number,
  questionId: number,
  reason: string
): Promise<void> {
  await apiClient.post(
    `/api/submissions/${submissionId}/questions/${questionId}/regrade`,
    { reason }
  );
}
