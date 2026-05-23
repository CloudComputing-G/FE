import Link from "next/link"
import { ChevronRight, Plus, Users, FileText } from "lucide-react"
import { Sidebar } from "@/components/teacher/Sidebar"

const assignments = [
  {
    id: "2nd-math",
    name: "2차 수학 단원평가",
    dueDate: "~03.29",
    total: 8,
    submitted: 6,
    notSubmitted: 1,
    progress: 75,
    progressColor: "bg-green-500",
  },
  {
    id: "1st-math",
    name: "1차 수학 단원평가",
    dueDate: "~03.20",
    total: 8,
    submitted: 8,
    notSubmitted: 0,
    progress: 100,
    progressColor: "bg-green-500",
  },
  {
    id: "trig",
    name: "삼각함수 연습문제",
    dueDate: "~04.05",
    total: 8,
    submitted: 2,
    notSubmitted: 3,
    progress: 25,
    progressColor: "bg-orange-400",
  },
]

export default async function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params

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
            <span className="font-semibold text-gray-900">3학년 2반</span>
          </nav>
          <button className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors">
            <Plus className="h-4 w-4" />
            과제 추가
          </button>
        </header>

        <main className="p-8">
          {/* 반 정보 */}
          <div className="mb-8 flex items-center gap-6 rounded-xl bg-green-500 p-6 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm opacity-80">담당 반</p>
              <p className="mt-0.5 text-2xl font-bold">3학년 2반</p>
              <div className="mt-2 flex items-center gap-5 text-sm opacity-80">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  학생 8명
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  과제 3개
                </span>
              </div>
            </div>
          </div>

          {/* 과제 목록 */}
          <h2 className="mb-4 text-lg font-semibold text-gray-900">진행 중인 과제</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">과제명</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">마감일</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">제출 현황</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">진행률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((asgn) => (
                  <tr
                    key={asgn.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={
                          asgn.id === "2nd-math"
                            ? `/teacher/classes/${classId}/assignments/${asgn.id}`
                            : "#"
                        }
                        className="font-medium text-gray-900 hover:text-green-600"
                      >
                        {asgn.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{asgn.dueDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">전체 {asgn.total}</span>
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          제출 {asgn.submitted}
                        </span>
                        {asgn.notSubmitted > 0 && (
                          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                            미제출 {asgn.notSubmitted}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${asgn.progressColor}`}
                            style={{ width: `${asgn.progress}%` }}
                          />
                        </div>
                        <span className="text-gray-500">{asgn.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
