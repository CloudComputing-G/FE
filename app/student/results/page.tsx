"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, MessageCircle, BookOpen, Shuffle,
  CheckCircle2, AlertCircle, MinusCircle,
  BarChart2, Upload, Users, Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubmissionResults } from "@/lib/api/submissions";
import type { SubmissionResultResponse, QuestionResult } from "@/lib/api/types";

type ProblemStatus = "correct" | "partial" | "wrong";

const statusConfig: Record<ProblemStatus, {
  badge: string; text: string; icon: typeof CheckCircle2; iconColor: string; label: string;
}> = {
  correct: { badge: "bg-[#D1FAE5]", text: "text-[#10B981]", icon: CheckCircle2, iconColor: "text-[#10B981]", label: "정답" },
  partial: { badge: "bg-[#FEF3C7]", text: "text-[#F59E0B]", icon: MinusCircle,  iconColor: "text-[#F59E0B]", label: "부분점수" },
  wrong:   { badge: "bg-[#FEE2E2]", text: "text-[#EF4444]", icon: AlertCircle,  iconColor: "text-[#EF4444]", label: "오답" },
};

function gradingResultToStatus(r: QuestionResult["gradingResult"]): ProblemStatus {
  if (r === "CORRECT") return "correct";
  if (r === "PARTIAL") return "partial";
  return "wrong";
}

const tabs = [
  { label: "결과",    icon: BarChart2, href: "/student/results",   active: true },
  { label: "업로드",  icon: Upload,    href: "/student/upload",    active: false },
  { label: "오답노트", icon: BookOpen,  href: "#",                  active: false },
  { label: "내 반",   icon: Users,     href: "/student/my-class",  active: false },
  { label: "AI튜터",  icon: Bot,       href: "#",                  active: false },
];

function StudentResultsContent() {
  const searchParams = useSearchParams();
  const submissionId = Number(searchParams.get("submissionId"));

  const [result, setResult] = useState<SubmissionResultResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!submissionId) { setLoading(false); return; }
    getSubmissionResults(submissionId)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [submissionId]);

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

        {/* Page header */}
        <div className="flex items-center gap-3">
          <Link href="/student/my-class" aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </Link>
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight">
            채점 결과
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl h-24 bg-[#F3F4F6] animate-pulse" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="flex-1 h-20 rounded-xl bg-[#F3F4F6] animate-pulse" />)}
            </div>
          </div>
        ) : !result ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">결과를 불러올 수 없습니다.</p>
        ) : (
          <>
            {/* Score card */}
            <div className="rounded-xl px-4 pt-2 pb-4 bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
              <p className="text-[36px] font-bold text-white leading-[54px] tracking-wide text-center mt-2">
                {result.totalScore}/{result.maxScore}점
              </p>
              <p className="text-[14px] text-white/90 leading-[21px] tracking-tight text-center">
                정답률 {result.accuracyRate}%
              </p>
            </div>

            {/* Summary stat cards */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
                <p className="text-[24px] font-bold text-[#10B981] leading-[36px]">{result.correctCount}</p>
                <p className="text-[12px] text-[#6B7280] leading-[18px]">정답</p>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
                <p className="text-[24px] font-bold text-[#F59E0B] leading-[36px]">{result.partialCount}</p>
                <p className="text-[12px] text-[#6B7280] leading-[18px]">부분점수</p>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
                <p className="text-[24px] font-bold text-[#EF4444] leading-[36px]">{result.wrongCount}</p>
                <p className="text-[12px] text-[#6B7280] leading-[18px]">오답</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-[#F0FDF4] active:opacity-70">
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-[13px] font-medium text-[#10B981] leading-[19.5px] tracking-tight whitespace-nowrap">AI 질문하기</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-[#F0FDF4] active:opacity-70">
                <BookOpen className="w-4 h-4 text-[#10B981]" />
                <span className="text-[13px] font-medium text-[#10B981] leading-[19.5px] tracking-tight whitespace-nowrap">오답노트</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-[#F0FDF4] active:opacity-70">
                <Shuffle className="w-4 h-4 text-[#10B981]" />
                <span className="text-[13px] font-medium text-[#10B981] leading-[19.5px] tracking-tight whitespace-nowrap">유사문제</span>
              </button>
            </div>

            {/* Problem list */}
            <div className="flex flex-col gap-3">
              <h2 className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                문항별 결과
              </h2>
              <div className="flex flex-col gap-2">
                {result.questions.map((q) => {
                  const status = gradingResultToStatus(q.gradingResult);
                  const cfg = statusConfig[status];
                  const Icon = cfg.icon;
                  return (
                    <Link
                      key={q.questionId}
                      href={`/student/results/${q.questionId}?submissionId=${submissionId}`}
                      className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4 active:opacity-70"
                    >
                      <div className="flex items-center">
                        <Icon className={cn("w-5 h-5 flex-shrink-0", cfg.iconColor)} />
                        <div className="ml-3 flex flex-col gap-[2px] flex-1 min-w-0">
                          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                            {q.orderNum}번 문제
                          </span>
                          <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">
                            {q.earnedScore}/{q.maxScore}점
                          </span>
                        </div>
                        <span className={cn("ml-2 text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full flex-shrink-0", cfg.badge, cfg.text)}>
                          {cfg.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* TabBar */}
      <div className="flex items-center justify-between bg-white px-[15px] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-[#F3F4F6]">
        {tabs.map(({ label, icon: Icon, href, active }) => (
          <Link key={label} href={href} className="flex flex-col items-center gap-1 w-[60px] py-1 active:opacity-70" aria-label={label}>
            <Icon className={cn("w-[22px] h-[22px]", active ? "text-[#10B981]" : "text-[#9CA3AF]")} />
            <span className={cn("text-[11px] leading-[16.5px] tracking-wide", active ? "font-semibold text-[#10B981]" : "font-medium text-[#6B7280]")}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StudentResultsPage() {
  return (
    <Suspense>
      <StudentResultsContent />
    </Suspense>
  );
}
