"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { login } from "@/lib/api/auth";

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
      const res = await login({ email: id, password });

      if (!res.success) {
        const msg =
          res.fieldErrors?.[0]?.reason ?? res.message ?? "로그인에 실패했습니다.";
        setError(msg);
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      if (res.data.username) localStorage.setItem("userName", res.data.username);

      if (id.includes("teacher")) {
        router.push("/teacher");
      } else {
        router.push("/student/my-class");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; fieldErrors?: { reason: string }[] } } };
      const serverMsg =
        axiosErr.response?.data?.fieldErrors?.[0]?.reason ??
        axiosErr.response?.data?.message ??
        "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
      setError(serverMsg);
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
            <label className="text-[14px] font-medium text-[#374151]">
              아이디
            </label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]",
                "outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20",
                "transition-colors",
              )}
              autoComplete="username"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#374151]">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]",
                "outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20",
                "transition-colors",
              )}
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-[13px] text-[#EF4444] leading-[19.5px] -mt-1">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || !id || !password}
            className={cn(
              "mt-2 h-12 w-full rounded-xl bg-[#10B981] text-white text-[16px] font-semibold",
              "active:opacity-80 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Test Accounts */}
        <div className="mt-8 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4">
          <p className="text-center text-[13px] font-semibold text-[#374151] mb-3">
            테스트 계정
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6B7280]">교사:</span>
              <span className="text-[13px] text-[#374151] font-medium">
                teacher@gmail.com / teacher123
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6B7280]">학생:</span>
              <span className="text-[13px] text-[#374151] font-medium">
                student@gmail.com / student123
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
