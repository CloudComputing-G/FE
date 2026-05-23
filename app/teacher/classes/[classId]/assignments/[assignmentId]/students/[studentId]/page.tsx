import Link from "next/link"
import { ArrowLeft, MoreHorizontal, CheckCircle2, Clock } from "lucide-react"
import { BottomNav } from "@/components/teacher/BottomNav"
import { cn } from "@/lib/utils"

type ProblemStatus = "정답" | "부분점수"

const problems: { num: number; score: string; status: ProblemStatus }[] = [
  { num: 1, score: "15/15점", status: "정답" },
  { num: 2, score: "12/15점", status: "부분점수" },
  { num: 3, score: "15/15점", status: "정답" },
  { num: 4, score: "15/15점", status: "정답" },
  { num: 5, score: "15/15점", status: "정답" },
  { num: 6, score: "23/25점", status: "부분점수" },
]

export default async function StudentResultPage({
  params,
}: {
  params: Promise<{ classId: string; assignmentId: string; studentId: string }>
}) {
  const { classId, assignmentId } = await params

  return (
    <div className="flex w-full flex-col bg-white pb-16">
      {/* 상태바 */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-sm font-semibold">9:41</span>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </div>

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link
          href={`/teacher/classes/${classId}/assignments/${assignmentId}`}
          className="text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">김민준 학생 결과</h1>
      </div>

      {/* 점수 카드 */}
      <div className="mx-4 flex flex-col items-center rounded-xl bg-green-500 py-8 text-white">
        <span className="text-4xl font-bold">95/100</span>
        <span className="mt-2 text-sm opacity-80">정답률 95%</span>
      </div>

      {/* 취약 개념 분석 */}
      <div className="mt-5 px-5">
        <h2 className="mb-3 text-base font-semibold">취약 개념 분석</h2>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-700">
            삼각비 활용
          </span>
          <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-700">
            이차함수 그래프
          </span>
        </div>
      </div>

      {/* 문항별 결과 */}
      <div className="mt-5 px-5">
        <h2 className="mb-1 text-base font-semibold">문항별 결과</h2>
        {problems.map((problem) => (
          <div key={problem.num}>
            <div className="flex items-center gap-3 py-4">
              {problem.status === "정답" ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
              ) : (
                <Clock className="h-6 w-6 shrink-0 text-orange-400" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{problem.num}번 문제</p>
                <p className="mt-0.5 text-xs text-gray-500">{problem.score}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                  problem.status === "정답"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-600"
                )}
              >
                {problem.status}
              </span>
            </div>
            <div className="h-px bg-gray-100" />
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
