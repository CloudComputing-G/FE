"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronRight, Cpu, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { getAssignment } from "@/lib/api/assignments"
import { getAssignmentAnalytics } from "@/lib/api/analytics"
import { cn } from "@/lib/utils"
import type { AssignmentAnalyticsResponse } from "@/lib/api/types"

type TabType = "all" | "graded" | "not-submitted"

interface StudentSummary {
  studentId: number
  studentName: string
  topWeakType: string
  predictedErrorRate: number
}

const statusStyles = {
  graded: "bg-green-100 text-green-700",
  "not-submitted": "bg-gray-100 text-gray-500",
} as const

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

export default function AssignmentPage() {
  const params = useParams()
  const classId = params.classId as string
  const assignmentId = Number(params.assignmentId)
  const [activeTab, setActiveTab] = useState<TabType>("all")

  const { data: assignmentData, isLoading: assignmentLoading } = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignment(assignmentId),
    enabled: !!assignmentId,
  })

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", assignmentId],
    queryFn: () => getAssignmentAnalytics(assignmentId),
    enabled: !!assignmentId,
  })

  const assignment = assignmentData?.data
  const analytics: AssignmentAnalyticsResponse[] = analyticsData?.data ?? []

  // 학생별로 analytics 집계 (취약 문제 유형 추출)
  const studentSummaries = useMemo<StudentSummary[]>(() => {
    const map = new Map<number, { name: string; entries: AssignmentAnalyticsResponse[] }>()
    analytics.forEach((a) => {
      if (!map.has(a.studentId)) map.set(a.studentId, { name: a.studentName, entries: [] })
      map.get(a.studentId)!.entries.push(a)
    })
    return Array.from(map.entries()).map(([studentId, { name, entries }]) => {
      const worst = entries.reduce((prev, cur) =>
        cur.predictedErrorRate > prev.predictedErrorRate ? cur : prev
      )
      return {
        studentId,
        studentName: name,
        topWeakType: worst.questionType,
        predictedErrorRate: worst.predictedErrorRate,
      }
    })
  }, [analytics])

  // 취약 문제 유형 집계 (questionType별 평균 오류율)
  const weakTopics = useMemo(() => {
    const typeMap = new Map<string, { totalRate: number; count: number }>()
    analytics.forEach((a) => {
      const existing = typeMap.get(a.questionType) ?? { totalRate: 0, count: 0 }
      typeMap.set(a.questionType, {
        totalRate: existing.totalRate + a.predictedErrorRate,
        count: existing.count + 1,
      })
    })
    return Array.from(typeMap.entries())
      .map(([name, { totalRate, count }]) => ({
        name,
        pct: Math.round((totalRate / count) * 100),
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5)
  }, [analytics])

  const totalCount = assignment?.totalCount ?? 0
  const submittedCount = assignment?.submittedCount ?? 0
  const gradedCount = assignment?.gradedCount ?? 0
  const notSubmittedCount = assignment?.notSubmittedCount ?? 0

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "all", label: "전체", count: studentSummaries.length },
    { id: "graded", label: "채점완료", count: gradedCount },
    { id: "not-submitted", label: "미제출", count: notSubmittedCount },
  ]

  const stats = [
    { value: totalCount, label: "전체", color: "text-gray-900" },
    { value: submittedCount, label: "제출", color: "text-blue-600" },
    { value: gradedCount, label: "채점완료", color: "text-green-600" },
    { value: notSubmittedCount, label: "미제출", color: "text-orange-500" },
  ]

  const isLoading = assignmentLoading || analyticsLoading

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
            <Link href={`/teacher/classes/${classId}`} className="text-gray-500 hover:text-gray-700">
              반 {classId}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {assignment?.title ?? "과제"}
            </span>
          </nav>
        </header>

        <main className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : (
            <>
              {/* 통계 카드 */}
              <div className="mb-8 grid grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className={cn("mt-1 text-3xl font-bold", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* 취약 문제 예측 */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">취약 문제 예측</h2>
                    <span className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
                      <Cpu className="h-3 w-3" />
                      AI 분석
                    </span>
                  </div>
                  {weakTopics.length === 0 ? (
                    <p className="text-sm text-gray-400">채점 완료 후 분석 결과가 표시됩니다.</p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {weakTopics.map((topic) => (
                        <div key={topic.name}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                            <span className="text-sm font-semibold text-red-500">{topic.pct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-red-400"
                              style={{ width: `${topic.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 학생 목록 */}
                <div className="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
                  {/* 탭 */}
                  <div className="flex items-center gap-1 border-b border-gray-100 px-4 pt-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                          activeTab === tab.id
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {tab.label}
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-xs",
                            activeTab === tab.id
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {studentSummaries.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                      아직 채점된 학생이 없습니다.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="px-6 py-3 text-left font-medium text-gray-500">학생</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">주요 취약 유형</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">예측 오류율</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {studentSummaries.map((student) => (
                          <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <Link
                                href={`/teacher/classes/${classId}/assignments/${assignmentId}/students/${student.studentId}`}
                                className="flex items-center gap-3 group"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                                  {getInitials(student.studentName)}
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-green-600">
                                  {student.studentName}
                                </span>
                              </Link>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{student.topWeakType}</td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-red-500">
                                {Math.round(student.predictedErrorRate * 100)}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  "rounded-full px-3 py-1 text-xs font-medium",
                                  statusStyles["graded"]
                                )}
                              >
                                채점완료
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
