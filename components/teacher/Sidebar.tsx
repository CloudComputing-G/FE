"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, Bell, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/teacher", icon: LayoutGrid, label: "반 관리" },
  { href: "/teacher/notifications", icon: Bell, label: "알림" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user_role")
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-green-600">Checkmate</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/teacher"
              ? pathname === "/teacher" || pathname.startsWith("/teacher/classes")
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white">
              김
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">김선생님</p>
              <p className="text-xs text-gray-500">수학 교사</p>
            </div>
          </div>
          <button onClick={handleLogout} aria-label="로그아웃" className="text-gray-400 hover:text-gray-600 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
