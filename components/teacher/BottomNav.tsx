import Link from "next/link"
import { Home, Users } from "lucide-react"

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-gray-100 bg-white">
      <Link
        href="/teacher"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-green-500"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs">홈</span>
      </Link>
      <button className="flex flex-1 flex-col items-center justify-center gap-0.5 text-gray-400">
        <Users className="h-5 w-5" />
        <span className="text-xs">관리</span>
      </button>
    </nav>
  )
}
