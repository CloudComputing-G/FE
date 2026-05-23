"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronRight, Cpu } from "lucide-react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/teacher/Sidebar"
import { cn } from "@/lib/utils"

type TabType = "all" | "graded" | "grading" | "not-submitted"
type StatusType = "채점완료" | "채점중" | "미제출"

interface Student {
  id: string
  initials: string
  name: string
  score: string | null
  status: StatusType
}

const tabs: { id: TabType; label: string; count: number }[] = [
  { id: "all", label: "전체", count: 8 },
  { id: "graded", label: "채점완료", count: 4 },
  { id: "grading", label: "채점중", count: 3 },
  { id: "not-submitted", label: "미제출", count: 1 },
]

const gradedStudents: Student[] = [
  { id: "kim-minjun", initials: "KM", name: "김민준", score: "95/100점", status: "채점완료" },
  { id: "lee-seoyoon", initials: "LS", name: "이서윤", score: "88/100점", status: "채점완료" },
  { id: "park-jiho", initials: "PJ", name: "박지호", score: "92/100점", status: "채점완료" },
  { id: "choi-sua", initials: "CS", name: "최수아", score: "85/100점", status: "채점완료" },
]

const gradingStudents: Student[] = [
  { id: "jung-yejun", initials: "JY", name: "정예준", score: null, status: "채점중" },
  { id: "kang-haeun", initials: "KH", name: "강하은", score: null, status: "채점중" },
  { id: "yoon-dohyeon", initials: "YD", name: "윤도현", score: null, status: "채점중" },
]

const notSubmittedStudents: Student[] = [
  { id: "oh-taeyang", initials: "OT", name: "오태양", score: null, status: "미제출" },
]

const studentsByTab: Record<TabType, Student[]> = {
  all: [...gradedStudents, ...gradingStudents, ...notSubmittedStudents],
  graded: gradedStudents,
  grading: gradingStudents,
  "not-submitted": notSubmittedStudents,
}

const weakTopics = [
  { name: "삼각비", pct: 78 },
  { name: "이차함수 극값", pct: 62 },
  { name: "로그 성질", pct: 55 },
]

const statusStyles: Record<StatusType, string> = {
  채점완료: "bg-green-100 text-green-700",
  채점중: "bg-yellow-50 text-yellow-700",
  미제출: "bg-gray-100 text-gray-500",
}

const stats = [
  { value: 8, label: "전체", color: "text-gray-900" },
  { value: 7, label: "제출", color: "text-blue-600" },
  { value: 4, label: "채점완료", color: "text-green-600" },
  { value: 1, label: "미제출", color: "text-orange-500" },
]

export default function AssignmentPage() {
  const params = useParams()
  const classId = params.classId as string
  const assignmentId = params.assignmentId as string
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const students = studentsByTab[activeTab]

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
              3학년 2반
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">2차 수학 단원평가</span>
          </nav>
        </header>

        <main className="p-8">
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
                <button className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 transition-colors">
                  <Cpu className="h-3 w-3" />
                  AI 분석
                </button>
              </div>
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
            </div>

            {/* 학생 목록 */}
            <div className="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* 필터 탭 */}
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

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">학생</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">점수</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={
                            student.id === "kim-minjun"
                              ? `/teacher/classes/${classId}/assignments/${assignmentId}/students/${student.id}`
                              : "#"
                          }
                          className="flex items-center gap-3 group"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                            {student.initials}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-green-600">
                            {student.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {student.score ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            statusStyles[student.status]
                          )}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
