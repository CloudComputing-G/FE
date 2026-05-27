"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Scissors, CheckCircle2, Circle, RefreshCw, BarChart2, Upload, BookOpen, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGradingStatus, getSubmissionResults } from "@/lib/api/submissions";
import type { QuestionResult } from "@/lib/api/types";

const tabs = [
  { label: "결과", icon: BarChart2, href: "/student/results", active: false },
  { label: "업로드", icon: Upload, href: "/student/upload", active: true },
  { label: "오답노트", icon: BookOpen, href: "#", active: false },
  { label: "내 반", icon: Users, href: "/student/my-class", active: false },
  { label: "AI튜터", icon: Bot, href: "#", active: false },
];

function GradingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = Number(searchParams.get("submissionId"));

  const [questions, setQuestions] = useState<QuestionResult[]>([]);
  const [doneCount, setDoneCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [done, setDone] = useState(false);

  const poll = useCallback(async () => {
    if (!submissionId) return;
    try {
      const status = await getGradingStatus(submissionId);
      if (status.status === "DONE") {
        setDone(true);
        const results = await getSubmissionResults(submissionId);
        setAssignmentTitle(results.assignmentTitle);
        setQuestions(results.questions);
        setDoneCount(results.questions.length);
        setTotalCount(results.questions.length);
      } else if (status.status === "FAILED") {
        setDone(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [submissionId]);

  useEffect(() => {
    if (!submissionId) return;
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [submissionId, poll]);

  useEffect(() => {
    if (done) {
      router.push(`/student/results?submissionId=${submissionId}`);
    }
  }, [done, submissionId, router]);

  const displayTotal = totalCount || questions.length || 7;

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
        {/* Heading */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-bold text-[#111827] leading-[36px] tracking-wide">
              AI 채점 중
            </h1>
            <p className="text-[14px] text-[#6B7280] leading-[21px] tracking-tight">
              잠시만 기다려주세요
            </p>
          </div>
          <Link
            href={`/student/results?submissionId=${submissionId}`}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F3F4F6] active:opacity-70"
          >
            <RefreshCw className="w-4 h-4 text-[#6B7280]" />
            <span className="text-[13px] font-medium text-[#6B7280] leading-[19.5px]">결과 보기</span>
          </Link>
        </div>

        {/* Upload complete + assignment info card */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-24 h-32 bg-[#F3F4F6] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[12px] text-[#6B7280] leading-[18px]">풀이 이미지</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="inline-block bg-[#D1FAE5] text-[#10B981] text-[11px] font-medium leading-[16.5px] tracking-wide px-3 py-1 rounded-full">
                업로드 완료
              </span>
              <p className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">
                {assignmentTitle || "과제"}<br />{displayTotal}개 문항
              </p>
            </div>
          </div>
        </div>

        {/* AI progress card */}
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4">
          <div className="flex items-center gap-3">
            <Scissors className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-[#1E40AF] leading-[21px] tracking-tight">
                AI가 문항별로 자동 분리하여 채점 중...
              </p>
              <p className="text-[12px] text-[#1E40AF] leading-[18px]">
                {doneCount}/{displayTotal} 문항 채점 완료
              </p>
            </div>
          </div>
        </div>

        {/* Problem list — shows placeholder rows while waiting */}
        <div className="flex flex-col gap-2">
          {questions.length > 0
            ? questions.map((q) => (
                <div
                  key={q.questionId}
                  className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                      <span className="text-[15px] font-medium text-[#111827] leading-[22.5px] tracking-tight">
                        {q.orderNum}번 문제
                      </span>
                    </div>
                    <span className="text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full bg-[#D1FAE5] text-[#10B981]">
                      완료
                    </span>
                  </div>
                </div>
              ))
            : Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle className="w-5 h-5 text-[#9CA3AF]" />
                      <span className="text-[15px] font-medium text-[#111827] leading-[22.5px] tracking-tight">
                        {i + 1}번 문제
                      </span>
                    </div>
                    <span className={cn("text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full", "bg-[#F3F4F6] text-[#6B7280]")}>
                      대기중
                    </span>
                  </div>
                </div>
              ))}
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

export default function GradingPage() {
  return (
    <Suspense>
      <GradingContent />
    </Suspense>
  );
}
