import Link from "next/link"
import { ChevronRight, CheckCircle2, Clock } from "lucide-react"
import { Sidebar } from "@/components/teacher/Sidebar"
import { cn } from "@/lib/utils"

type ProblemStatus = "정답" | "부분점수"

const problems: { num: number; score: string; maxScore: number; status: ProblemStatus }[] = [
  { num: 1, score: "15/15점", maxScore: 15, status: "정답" },
  { num: 2, score: "12/15점", maxScore: 15, status: "부분점수" },
  { num: 3, score: "15/15점", maxScore: 15, status: "정답" },
  { num: 4, score: "15/15점", maxScore: 15, status: "정답" },
  { num: 5, score: "15/15점", maxScore: 15, status: "정답" },
  { num: 6, score: "23/25점", maxScore: 25, status: "부분점수" },
]

export default async function StudentResultPage({
  params,
}: {
  params: Promise<{ classId: string; assignmentId: string; studentId: string }>
}) {
  const { classId, assignmentId } = await params

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
              3학년 2반
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href={`/teacher/classes/${classId}/assignments/${assignmentId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              2차 수학 단원평가
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">김민준</span>
          </nav>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* 왼쪽: 점수 + 취약 개념 */}
            <div className="flex flex-col gap-6">
              {/* 점수 카드 */}
              <div className="flex flex-col items-center rounded-xl bg-green-500 py-10 text-white shadow-sm">
                <p className="text-sm opacity-80">총점</p>
                <p className="mt-2 text-5xl font-bold">95</p>
                <p className="mt-1 text-lg opacity-80">/ 100점</p>
                <div className="mt-4 rounded-full bg-white/20 px-4 py-1.5 text-sm">
                  정답률 95%
                </div>
              </div>

              {/* 취약 개념 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-900">취약 개념 분석</h2>
                <div className="flex flex-col gap-2">
                  <span className="rounded-lg bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700">
                    삼각비 활용
                  </span>
                  <span className="rounded-lg bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700">
                    이차함수 그래프
                  </span>
                </div>
              </div>
            </div>

            {/* 오른쪽: 문항별 결과 */}
            <div className="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900">문항별 결과</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">문항</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">점수</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">결과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {problems.map((problem) => (
                    <tr key={problem.num} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {problem.status === "정답" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-orange-400" />
                          )}
                          <span className="font-medium text-gray-900">{problem.num}번 문제</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{problem.score}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            problem.status === "정답"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-600"
                          )}
                        >
                          {problem.status}
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
