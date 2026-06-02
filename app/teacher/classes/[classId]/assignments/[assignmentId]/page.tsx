"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ChevronRight, Cpu, Loader2, Save, CheckCircle2,
  ClipboardList, LayoutDashboard, ExternalLink,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { getAssignment, updateQuestion } from "@/lib/api/assignments"
import { getAssignmentAnalytics } from "@/lib/api/analytics"
import { getClassroom } from "@/lib/api/classrooms"
import { getRegradeRequests, confirmRegrade } from "@/lib/api/submissions"
import { cn } from "@/lib/utils"
import type {
  AssignmentAnalyticsResponse,
  QuestionResponse,
  RegradeRequest,
} from "@/lib/api/types"

type TabType = "all" | "graded" | "not-submitted"
type PageTab = "overview" | "regrade"

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

// ── 문항 채점기준 행 ─────────────────────────────────────────────────────────

function QuestionCriteriaRow({
  question,
  assignmentId,
}: {
  question: QuestionResponse
  assignmentId: number
}) {
  const queryClient = useQueryClient()
  const [answer, setAnswer] = useState(question.answer ?? "")
  const [criteria, setCriteria] = useState(question.gradingCriteria ?? "")
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      updateQuestion(assignmentId, question.questionId, {
        answer,
        gradingCriteria: criteria || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  const isDirty =
    answer !== (question.answer ?? "") ||
    criteria !== (question.gradingCriteria ?? "")

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 text-sm font-medium text-gray-700 w-16 text-center">
        {question.orderNum}번
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
        {question.content || <span className="text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3 w-36">
        <input
          value={answer}
          onChange={(e) => { setAnswer(e.target.value); setSaved(false) }}
          placeholder="정답 입력"
          className="h-8 w-full rounded-lg border border-gray-200 px-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
        />
      </td>
      <td className="px-4 py-3">
        <input
          value={criteria}
          onChange={(e) => { setCriteria(e.target.value); setSaved(false) }}
          placeholder="채점 기준 (선택)"
          className="h-8 w-full rounded-lg border border-gray-200 px-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
        />
      </td>
      <td className="px-4 py-3 w-20 text-right">
        {saved ? (
          <span className="inline-flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            저장됨
          </span>
        ) : (
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !answer.trim() || !isDirty}
            className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-40 transition-colors"
          >
            {mutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            저장
          </button>
        )}
      </td>
    </tr>
  )
}

// ── 재채점 요청 행 ────────────────────────────────────────────────────────────

function RegradeRow({
  req,
  assignmentId,
}: {
  req: RegradeRequest
  assignmentId: number
}) {
  const queryClient = useQueryClient()
  const [score, setScore] = useState(String(req.currentScore))
  const [done, setDone] = useState(false)
  const [imgOpen, setImgOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      confirmRegrade(req.submissionId, req.questionId, { score: Number(score) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regrade-requests", assignmentId] })
      setDone(true)
    },
  })

  const scoreNum = Number(score)
  const isValidScore = !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= req.maxScore

  if (done) {
    return (
      <tr className="border-b border-gray-100 last:border-0 bg-green-50/40">
        <td colSpan={6} className="px-6 py-4 text-center text-sm text-green-600 font-medium">
          <CheckCircle2 className="inline h-4 w-4 mr-1.5 mb-0.5" />
          {req.studentName} · {req.questionOrderNum}번 — 점수 확정 ({scoreNum}점)
        </td>
      </tr>
    )
  }

  return (
    <>
      <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
        {/* 학생 */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
              {getInitials(req.studentName)}
            </div>
            <span className="text-sm font-medium text-gray-900">{req.studentName}</span>
          </div>
        </td>
        {/* 문항 */}
        <td className="px-6 py-4 text-sm text-gray-700">
          <span className="font-medium">{req.questionOrderNum}번</span>
          {req.questionContent && (
            <span className="ml-2 text-gray-400 text-xs truncate max-w-[180px] inline-block align-middle">
              {req.questionContent}
            </span>
          )}
        </td>
        {/* AI 채점 점수 */}
        <td className="px-6 py-4 text-sm">
          <span className="font-medium text-gray-900">{req.currentScore}</span>
          <span className="text-gray-400"> / {req.maxScore}점</span>
        </td>
        {/* 풀이 이미지 */}
        <td className="px-6 py-4">
          {req.imageUrl ? (
            <button
              onClick={() => setImgOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              풀이 보기
            </button>
          ) : (
            <span className="text-xs text-gray-300">없음</span>
          )}
        </td>
        {/* 요청 시각 */}
        <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
          {new Date(req.requestedAt).toLocaleString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        {/* 점수 확정 */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={req.maxScore}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-8 w-16 rounded-lg border border-gray-200 px-2 text-sm text-center outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              />
              <span className="text-xs text-gray-400">/ {req.maxScore}</span>
            </div>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !isValidScore}
              className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 disabled:opacity-40 transition-colors"
            >
              {mutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              확정
            </button>
          </div>
          {mutation.isError && (
            <p className="mt-1 text-xs text-red-400">저장 실패. 다시 시도해주세요.</p>
          )}
        </td>
      </tr>

      {/* 풀이 이미지 모달 */}
      {imgOpen && req.imageUrl && (
        <tr>
          <td colSpan={6} className="p-0">
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setImgOpen(false)}
            >
              <div
                className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    {req.studentName} · {req.questionOrderNum}번 풀이
                  </span>
                  <button
                    onClick={() => setImgOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={req.imageUrl}
                    alt="학생 풀이"
                    className="w-full rounded-lg object-contain max-h-[70vh]"
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

export default function AssignmentPage() {
  const params = useParams()
  const classId = params.classId as string
  const numericClassId = Number(classId)
  const assignmentId = Number(params.assignmentId)

  const [pageTab, setPageTab] = useState<PageTab>("overview")
  const [activeTab, setActiveTab] = useState<TabType>("all")

  const { data: classroomData } = useQuery({
    queryKey: ["classroom", numericClassId],
    queryFn: () => getClassroom(numericClassId),
    enabled: !!numericClassId,
  })

  const { data: assignmentData, isLoading: assignmentLoading } = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignment(assignmentId),
    enabled: !!assignmentId,
    refetchInterval: 15000,
  })

  const { data: analyticsData, isLoading: analyticsLoading, isError: analyticsError } = useQuery({
    queryKey: ["analytics", assignmentId],
    queryFn: () => getAssignmentAnalytics(assignmentId),
    enabled: !!assignmentId,
    refetchInterval: 15000,
  })

  const {
    data: regradeData,
    isLoading: regradeLoading,
    isError: regradeError,
  } = useQuery({
    queryKey: ["regrade-requests", assignmentId],
    queryFn: () => getRegradeRequests(assignmentId),
    enabled: !!assignmentId,
    refetchInterval: 30000,
  })

  const assignment = assignmentData?.data
  const analytics: AssignmentAnalyticsResponse[] = analyticsData?.data ?? []
  const questions: QuestionResponse[] = assignment?.questions ?? []
  const regradeRequests: RegradeRequest[] = regradeData ?? []
  const pendingRequests = regradeRequests.filter((r) => r.status === "PENDING")

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

  const filteredStudents = useMemo(() => {
    if (activeTab === "not-submitted") return []
    return studentSummaries
  }, [activeTab, studentSummaries])

  const studentTabs: { id: TabType; label: string; count: number }[] = [
    { id: "all", label: "전체", count: submittedCount || studentSummaries.length },
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
        {/* 헤더 */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/teacher" className="text-gray-500 hover:text-gray-700">
              반 관리
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/teacher/classes/${classId}`} className="text-gray-500 hover:text-gray-700">
              {classroomData?.data?.name ?? `반 ${classId}`}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {assignment?.title ?? "과제"}
            </span>
          </nav>
        </header>

        <main className="p-8">
          {/* 페이지 탭 */}
          <div className="mb-6 flex items-center gap-1 border-b border-gray-200">
            <button
              onClick={() => setPageTab("overview")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors",
                pageTab === "overview"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              과제 현황
            </button>
            <button
              onClick={() => setPageTab("regrade")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors",
                pageTab === "regrade"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <ClipboardList className="h-4 w-4" />
              재채점 요청 관리
              {pendingRequests.length > 0 && (
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  pageTab === "regrade"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                )}>
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* ── 과제 현황 탭 ─────────────────────────────────────────── */}
          {pageTab === "overview" && (
            isLoading ? (
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

                {/* 문항별 채점 기준 */}
                <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">문항별 채점 기준</h2>
                    <span className="text-xs text-gray-400">{questions.length}개 문항</span>
                  </div>
                  {questions.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-gray-400">
                      AI가 답지를 분석한 후 문항이 자동으로 생성됩니다.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500">
                          <th className="px-4 py-2.5 w-16 text-center">번호</th>
                          <th className="px-4 py-2.5">문항 내용</th>
                          <th className="px-4 py-2.5 w-36">정답</th>
                          <th className="px-4 py-2.5">채점 기준</th>
                          <th className="px-4 py-2.5 w-20" />
                        </tr>
                      </thead>
                      <tbody>
                        {questions
                          .slice()
                          .sort((a, b) => a.orderNum - b.orderNum)
                          .map((q) => (
                            <QuestionCriteriaRow
                              key={q.questionId}
                              question={q}
                              assignmentId={assignmentId}
                            />
                          ))}
                      </tbody>
                    </table>
                  )}
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
                      <p className="text-sm text-gray-400">
                        {analyticsError
                          ? "데이터를 불러오지 못했습니다."
                          : gradedCount > 0 || submittedCount > 0
                            ? "AI 분석 중... 자동으로 업데이트됩니다."
                            : "채점 완료 후 분석 결과가 표시됩니다."}
                      </p>
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
                    <div className="flex items-center gap-1 border-b border-gray-100 px-4 pt-4">
                      {studentTabs.map((tab) => (
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

                    {filteredStudents.length === 0 ? (
                      <div className="p-8 text-center text-sm text-gray-400">
                        {analyticsLoading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>불러오는 중...</span>
                          </div>
                        ) : analyticsError ? (
                          <span className="text-red-400">분석 데이터를 불러오지 못했습니다. 잠시 후 자동으로 재시도합니다.</span>
                        ) : activeTab === "not-submitted" ? (
                          <span>미제출 학생 목록은 현재 지원되지 않습니다.</span>
                        ) : gradedCount > 0 ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                            <span>AI가 채점 결과를 분석 중입니다. 자동으로 업데이트됩니다.</span>
                          </div>
                        ) : submittedCount > 0 ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                            <span>AI가 채점을 진행 중입니다. 자동으로 업데이트됩니다.</span>
                          </div>
                        ) : (
                          <span>아직 제출한 학생이 없습니다.</span>
                        )}
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
                          {filteredStudents.map((student) => (
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
                                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusStyles["graded"])}>
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
            )
          )}

          {/* ── 재채점 요청 관리 탭 ───────────────────────────────────── */}
          {pageTab === "regrade" && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">재채점 요청 관리</h2>
                  <p className="mt-0.5 text-xs text-gray-400">
                    학생이 AI 채점 결과에 이의를 제기한 문항입니다. 풀이를 확인하고 점수를 직접 확정해주세요.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {pendingRequests.length > 0 && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      대기 {pendingRequests.length}건
                    </span>
                  )}
                  <span className="text-xs text-gray-400">전체 {regradeRequests.length}건</span>
                </div>
              </div>

              {regradeLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                </div>
              ) : regradeError ? (
                <div className="py-16 text-center text-sm text-red-400">
                  재채점 요청 목록을 불러오지 못했습니다.
                </div>
              ) : regradeRequests.length === 0 ? (
                <div className="py-20 text-center">
                  <ClipboardList className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                  <p className="text-sm text-gray-400">재채점 요청이 없습니다.</p>
                </div>
              ) : (
                <>
                  {/* 탭: PENDING / 전체 */}
                  <div className="border-b border-gray-100 px-6">
                    <div className="flex gap-4 text-sm">
                      {[
                        { label: "대기 중", items: pendingRequests },
                        { label: "전체", items: regradeRequests },
                      ].map(({ label, items }) => (
                        <span key={label} className="py-3 text-gray-500 text-xs">
                          {label}: <strong className="text-gray-900">{items.length}건</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500">
                        <th className="px-6 py-3">학생</th>
                        <th className="px-6 py-3">문항</th>
                        <th className="px-6 py-3">AI 채점</th>
                        <th className="px-6 py-3">풀이</th>
                        <th className="px-6 py-3">요청 시각</th>
                        <th className="px-6 py-3">점수 확정</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PENDING 먼저, 나머지 그 다음 */}
                      {[
                        ...regradeRequests.filter((r) => r.status === "PENDING"),
                        ...regradeRequests.filter((r) => r.status !== "PENDING"),
                      ].map((req) =>
                        req.status !== "PENDING" ? (
                          <tr
                            key={req.regradeRequestId}
                            className="border-b border-gray-100 last:border-0 opacity-50"
                          >
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-white">
                                  {getInitials(req.studentName)}
                                </div>
                                <span className="text-sm text-gray-600">{req.studentName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600">
                              {req.questionOrderNum}번
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600">
                              {req.currentScore} / {req.maxScore}점
                            </td>
                            <td className="px-6 py-3" />
                            <td className="px-6 py-3 text-xs text-gray-400">
                              {new Date(req.requestedAt).toLocaleString("ko-KR", {
                                month: "2-digit", day: "2-digit",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-3">
                              <span className={cn(
                                "rounded-full px-2.5 py-1 text-xs font-medium",
                                req.status === "APPROVED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              )}>
                                {req.status === "APPROVED" ? "확정됨" : "반려됨"}
                              </span>
                            </td>
                          </tr>
                        ) : (
                          <RegradeRow
                            key={req.regradeRequestId}
                            req={req}
                            assignmentId={assignmentId}
                          />
                        )
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
