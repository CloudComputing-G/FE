"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  ChevronLeft, BookOpen,
  CheckCircle2, AlertCircle, MinusCircle,
  BarChart2, Upload, Users, Bot, ChevronDown, ChevronUp, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubmissionResults, getGradingStatus, getMySubmissions } from "@/lib/api/submissions";
import type { SubmissionResultResponse, QuestionResult } from "@/lib/api/types";

type ProblemStatus = "correct" | "partial" | "wrong";

const statusConfig: Record<ProblemStatus, {
  badge: string; text: string; icon: typeof CheckCircle2; iconColor: string; label: string;
}> = {
  correct: { badge: "bg-[#D1FAE5]", text: "text-[#10B981]", icon: CheckCircle2, iconColor: "text-[#10B981]", label: "정답" },
  partial: { badge: "bg-[#FEF3C7]", text: "text-[#F59E0B]", icon: MinusCircle,  iconColor: "text-[#F59E0B]", label: "부분점수" },
  wrong:   { badge: "bg-[#FEE2E2]", text: "text-[#EF4444]", icon: AlertCircle,  iconColor: "text-[#EF4444]", label: "오답" },
};

function gradingResultToStatus(r: QuestionResult["result"]): ProblemStatus {
  if (r === "CORRECT") return "correct";
  if (r === "PARTIAL") return "partial";
  return "wrong";
}

const tabs = [
  { label: "결과",    icon: BarChart2, href: "/student/results",   active: true },
  { label: "업로드",  icon: Upload,    href: "/student/upload",    active: false },
  { label: "오답노트", icon: BookOpen,  href: "/student/wrong-notes", active: false },
  { label: "내 반",   icon: Users,     href: "/student/my-class",  active: false },
  { label: "AI튜터",  icon: Bot,       href: "/student/chat",      active: false },
];

interface SubmittedAssignment {
  assignmentId: number;
  title: string;
  submissionId: number;
}

function StudentResultsContent() {
  const [submittedAssignments, setSubmittedAssignments] = useState<SubmittedAssignment[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [result, setResult] = useState<SubmissionResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [gradingMessage, setGradingMessage] = useState<string | null>(null);

  useEffect(() => {
    getMySubmissions()
      .then((list) =>
        setSubmittedAssignments(
          list.map((s) => ({ assignmentId: s.assignmentId, title: s.assignmentTitle, submissionId: s.submissionId }))
        )
      )
      .catch(console.error);
  }, []);

  async function fetchResults(submissionId: number) {
    setResult(null);
    setGradingMessage(null);
    setLoading(true);
    try {
      const res = await getSubmissionResults(submissionId);
      if (res && res.questions.length > 0) {
        setResult(res);
      } else {
        const status = await getGradingStatus(submissionId);
        if (status.status === "FAILED") {
          setGradingMessage("채점 중 오류가 발생했습니다.");
        } else if (status.status === "DONE") {
          setGradingMessage("채점 결과를 불러오지 못했습니다.");
        } else {
          setGradingMessage("채점 중입니다. 잠시 후 다시 확인해주세요.");
        }
      }
    } catch (e) {
      console.error(e);
      setGradingMessage("결과를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectAssignment(item: SubmittedAssignment) {
    setDropdownOpen(false);
    if (item.submissionId === selectedSubmissionId) return;
    setSelectedSubmissionId(item.submissionId);
    fetchResults(item.submissionId);
  }

  const selectedAssignment = submittedAssignments.find((a) => a.submissionId === selectedSubmissionId);

  return (
    <div className="flex flex-col w-full max-w-md h-dvh bg-white mx-auto">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 flex flex-col gap-4">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <Link href="/student/my-class" aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </Link>
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight flex-1">
            채점 결과
          </h1>
          <button
            onClick={() => { if (!selectedSubmissionId || loading) return; fetchResults(selectedSubmissionId); }}
            disabled={!selectedSubmissionId || loading}
            aria-label="새로고침"
            className="active:opacity-70 disabled:opacity-30"
          >
            <RefreshCw className={cn("w-5 h-5 text-[#6B7280]", loading && "animate-spin")} />
          </button>
        </div>

        {/* 과제 선택 드롭다운 */}
        {submittedAssignments.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full bg-[#F9FAFB] rounded-xl px-4 py-3 flex items-center justify-between active:opacity-70 border border-[#E5E7EB]"
            >
              <span className="text-[14px] font-semibold text-[#111827] leading-[21px] truncate pr-2">
                {selectedAssignment?.title ?? "과제 선택"}
              </span>
              {dropdownOpen
                ? <ChevronUp className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
              }
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)] z-10 overflow-hidden border border-[#E5E7EB]">
                {submittedAssignments.map((item) => (
                  <button
                    key={item.assignmentId}
                    onClick={() => handleSelectAssignment(item)}
                    className={cn(
                      "w-full px-4 py-3 text-left active:opacity-70",
                      item.submissionId === selectedSubmissionId ? "bg-[#F0FDF4]" : "bg-white"
                    )}
                  >
                    <span className={cn(
                      "text-[14px] font-medium leading-[21px]",
                      item.submissionId === selectedSubmissionId ? "text-[#10B981]" : "text-[#111827]"
                    )}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl h-24 bg-[#F3F4F6] animate-pulse" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="flex-1 h-20 rounded-xl bg-[#F3F4F6] animate-pulse" />)}
            </div>
          </div>
        ) : submittedAssignments.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">제출한 과제가 없습니다.</p>
        ) : !selectedSubmissionId ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">과제를 선택하면 채점 결과를 확인할 수 있습니다.</p>
        ) : !result ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">{gradingMessage ?? "아직 채점이 완료되지 않았습니다."}</p>
        ) : (
          <>
            {/* Score card */}
            <div className="rounded-xl px-4 pt-2 pb-4 bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
              <p className="text-[36px] font-bold text-white leading-[54px] tracking-wide text-center mt-2">
                {result.totalScore}/{result.maxScore}점
              </p>
              <p className="text-[14px] text-white/90 leading-[21px] tracking-tight text-center">
                정답률 {Math.round(result.correctRate * 100)}%
              </p>
            </div>

            {/* Summary stat cards */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
                <p className="text-[24px] font-bold text-[#10B981] leading-[36px]">{result.summary.correct}</p>
                <p className="text-[12px] text-[#6B7280] leading-[18px]">정답</p>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
                <p className="text-[24px] font-bold text-[#F59E0B] leading-[36px]">{result.summary.partial}</p>
                <p className="text-[12px] text-[#6B7280] leading-[18px]">부분점수</p>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-1 items-center">
                <p className="text-[24px] font-bold text-[#EF4444] leading-[36px]">{result.summary.wrong}</p>
                <p className="text-[12px] text-[#6B7280] leading-[18px]">오답</p>
              </div>
            </div>

            {/* Problem list */}
            <div className="flex flex-col gap-3">
              <h2 className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                문항별 결과
              </h2>
              <div className="flex flex-col gap-2">
                {result.questions.map((q, idx) => {
                  const status = gradingResultToStatus(q.result);
                  const cfg = statusConfig[status];
                  const Icon = cfg.icon;
                  return (
                    <Link
                      key={q.questionId}
                      href={`/student/results/${q.questionId}?submissionId=${selectedSubmissionId}`}
                      className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4 active:opacity-70"
                    >
                      <div className="flex items-center">
                        <Icon className={cn("w-5 h-5 flex-shrink-0", cfg.iconColor)} />
                        <div className="ml-3 flex flex-col gap-[2px] flex-1 min-w-0">
                          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                            {idx + 1}번 문제
                          </span>
                          <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">
                            {q.score}/{q.maxScore}점
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
        {tabs.map(({ label, icon: Icon, href, active }) => {
          return (
            <Link key={label} href={href} className="flex flex-col items-center gap-1 w-[60px] py-1 active:opacity-70" aria-label={label}>
              <Icon className={cn("w-[22px] h-[22px]", active ? "text-[#10B981]" : "text-[#9CA3AF]")} />
              <span className={cn("text-[11px] leading-[16.5px] tracking-wide", active ? "font-semibold text-[#10B981]" : "font-medium text-[#6B7280]")}>
                {label}
              </span>
            </Link>
          );
        })}
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
