"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { login, saveTokens } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tokens = await login(id, password);
      saveTokens(tokens);
      router.push("/student/my-class");
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[430px] min-h-dvh bg-white mx-auto">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-14 pb-10">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-[#10B981] flex items-center justify-center mb-6">
          <GraduationCap className="w-10 h-10 text-white" strokeWidth={1.8} />
        </div>

        {/* Heading */}
        <h1 className="text-[28px] font-bold text-[#111827] leading-tight tracking-tight mb-2">
          Checkmate
        </h1>
        <p className="text-[14px] text-[#6B7280] leading-[21px] mb-10">
          AI 기반 스마트 채점 플랫폼
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* 아이디 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#374151]">아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]",
                "outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20",
                "transition-colors"
              )}
              autoComplete="username"
            />
          </div>

          {/* 비밀번호 */}
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

          {/* Error */}
          {error && (
            <p className="text-[13px] text-[#EF4444] leading-[19.5px] -mt-1">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || !id || !password}
            className={cn(
              "mt-2 h-12 w-full rounded-xl bg-[#10B981] text-white text-[16px] font-semibold",
              "active:opacity-80 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

      </div>
    </div>
  );
}
