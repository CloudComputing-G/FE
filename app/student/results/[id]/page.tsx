"use client";

import Link from "next/link";
import { ChevronLeft, AlertTriangle, BarChart2, Upload, BookOpen, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const feedbackLines: {
  ok: boolean;
  text: string;
  strikethrough?: boolean;
}[] = [
  { ok: false, text: "코사인 법칙 공식: c² = a² + b² - 2ab cos C", strikethrough: true },
  { ok: true,  text: "AC² = 8² + 10² - 2(8)(10)cos60°" },
  { ok: true,  text: "AC² = 64 + 100 - 80" },
  { ok: false, text: "AC = √84 (계산 오류)", strikethrough: true },
];

const tabs = [
  { label: "결과",   icon: BarChart2, href: "/student/results",   active: true },
  { label: "업로드", icon: Upload,    href: "/student/upload",    active: false },
  { label: "오답노트", icon: BookOpen, href: "#",                 active: false },
  { label: "내 반",  icon: Users,     href: "/student/my-class",  active: false },
  { label: "AI튜터", icon: Bot,       href: "#",                  active: false },
];

export default function ProblemDetailPage() {
  return (
    <div className="flex flex-col w-full max-w-md min-h-screen bg-white mx-auto">
      {/* StatusBar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-white">
        <span className="text-[15px] font-semibold text-[#111827] tracking-tight">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-[3px] items-end h-4">
            <div className="w-[3px] h-[4px] bg-[#111827] rounded-sm" />
            <div className="w-[3px] h-[6px] bg-[#111827] rounded-sm" />
            <div className="w-[3px] h-[9px] bg-[#111827] rounded-sm" />
            <div className="w-[3px] h-[11px] bg-[#111827] rounded-sm" />
          </div>
          <div className="w-4 h-3 border border-[#111827] rounded-sm ml-1" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 flex flex-col gap-4">

        {/* Header: back + title */}
        <div className="flex items-center gap-3">
          <button aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </button>
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight">
            2번 문제
          </h1>
        </div>

        {/* Card 1 — 문제 */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
              문제
            </span>
            <span className="bg-[#FEF3C7] text-[#F59E0B] text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full">
              부분점수
            </span>
          </div>

          {/* Problem text box */}
          <div className="bg-[#F9FAFB] rounded-lg px-4 py-4">
            <p className="text-[14px] text-[#111827] leading-[21px] tracking-tight">
              삼각형 ABC에서 AB = 8, BC = 10, ∠B = 60°일 때, AC의 길이를 구하시오.
            </p>
          </div>

          {/* Score row */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">배점</span>
            <span className="text-[18px] font-bold text-[#111827] leading-[27px] tracking-tight">
              12/15점
            </span>
          </div>
        </div>

        {/* Card 2 — 내 풀이 */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
            내 풀이
          </span>
          {/* Student image placeholder */}
          <div className="bg-[#F3F4F6] rounded-lg flex items-center justify-center" style={{ height: 280 }}>
            <span className="text-[16px] text-[#6B7280] leading-[24px]">[학생 풀이 이미지]</span>
          </div>
        </div>

        {/* Card 3 — AI 채점 피드백 */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
            AI 채점 피드백
          </span>

          {/* Feedback lines */}
          <div className="flex flex-col gap-3">
            {feedbackLines.map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className={cn(
                    "text-[14px] font-bold leading-[21px] flex-shrink-0",
                    line.ok ? "text-[#10B981]" : "text-[#EF4444]"
                  )}
                >
                  {line.ok ? "✓" : "✗"}
                </span>
                <p
                  className={cn(
                    "text-[14px] leading-[21px] tracking-tight",
                    line.ok ? "text-[#6B7280]" : "text-[#6B7280]",
                    line.strikethrough && "line-through"
                  )}
                >
                  {line.text}
                </p>
              </div>
            ))}

            {/* Answer box */}
            <div className="bg-[#F0FDF4] rounded-lg px-3 py-3">
              <p className="text-[14px] font-bold text-[#047857] leading-[21px] tracking-tight">
                정답: AC = 2√21
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 — 재채점 요청 */}
        <div className="bg-white rounded-xl border border-[#FDE68A] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          {/* Info row */}
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-[1px]" />
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-[#92400E] leading-[21px] tracking-tight">
                채점에 이의가 있으신가요?
              </p>
              <p className="text-[12px] text-[#92400E] leading-[18px]">
                재채점 요청 시 교사가 직접 확인합니다
              </p>
            </div>
          </div>

          {/* Button */}
          <button className="w-full border border-[#10B981] rounded-lg py-3 active:opacity-70">
            <span className="text-[15px] font-semibold text-[#10B981] leading-[22.5px] tracking-tight">
              재채점 요청하기
            </span>
          </button>
        </div>

      </div>

      {/* TabBar */}
      <div className="flex items-center justify-between bg-white px-[15px] py-2 border-t border-[#F3F4F6]">
        {tabs.map(({ label, icon: Icon, href, active }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1 w-[60px] py-1 active:opacity-70"
            aria-label={label}
          >
            <Icon
              className={cn("w-[22px] h-[22px]", active ? "text-[#10B981]" : "text-[#9CA3AF]")}
            />
            <span
              className={cn(
                "text-[11px] leading-[16.5px] tracking-wide",
                active ? "font-semibold text-[#10B981]" : "font-medium text-[#6B7280]"
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
