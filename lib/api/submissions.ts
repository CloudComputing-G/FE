import { apiClient } from "./client";
import type {
  ApiResponse,
  GradingStatusResponse,
  SubmissionResultResponse,
  RegradeRequest,
  RegradeConfirmRequest,
  RegradeConfirmResponse,
} from "./types";

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
  questionId: number
): Promise<void> {
  await apiClient.post(
    `/api/submissions/${submissionId}/questions/${questionId}/regrade`
  );
}

// 교사: 과제별 재채점 요청 목록 조회
export async function getRegradeRequests(
  assignmentId: number
): Promise<RegradeRequest[]> {
  const { data } = await apiClient.get<ApiResponse<RegradeRequest[]>>(
    `/api/assignments/${assignmentId}/regrade-requests`
  );
  return data.data;
}

// 교사: 재채점 확인 및 점수 수정
export async function confirmRegrade(
  submissionId: number,
  questionId: number,
  body: RegradeConfirmRequest
): Promise<RegradeConfirmResponse> {
  const { data } = await apiClient.patch<ApiResponse<RegradeConfirmResponse>>(
    `/api/submissions/${submissionId}/questions/${questionId}/regrade/confirm`,
    body
  );
  return data.data;
}
