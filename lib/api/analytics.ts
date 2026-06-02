import { apiClient } from "./instance"
import type { ApiResponse, AssignmentAnalyticsResponse } from "./types"

export async function getAssignmentAnalytics(
  assignmentId: number
): Promise<ApiResponse<AssignmentAnalyticsResponse[]>> {
  const res = await apiClient.get<ApiResponse<AssignmentAnalyticsResponse[]>>(
    `/api/assignments/${assignmentId}/analytics`
  )
  return res.data
}
