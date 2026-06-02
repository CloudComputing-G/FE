import { apiClient } from "./client";
import type { ApiResponse } from "./types";

interface SimilarProblemResponse {
  similarProblem: string;
}

export interface ChatMessageResponse {
  chatId: number;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
}

export async function getSimilarProblem(questionId: number): Promise<string> {
  const { data } = await apiClient.get<ApiResponse<SimilarProblemResponse>>(
    `/api/questions/${questionId}/chat/similar-problem`
  );
  return data.data.similarProblem;
}

export async function getChatHistory(questionId: number): Promise<ChatMessageResponse[]> {
  const { data } = await apiClient.get<ApiResponse<ChatMessageResponse[]>>(
    `/api/questions/${questionId}/chat/history`
  );
  return data.data;
}

export async function sendChatMessage(questionId: number, message: string): Promise<ChatMessageResponse> {
  const { data } = await apiClient.post<ApiResponse<ChatMessageResponse>>(
    `/api/questions/${questionId}/chat`,
    { message }
  );
  return data.data;
}
