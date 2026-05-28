"use client"

import Link from "next/link"
import { ChevronRight, Loader2, TrendingUp } from "lucide-react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { getAssignment } from "@/lib/api/assignments"
import { getAssignmentAnalytics } from "@/lib/api/analytics"
import { cn } from "@/lib/utils"
import type { AssignmentAnalyticsResponse } from "@/lib/api/types"

function ErrorRateBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "h-full rounded-full",
            pct >= 70 ? "bg-red-500" : pct >= 40 ? "bg-orange-400" : "bg-green-400"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "w-10 text-right text-sm font-semibold",
          pct >= 70 ? "text-red-500" : pct >= 40 ? "text-orange-500" : "text-green-600"
        )}
      >
        {pct}%
      </span>
    </div>
  )
}

export default function StudentResultPage() {
  const params = useParams()
  const classId = params.classId as string
  const assignmentId = Number(params.assignmentId)
  const studentId = Number(params.studentId)

  const { data: assignmentData } = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignment(assignmentId),
    enabled: !!assignmentId,
  })

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", assignmentId],
    queryFn: () => getAssignmentAnalytics(assignmentId),
    enabled: !!assignmentId,
  })

  const assignment = assignmentData?.data
  const allAnalytics: AssignmentAnalyticsResponse[] = analyticsData?.data ?? []

  const studentAnalytics = allAnalytics.filter((a) => a.studentId === studentId)
  const studentName = studentAnalytics[0]?.studentName ?? `학생 ${studentId}`

  // 취약 유형 (예측 오류율 높은 순)
  const weakTypes = [...studentAnalytics].sort(
    (a, b) => b.predictedErrorRate - a.predictedErrorRate
  )

  // 전체 오류율 평균으로 "총점" 근사
  const avgErrorRate =
    studentAnalytics.length > 0
      ? studentAnalytics.reduce((sum, a) => sum + a.predictedErrorRate, 0) /
        studentAnalytics.length
      : 0
  const correctRate = Math.round((1 - avgErrorRate) * 100)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/teacher" className="text-gray-500 hover:text-gray-700">
              반 관리
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href={`/teacher/classes/${classId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              반 {classId}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href={`/teacher/classes/${classId}/assignments/${assignmentId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {assignment?.title ?? "과제"}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{studentName}</span>
          </nav>
        </header>

        <main className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : studentAnalytics.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <TrendingUp className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">이 학생의 분석 데이터가 아직 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {/* 왼쪽: 정답률 + 취약 개념 */}
              <div className="flex flex-col gap-6">
                {/* 정답률 카드 */}
                <div className="flex flex-col items-center rounded-xl bg-green-500 py-10 text-white shadow-sm">
                  <p className="text-sm opacity-80">예측 정답률</p>
                  <p className="mt-2 text-5xl font-bold">{correctRate}</p>
                  <p className="mt-1 text-lg opacity-80">%</p>
                  <div className="mt-4 rounded-full bg-white/20 px-4 py-1.5 text-sm">
                    분석 항목 {studentAnalytics.length}개
                  </div>
                </div>

                {/* 취약 개념 요약 */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-gray-900">취약 개념 분석</h2>
                  {weakTypes.length === 0 ? (
                    <p className="text-sm text-gray-400">데이터 없음</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {weakTypes
                        .filter((t) => t.predictedErrorRate >= 0.4)
                        .slice(0, 4)
                        .map((t) => (
                          <span
                            key={t.analyticsId}
                            className="rounded-lg bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700"
                          >
                            {t.questionType}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 오른쪽: 문제 유형별 결과 */}
              <div className="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-base font-semibold text-gray-900">문제 유형별 분석</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-3 text-left font-medium text-gray-500">문제 유형</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">오답 / 전체</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 w-48">예측 오류율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {weakTypes.map((a) => (
                      <tr key={a.analyticsId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{a.questionType}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {a.errorCount} / {a.totalCount}
                        </td>
                        <td className="px-6 py-4 w-48">
                          <ErrorRateBar pct={Math.round(a.predictedErrorRate * 100)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
