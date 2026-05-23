import Link from "next/link"
import { ArrowLeft, MoreHorizontal } from "lucide-react"
import { BottomNav } from "@/components/teacher/BottomNav"

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
    <div className="flex w-full flex-col bg-white pb-16">
      {/* 상태바 */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-sm font-semibold">9:41</span>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </div>

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link href="/teacher" className="text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">3학년 2반</h1>
      </div>

      {/* 반 정보 카드 */}
      <div className="mx-4 rounded-xl bg-green-500 p-5 text-white">
        <p className="text-sm opacity-80">담당 반</p>
        <p className="mt-0.5 text-xl font-bold">3학년 2반</p>
        <p className="mt-1 text-sm opacity-80">8명 · 3개 과제</p>
      </div>

      {/* 진행 중인 과제 */}
      <div className="mt-6 px-5">
        <h2 className="mb-4 text-base font-semibold">진행 중인 과제</h2>
        <div className="flex flex-col">
          {assignments.map((asgn, i) => (
            <div key={asgn.id}>
              {i > 0 && <div className="my-1 h-px bg-gray-100" />}
              <Link
                href={
                  asgn.id === "2nd-math"
                    ? `/teacher/classes/${classId}/assignments/${asgn.id}`
                    : "#"
                }
                className="block py-4 active:opacity-70"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold">{asgn.name}</p>
                  <span className="text-sm text-gray-400">{asgn.dueDate}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">전체 {asgn.total}</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    제출완료 {asgn.submitted}
                  </span>
                  {asgn.notSubmitted > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                      미제출 {asgn.notSubmitted}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${asgn.progressColor}`}
                    style={{ width: `${asgn.progress}%` }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
