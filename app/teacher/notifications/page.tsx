import { Bell } from "lucide-react"
import { Sidebar } from "@/components/teacher/Sidebar"

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-8">
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
        </header>

        <main className="p-8">
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-24 text-center shadow-sm">
            <Bell className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-base font-medium text-gray-500">새로운 알림이 없습니다.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
