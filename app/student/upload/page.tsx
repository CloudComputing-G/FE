"use client";

import Link from "next/link";
import { Camera, BarChart2, Upload, BookOpen, Users, Bot, ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "결과", icon: BarChart2, href: "/student/results", active: false },
  { label: "업로드", icon: Upload, href: "/student/upload", active: true },
  { label: "오답노트", icon: BookOpen, href: "#", active: false },
  { label: "내 반", icon: Users, href: "/student/my-class", active: false },
  { label: "AI튜터", icon: Bot, href: "#", active: false },
];

export default function StudentUploadPage() {
  return (
    <div className="flex flex-col w-full max-w-md min-h-screen bg-[#F9FAFB] mx-auto">
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
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
          {/* Page Title */}
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight text-center">
            풀이 업로드
          </h1>

          {/* Assignment Card */}
          <div className="bg-white rounded-xl px-4 py-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Green icon box */}
                <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 border-[1.4px] border-[#10B981] rounded" />
                </div>
                {/* Text */}
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                    2차 수학 단원평가
                  </span>
                  <span className="text-[12px] text-[#9CA3AF] leading-[18px]">
                    마감: 2026년 3월 28일 23:59
                  </span>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div
            className="flex flex-col items-center justify-center gap-0 rounded-[16px] border border-dashed border-[#D1D5DB] bg-white py-[65px] px-4 cursor-pointer active:opacity-70"
            style={{ minHeight: 311 }}
            onClick={() => {}}
          >
            {/* Camera icon circle */}
            <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-[#6B7280]" />
            </div>
            {/* Title */}
            <p className="text-[16px] font-semibold text-[#111827] leading-[24px] tracking-tight mb-3">
              풀이 사진 추가
            </p>
            {/* Subtitle */}
            <p className="text-[13px] font-medium text-[#6B7280] leading-[19.5px] text-center px-4 mb-2">
              탭하여 사진을 선택하거나 찍으세요 또는 파일
            </p>
            {/* Format hint */}
            <p className="text-[12px] font-medium text-[#D1D5DB] leading-[18px] text-center">
              JPG, PNG, HEIC 지원
            </p>
          </div>

          {/* Tip Box */}
          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-4">
            <div className="flex items-start gap-2 mb-3">
              {/* Lightbulb icon area */}
              <Lightbulb className="w-[18px] h-[18px] text-[#F59E0B] flex-shrink-0 mt-[1px]" />
              <span className="text-[13px] font-semibold text-[#92400E] leading-[19.5px] tracking-tight">
                촬영 팁
              </span>
            </div>
            <div className="flex flex-col gap-1 pl-6">
              <p className="text-[12px] text-[#92400E] leading-[18px]">
                풀이 전체가 보이도록 찍어주세요
              </p>
              <p className="text-[12px] text-[#92400E] leading-[18px]">
                밝은 곳에서 그림자 없이 촬영해주세요
              </p>
              <p className="text-[12px] text-[#92400E] leading-[18px]">
                글씨가 선명하게 나오도록 초점을 맞춰주세요
              </p>
            </div>
          </div>
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
