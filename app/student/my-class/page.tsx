"use client";

import Link from "next/link";
import { Calendar, BarChart2, Upload, BookOpen, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const assignments = [
  {
    id: 1,
    title: "2차 수학 단원평가",
    dueDate: "2026-05-28",
    badge: { label: "미제출", color: "bg-[#F3F4F6] text-[#6B7280]" },
    deadline: { label: "D-4", color: "bg-[#FEE2E2] text-[#EF4444]" },
    count: null,
    href: "/student/upload",
  },
  {
    id: 2,
    title: "1차 수학 단원평가",
    dueDate: "2026-05-10",
    badge: { label: "제출 완료", color: "bg-[#DBEAFE] text-[#3B82F6]" },
    deadline: null,
    count: null,
    href: null,
  },
  {
    id: 3,
    title: "이차방정식 심화 문제",
    dueDate: "2026-05-20",
    badge: { label: "미제출", color: "bg-[#F3F4F6] text-[#6B7280]" },
    deadline: null,
    count: null,
    href: "/student/upload",
  },
];

const tabs = [
  { label: "결과", icon: BarChart2, href: "/student/results", active: false },
  { label: "업로드", icon: Upload, href: "/student/upload", active: false },
  { label: "오답노트", icon: BookOpen, href: "#", active: false },
  { label: "내 반", icon: Users, href: "/student/my-class", active: true },
  { label: "AI튜터", icon: Bot, href: "#", active: false },
];

export default function StudentMyClassPage() {
  return (
    <div className="flex flex-col w-full max-w-md h-dvh bg-white mx-auto">
      {/* StatusBar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-2">
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
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 flex flex-col gap-3">
        {/* Greeting Card */}
        <div className="rounded-xl px-4 pt-4 pb-4 flex flex-col gap-1 bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
          <p className="text-[18px] font-semibold text-white leading-[27px] tracking-tight">
            안녕하세요, 오태양 님 👋
          </p>
          <p className="text-[14px] font-normal text-white/90 leading-[21px]">
            오늘도 열심히 공부해봐요!
          </p>
        </div>

        {/* Class Info Card */}
        <div className="rounded-xl px-4 pt-4 pb-4 flex flex-col gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
          <p className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
            소속 반
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-bold text-[#10B981] leading-[27px] tracking-tight">
              3학년 2반
            </p>
            <p className="text-[13px] font-normal text-[#6B7280] leading-[19.5px]">
              진행중 과제 3개
            </p>
          </div>
        </div>

        {/* Assignment List Header */}
        <div className="pt-2">
          <p className="text-[18px] font-semibold text-[#111827] leading-[27px] tracking-tight">
            과제 목록
          </p>
        </div>

        {/* Assignment Cards */}
        <div className="flex flex-col gap-3">
          {assignments.map((item) => {
            const card = (
              <div className="flex flex-col gap-2">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-[14px] h-[14px] text-[#6B7280]" />
                      <span className="text-[13px] text-[#6B7280] leading-[19.5px]">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                  {item.deadline && (
                    <span
                      className={cn(
                        "text-[11px] font-medium leading-[16.5px] px-2 py-[2px] rounded-full",
                        item.deadline.color
                      )}
                    >
                      {item.deadline.label}
                    </span>
                  )}
                </div>

                {/* Bottom row */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full",
                      item.badge.color
                    )}
                  >
                    {item.badge.label}
                  </span>
                  {item.count && (
                    <span className="text-[12px] text-[#6B7280] leading-[18px]">
                      {item.count}
                    </span>
                  )}
                </div>
              </div>
            );

            return item.href ? (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-xl px-4 pt-4 pb-4 flex flex-col gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] active:opacity-70"
              >
                {card}
              </Link>
            ) : (
              <div
                key={item.id}
                className="rounded-xl px-4 pt-4 pb-4 flex flex-col gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]"
              >
                {card}
              </div>
            );
          })}
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
