"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Plus, Users, FileText, Loader2, Trash2, Send, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { getClassroom } from "@/lib/api/classrooms"
import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  publishAssignment,
} from "@/lib/api/assignments"
import type { AssignmentResponse } from "@/lib/api/types"
import { cn } from "@/lib/utils"

function CreateAssignmentDialog({
  classId,
  onClose,
}: {
  classId: number
  onClose: () => void
}) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () =>
      createAssignment({
        title,
        subject: subject || undefined,
        classId,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", classId] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">과제 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">과제명 *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 1차 수학 단원평가"
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">과목</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="예: 수학"
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">마감일</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>

        {mutation.isError && (
          <p className="mb-3 text-xs text-red-500">과제 생성에 실패했습니다.</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!title.trim() || mutation.isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            추가 (임시저장)
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignmentRow({
  asgn,
  classId,
}: {
  asgn: AssignmentResponse
  classId: number
}) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => deleteAssignment(asgn.assignmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments", classId] }),
  })

  const publishMutation = useMutation({
    mutationFn: () => publishAssignment(asgn.assignmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments", classId] }),
  })

  const total = asgn.totalCount ?? 0
  const submitted = asgn.submittedCount ?? 0
  const notSubmitted = asgn.notSubmittedCount ?? 0
  const progress = total > 0 ? Math.round((submitted / total) * 100) : 0
  const progressColor = progress === 100 ? "bg-green-500" : progress >= 50 ? "bg-green-500" : "bg-orange-400"

  const dueDateStr = asgn.dueDate
    ? `~${new Date(asgn.dueDate).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}`
    : "—"

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/teacher/classes/${classId}/assignments/${asgn.assignmentId}`}
            className="font-medium text-gray-900 hover:text-green-600"
          >
            {asgn.title}
          </Link>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              asgn.status === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {asgn.status === "PUBLISHED" ? "게시됨" : "임시저장"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">{dueDateStr}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">전체 {total}</span>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            제출 {submitted}
          </span>
          {notSubmitted > 0 && (
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-600">
              미제출 {notSubmitted}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
            <div className={cn("h-full rounded-full", progressColor)} style={{ width: `${progress}%` }} />
          </div>
          <span className="text-gray-500">{progress}%</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {asgn.status === "DRAFT" && (
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              title="게시하기"
              className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
            >
              {publishMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              게시
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("이 과제를 삭제하시겠습니까?")) deleteMutation.mutate()
            }}
            disabled={deleteMutation.isPending}
            title="삭제"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function ClassPage() {
  const params = useParams()
  const classId = Number(params.classId)
  const router = useRouter()

  const { data: classroomData, isLoading: classLoading } = useQuery({
    queryKey: ["classroom", classId],
    queryFn: () => getClassroom(classId),
    enabled: !!classId,
  })

  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["assignments", classId],
    queryFn: () => getAssignments(classId),
    enabled: !!classId,
  })

  const classroom = classroomData?.data
  const assignments = assignmentsData?.data ?? []
  const isLoading = classLoading || assignmentsLoading

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/teacher" className="text-gray-500 hover:text-gray-700">
              반 관리
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {classroom?.name ?? `반 ${classId}`}
            </span>
          </nav>
          <button
            onClick={() => router.push(`/teacher/classes/${classId}/assignments/new`)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            과제 추가
          </button>
        </header>

        <main className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : (
            <>
              {/* 반 정보 */}
              <div className="mb-8 flex items-center gap-6 rounded-xl bg-green-500 p-6 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm opacity-80">담당 반</p>
                  <p className="mt-0.5 text-2xl font-bold">{classroom?.name ?? "—"}</p>
                  <div className="mt-2 flex items-center gap-5 text-sm opacity-80">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      학생 {classroom?.studentCount ?? 0}명
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      과제 {assignments.length}개
                    </span>
                  </div>
                </div>
              </div>

              {/* 과제 목록 */}
              <h2 className="mb-4 text-lg font-semibold text-gray-900">과제 목록</h2>
              {assignments.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                  <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-sm text-gray-500">등록된 과제가 없습니다.</p>
                  <button
                    onClick={() => router.push(`/teacher/classes/${classId}/assignments/new`)}
                    className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                  >
                    첫 번째 과제 추가하기
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-6 py-3 text-left font-medium text-gray-500">과제명</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">마감일</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">제출 현황</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">진행률</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assignments.map((asgn) => (
                        <AssignmentRow key={asgn.assignmentId} asgn={asgn} classId={classId} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
