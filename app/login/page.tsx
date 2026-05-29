"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { login } from "@/lib/api/auth"

type Role = "TEACHER" | "STUDENT"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("TEACHER")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await login({ email, password })
      if (res.success && res.data) {
        localStorage.setItem("accessToken", res.data.accessToken)
        localStorage.setItem("refreshToken", res.data.refreshToken)
        localStorage.setItem("user_role", role)
        router.push(role === "TEACHER" ? "/teacher" : "/student/my-class")
      } else {
        setError(res.message || "로그인에 실패했습니다.")
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      setError(axiosError.response?.data?.message || "아이디 또는 비밀번호가 올바르지 않습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-[430px] min-h-dvh bg-white mx-auto">
      <div className="flex-1 flex flex-col items-center px-6 pt-14 pb-10">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-[#10B981] flex items-center justify-center mb-6">
          <GraduationCap className="w-10 h-10 text-white" strokeWidth={1.8} />
        </div>

        <h1 className="text-[28px] font-bold text-[#111827] leading-tight tracking-tight mb-2">
          Checkmate
        </h1>
        <p className="text-[14px] text-[#6B7280] leading-[21px] mb-8">
          AI 기반 스마트 채점 플랫폼
        </p>

        {/* Role selector */}
        <div className="w-full flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1 mb-6">
          {(["TEACHER", "STUDENT"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 rounded-lg py-2 text-[14px] font-medium transition-all",
                role === r
                  ? "bg-white text-[#10B981] shadow-sm"
                  : "text-[#6B7280] hover:text-[#374151]"
              )}
            >
              {r === "TEACHER" ? "선생님" : "학생"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#374151]">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]",
                "outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20",
                "transition-colors"
              )}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#374151]">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]",
                "outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20",
                "transition-colors"
              )}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#EF4444] leading-[19.5px] -mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={cn(
              "mt-2 h-12 w-full rounded-xl bg-[#10B981] text-white text-[16px] font-semibold",
              "active:opacity-80 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 테스트 계정 */}
        <div className="mt-8 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4">
          <p className="text-center text-[13px] font-semibold text-[#374151] mb-3">테스트 계정</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6B7280]">교사</span>
              <span className="text-[13px] font-medium text-[#374151]">teacher2@test.com / teacher123</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6B7280]">학생</span>
              <span className="text-[13px] font-medium text-[#374151]">student@test.com / student123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
