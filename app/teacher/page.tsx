import Link from "next/link"
import { MoreHorizontal, Users, FileText, Plus } from "lucide-react"
import { BottomNav } from "@/components/teacher/BottomNav"

const classes = [
  { id: "3-2", name: "3학년 2반", students: 8, assignments: 3 },
  { id: "3-1", name: "3학년 1반", students: 12, assignments: 5 },
  { id: "2-3", name: "2학년 3반", students: 10, assignments: 2 },
]

export default function TeacherPage() {
  return (
    <div className="flex w-full flex-col bg-white pb-16">
      {/* 상태바 */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-sm font-semibold">9:41</span>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </div>

      {/* 타이틀 */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-bold">반 관리</h1>
      </div>

      {/* 반 목록 */}
      <div>
        {classes.map((cls, i) => (
          <div key={cls.id}>
            {i > 0 && <div className="mx-5 h-px bg-gray-100" />}
            <Link
              href={cls.id === "3-2" ? `/teacher/classes/${cls.id}` : "#"}
              className="block px-5 py-5 active:bg-gray-50"
            >
              <p className="text-base font-semibold">{cls.name}</p>
              <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  학생 {cls.students}명
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  과제 {cls.assignments}개
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        aria-label="반 추가"
        className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg active:bg-green-600"
      >
        <Plus className="h-7 w-7" />
      </button>

      <BottomNav />
    </div>
  )
}
