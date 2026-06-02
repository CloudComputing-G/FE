"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, BookOpen, CheckCircle2, AlertCircle, MinusCircle,
  BarChart2, Upload, Users, Bot, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubmissionResults } from "@/lib/api/submissions";
import { getAssignments } from "@/lib/api/assignments";
import { getMyClassrooms } from "@/lib/api/classrooms";
import type { QuestionResult } from "@/lib/api/types";

type ProblemStatus = "correct" | "partial" | "wrong";

const statusConfig: Record<ProblemStatus, {
  badge: string; text: string; icon: typeof CheckCircle2; iconColor: string; label: string;
}> = {
  correct: { badge: "bg-[#D1FAE5]", text: "text-[#10B981]", icon: CheckCircle2, iconColor: "text-[#10B981]", label: "정답" },
  partial: { badge: "bg-[#FEF3C7]", text: "text-[#F59E0B]", icon: MinusCircle,  iconColor: "text-[#F59E0B]", label: "부분점수" },
  wrong:   { badge: "bg-[#FEE2E2]", text: "text-[#EF4444]", icon: AlertCircle,  iconColor: "text-[#EF4444]", label: "오답" },
};

function toStatus(r: QuestionResult["result"]): ProblemStatus {
  if (r === "CORRECT") return "correct";
  if (r === "PARTIAL") return "partial";
  return "wrong";
}

const tabs = [
  { label: "결과",    icon: BarChart2, href: "/student/results",     active: false },
  { label: "업로드",  icon: Upload,    href: "/student/upload",      active: false },
  { label: "오답노트", icon: BookOpen,  href: "/student/wrong-notes", active: true },
  { label: "내 반",   icon: Users,     href: "/student/my-class",    active: false },
  { label: "AI튜터",  icon: Bot,       href: "/student/chat",        active: false },
];

interface SubmittedAssignment {
  assignmentId: number;
  title: string;
  submissionId: number;
}

function WrongNotesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const submissionIdParam = Number(searchParams.get("submissionId")) || 0;

  const [submittedAssignments, setSubmittedAssignments] = useState<SubmittedAssignment[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number>(submissionIdParam);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const classrooms = await getMyClassrooms();
        if (classrooms.length === 0) return;
        const assignments = await getAssignments(classrooms[0].classId);
        const userName = localStorage.getItem("userName") ?? "";
        const submitted: SubmittedAssignment[] = [];
        for (const a of assignments) {
          const sid = localStorage.getItem(`submission_${userName}_${a.assignmentId}`);
          if (sid) submitted.push({ assignmentId: a.assignmentId, title: a.title, submissionId: Number(sid) });
        }
        setSubmittedAssignments(submitted);
        if (!submissionIdParam && submitted.length > 0) {
          setSelectedSubmissionId(submitted[0].submissionId);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [submissionIdParam]);

  useEffect(() => {
    if (!selectedSubmissionId) { setLoading(false); return; }
    setLoading(true);
    setWrongQuestions([]);
    getSubmissionResults(selectedSubmissionId)
      .then((result) => {
        setWrongQuestions(
          result.questions.filter((q) => q.result === "WRONG" || q.result === "PARTIAL")
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSubmissionId]);

  function handleSelect(item: SubmittedAssignment) {
    setDropdownOpen(false);
    setSelectedSubmissionId(item.submissionId);
    router.replace(`/student/wrong-notes?submissionId=${item.submissionId}`);
  }

  const selectedAssignment = submittedAssignments.find((a) => a.submissionId === selectedSubmissionId);

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
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/student/my-class" aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </Link>
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight">
            오답노트
          </h1>
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
                    onClick={() => handleSelect(item)}
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

        {/* 오답 목록 */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl h-16 bg-[#F3F4F6] animate-pulse" />
            ))}
          </div>
        ) : !selectedSubmissionId ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">제출한 과제가 없습니다.</p>
        ) : wrongQuestions.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">오답이 없습니다! 🎉</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-[#6B7280] leading-[19.5px]">
              총 {wrongQuestions.length}개 문항
            </p>
            {wrongQuestions.map((q, idx) => {
              const status = toStatus(q.result);
              const cfg = statusConfig[status];
              const Icon = cfg.icon;
              return (
                <Link
                  key={q.questionId}
                  href={`/student/results/${q.questionId}?submissionId=${selectedSubmissionId}&from=wrong-notes`}
                  className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 py-4 active:opacity-70"
                >
                  <div className="flex items-center">
                    <Icon className={cn("w-5 h-5 flex-shrink-0", cfg.iconColor)} />
                    <div className="ml-3 flex flex-col gap-[2px] flex-1 min-w-0">
                      <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                        {idx + 1}번 문제
                      </span>
                      <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight truncate">
                        {q.questionContent}
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

export default function WrongNotesPage() {
  return (
    <Suspense>
      <WrongNotesContent />
    </Suspense>
  );
}
