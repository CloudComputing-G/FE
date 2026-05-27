import Link from "next/link"
import { Users, FileText, Plus, MoreHorizontal } from "lucide-react"
import { Sidebar } from "@/components/teacher/Sidebar"

const classes = [
  { id: "3-2", name: "3학년 2반", students: 8, assignments: 3 },
  { id: "3-1", name: "3학년 1반", students: 12, assignments: 5 },
  { id: "2-3", name: "2학년 3반", students: 10, assignments: 2 },
]

export default function TeacherPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h1 className="text-xl font-bold text-gray-900">반 관리</h1>
          <button className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors">
            <Plus className="h-4 w-4" />
            반 추가
          </button>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Link
                key={cls.id}
                href={cls.id === "3-2" ? `/teacher/classes/${cls.id}` : "#"}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <span
                    aria-label="더 보기"
                    className="opacity-0 group-hover:opacity-100 text-gray-400"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{cls.name}</h2>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    학생 {cls.students}명
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    과제 {cls.assignments}개
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
