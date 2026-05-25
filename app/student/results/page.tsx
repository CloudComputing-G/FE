"use client";

import Link from "next/link";
import { ChevronLeft, MessageCircle, BookOpen, Shuffle, CheckCircle2, AlertCircle, MinusCircle, BarChart2, Upload, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type ProblemStatus = "correct" | "partial" | "wrong";

const problems: {
  number: number;
  label: string;
  score: string;
  status: ProblemStatus;
}[] = [
  { number: 1, label: "1번 문제", score: "15/15점", status: "correct" },
  { number: 2, label: "2번 문제", score: "12/15점", status: "partial" },
  { number: 3, label: "3번 문제", score: "0/15점",  status: "wrong"   },
  { number: 4, label: "4번 문제", score: "15/15점", status: "correct" },
  { number: 5, label: "5번 문제", score: "15/15점", status: "correct" },
  { number: 6, label: "6번 문제", score: "15/15점", status: "correct" },
  { number: 7, label: "7번 문제", score: "15/15점", status: "correct" },
];

const statusConfig: Record<
  ProblemStatus,
  { badge: string; text: string; icon: typeof CheckCircle2; iconColor: string; label: string }
> = {
  correct: {
    badge: "bg-[#D1FAE5]",
    text: "text-[#10B981]",
    icon: CheckCircle2,
    iconColor: "text-[#10B981]",
    label: "정답",
  },
  partial: {
    badge: "bg-[#FEF3C7]",
    text: "text-[#F59E0B]",
    icon: MinusCircle,
    iconColor: "text-[#F59E0B]",
    label: "부분점수",
  },
  wrong: {
    badge: "bg-[#FEE2E2]",
    text: "text-[#EF4444]",
    icon: AlertCircle,
    iconColor: "text-[#EF4444]",
    label: "오답",
  },
};

const tabs = [
  { label: "결과", icon: BarChart2, href: "/student/results", active: true },
  { label: "업로드", icon: Upload, href: "/student/upload", active: false },
  { label: "오답노트", icon: BookOpen, href: "#", active: false },
  { label: "내 반", icon: Users, href: "/student/my-class", active: false },
  { label: "AI튜터", icon: Bot, href: "#", active: false },
];

export default function StudentResultsPage() {
  return (
    <div className="flex flex-col w-full max-w-md h-dvh bg-white mx-auto">
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
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 flex flex-col gap-6">

        {/* Page header: back + title */}
        <div className="flex items-center gap-3">
          <Link href="/student/my-class/graded" aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </Link>
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight">
            채점 결과
          </h1>
        </div>

        {/* Score card — gradient green */}
        <div className="rounded-xl px-4 pt-2 pb-4 bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
          <p className="text-[36px] font-bold text-white leading-[54px] tracking-wide text-center mt-2">
            87/105점
          </p>
          <p className="text-[14px] text-white/90 leading-[21px] tracking-tight text-center">
            정답률 83%
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="flex gap-2">
          {/* 정답 */}
          <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
            <p className="text-[24px] font-bold text-[#10B981] leading-[36px]">5</p>
            <p className="text-[12px] text-[#6B7280] leading-[18px]">정답</p>
          </div>
          {/* 부분점수 */}
          <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
            <p className="text-[24px] font-bold text-[#F59E0B] leading-[36px]">1</p>
            <p className="text-[12px] text-[#6B7280] leading-[18px]">부분점수</p>
          </div>
          {/* 오답 */}
          <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
            <p className="text-[24px] font-bold text-[#EF4444] leading-[36px]">1</p>
            <p className="text-[12px] text-[#6B7280] leading-[18px]">오답</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-[#F0FDF4] active:opacity-70">
            <MessageCircle className="w-4 h-4 text-[#10B981]" />
            <span className="text-[13px] font-medium text-[#10B981] leading-[19.5px] tracking-tight whitespace-nowrap">
              AI 질문하기
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-[#F0FDF4] active:opacity-70">
            <BookOpen className="w-4 h-4 text-[#10B981]" />
            <span className="text-[13px] font-medium text-[#10B981] leading-[19.5px] tracking-tight whitespace-nowrap">
              오답노트
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-[#F0FDF4] active:opacity-70">
            <Shuffle className="w-4 h-4 text-[#10B981]" />
            <span className="text-[13px] font-medium text-[#10B981] leading-[19.5px] tracking-tight whitespace-nowrap">
              유사문제
            </span>
          </button>
        </div>

        {/* Problem list section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
            문항별 결과
          </h2>
          <div className="flex flex-col gap-2">
            {problems.map((problem) => {
              const cfg = statusConfig[problem.status];
              const Icon = cfg.icon;
              return (
                <Link
                  key={problem.number}
                  href={`/student/results/${problem.number}`}
                  className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4 active:opacity-70"
                >
                  <div className="flex items-center">
                    {/* Status icon */}
                    <Icon className={cn("w-5 h-5 flex-shrink-0", cfg.iconColor)} />
                    {/* Problem name + score */}
                    <div className="ml-3 flex flex-col gap-[2px] flex-1 min-w-0">
                      <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                        {problem.label}
                      </span>
                      <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">
                        {problem.score}
                      </span>
                    </div>
                    {/* Status badge */}
                    <span
                      className={cn(
                        "ml-2 text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full flex-shrink-0",
                        cfg.badge,
                        cfg.text
                      )}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* TabBar */}
      <div className="flex items-center justify-between bg-white px-[15px] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-[#F3F4F6]">
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
