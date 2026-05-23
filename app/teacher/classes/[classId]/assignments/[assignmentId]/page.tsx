"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, MoreHorizontal, Cpu } from "lucide-react"
import { useParams } from "next/navigation"
import { BottomNav } from "@/components/teacher/BottomNav"
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

const tabs: { id: TabType; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "graded", label: "채점완료" },
  { id: "grading", label: "채점중" },
  { id: "not-submitted", label: "미제출" },
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
  채점중: "bg-yellow-50 text-yellow-600",
  미제출: "bg-gray-100 text-gray-500",
}

export default function AssignmentPage() {
  const params = useParams()
  const classId = params.classId as string
  const assignmentId = params.assignmentId as string

  const [activeTab, setActiveTab] = useState<TabType>("all")
  const students = studentsByTab[activeTab]

  return (
    <div className="flex w-full flex-col bg-white pb-16">
      <div>
        {/* 상태바 */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="text-sm font-semibold">9:41</span>
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 py-3">
          <Link href={`/teacher/classes/${classId}`} className="text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">2차 수학 단원평가</h1>
        </div>

        {/* 통계 카드 */}
        <div className="mx-4 rounded-xl bg-green-500 p-5 text-white">
          <div className="flex items-center justify-around">
            {[
              { value: 8, label: "전체" },
              { value: 7, label: "제출" },
              { value: 4, label: "채점완료" },
              { value: 1, label: "미제출" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="mt-0.5 text-xs opacity-80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 취약 문제 예측 */}
        <div className="mt-5 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">취약 문제 예측</h2>
            <button className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
              <Cpu className="h-3 w-3" />
              AI 분석
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {weakTopics.map((topic) => (
              <div key={topic.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-700">{topic.name}</span>
                  <span className="text-sm font-medium text-red-500">{topic.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{ width: `${topic.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="mt-5 flex items-center gap-2 px-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-green-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 학생 목록 */}
        <div className="mt-2 px-5">
          {students.map((student) => (
            <div key={student.id}>
              <Link
                href={
                  student.id === "kim-minjun"
                    ? `/teacher/classes/${classId}/assignments/${assignmentId}/students/${student.id}`
                    : "#"
                }
                className="flex items-center gap-3 py-4 active:opacity-70"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                  {student.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{student.name}</p>
                  {student.score && (
                    <p className="mt-0.5 text-xs text-gray-500">{student.score}</p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                    statusStyles[student.status]
                  )}
                >
                  {student.status}
                </span>
              </Link>
              <div className="h-px bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
