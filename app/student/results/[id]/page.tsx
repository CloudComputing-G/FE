"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, BarChart2, Upload, BookOpen, Users, Bot, Shuffle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubmissionResults, requestRegrade } from "@/lib/api/submissions";
import { getSimilarProblem } from "@/lib/api/chat";
import type { QuestionResult } from "@/lib/api/types";

const tabs = [
  { label: "결과",    icon: BarChart2, href: "/student/results",    active: true },
  { label: "업로드",  icon: Upload,    href: "/student/upload",     active: false },
  { label: "오답노트", icon: BookOpen,  href: "/student/wrong-notes", active: false },
  { label: "내 반",   icon: Users,     href: "/student/my-class",   active: false },
  { label: "AI튜터",  icon: Bot,       href: "/student/chat",       active: false },
];

function statusBadge(r: QuestionResult["result"]) {
  if (r === "CORRECT") return { label: "정답",    bg: "bg-[#D1FAE5]", text: "text-[#10B981]" };
  if (r === "PARTIAL") return { label: "부분점수", bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]" };
  return                      { label: "오답",    bg: "bg-[#FEE2E2]", text: "text-[#EF4444]" };
}

function ProblemDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const submissionId = Number(searchParams.get("submissionId"));
  const questionId = Number(id);
  const from = searchParams.get("from"); // "wrong-notes"면 오답노트에서 진입

  const [question, setQuestion] = useState<QuestionResult | null>(null);
  const [questionNum, setQuestionNum] = useState<number>(0);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [regradeStatus, setRegradeStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [similarProblem, setSimilarProblem] = useState<string | null>(null);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    if (!submissionId) { setLoading(false); return; }
    getSubmissionResults(submissionId)
      .then((result) => {
        setAssignmentTitle(result.assignmentTitle);
        const idx = result.questions.findIndex((q) => q.questionId === questionId);
        if (idx !== -1) {
          setQuestion(result.questions[idx]);
          setQuestionNum(idx + 1);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [submissionId, questionId]);

  async function handleSimilarProblem() {
    if (loadingSimilar) return;
    if (similarProblem) { setSimilarProblem(null); return; }
    setLoadingSimilar(true);
    try {
      const result = await getSimilarProblem(questionId);
      setSimilarProblem(result);
    } catch {
      setSimilarProblem("현재 유사 문제를 만드는 중입니다. 잠시 시간이 걸리니 기다려주세요.");
    } finally {
      setLoadingSimilar(false);
    }
  }

  async function handleRegrade() {
    if (!submissionId) return;
    setRegradeStatus("submitting");
    try {
      await requestRegrade(submissionId, questionId);
      setRegradeStatus("done");
    } catch {
      setRegradeStatus("error");
    }
  }

  const badge = question ? statusBadge(question.result) : null;

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
          <Link href={from === "wrong-notes" ? `/student/wrong-notes?submissionId=${submissionId}` : `/student/results?submissionId=${submissionId}`} aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </Link>
          <h1 className="flex-1 text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight">
            {loading ? "문제" : question ? `${questionNum}번 문제` : "문제"}
          </h1>
          <Link
            href={`/student/chat/${questionId}?submissionId=${submissionId}`}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#F0FDF4] active:opacity-70"
          >
            <Bot className="w-4 h-4 text-[#10B981]" />
            <span className="text-[12px] font-medium text-[#10B981]">AI 튜터</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl h-32 bg-[#F3F4F6] animate-pulse" />
            <div className="rounded-xl h-48 bg-[#F3F4F6] animate-pulse" />
          </div>
        ) : !question ? (
          <p className="text-[14px] text-[#6B7280] text-center py-16">문제 정보를 불러올 수 없습니다.</p>
        ) : (
          <>
            {/* Card 1 — 문제 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">문제</span>
                <span className={cn("text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full", badge!.bg, badge!.text)}>
                  {badge!.label}
                </span>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg px-4 py-4">
                <p className="text-[14px] text-[#111827] leading-[21px] tracking-tight">
                  {question.questionContent}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">배점</span>
                <span className="text-[18px] font-bold text-[#111827] leading-[27px] tracking-tight">
                  {question.score}/{question.maxScore}점
                </span>
              </div>
            </div>

            {/* Card 2 — 내 풀이 */}
            {question.imageUrl && (
              <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
                <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">내 풀이</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={question.imageUrl} alt="학생 풀이" className="w-full rounded-lg object-contain" />
              </div>
            )}

            {/* Card 3 — AI 채점 피드백 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
              <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                AI 채점 피드백
              </span>
              <div className="flex flex-col gap-3">
                {question.reason ? (
                  <p className="text-[14px] leading-[21px] tracking-tight text-[#6B7280]">
                    {question.reason}
                  </p>
                ) : (
                  <p className="text-[14px] text-[#9CA3AF] leading-[21px]">피드백 없음</p>
                )}
              </div>
              <button
                onClick={handleSimilarProblem}
                disabled={loadingSimilar}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#F0FDF4] active:opacity-70 disabled:opacity-50"
              >
                {loadingSimilar
                  ? <Loader2 className="w-4 h-4 text-[#10B981] animate-spin" />
                  : <Shuffle className="w-4 h-4 text-[#10B981]" />
                }
                <span className="text-[14px] font-semibold text-[#10B981] leading-[21px]">
                  {loadingSimilar ? "생성 중..." : similarProblem ? "유사문제 닫기" : "유사문제 생성"}
                </span>
              </button>
            </div>

            {/* Card 4 — 유사문제 */}
            {similarProblem && (
              <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
                <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                  유사문제
                </span>
                <div className="bg-[#F9FAFB] rounded-lg px-4 py-4">
                  <p className="text-[14px] text-[#111827] leading-[21px] tracking-tight whitespace-pre-wrap">
                    {similarProblem}
                  </p>
                </div>
              </div>
            )}

            {/* Card 5 — 재채점 요청 */}
            <div className="bg-white rounded-xl border border-[#FDE68A] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
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

              {regradeStatus === "done" ? (
                <p className="text-[14px] text-[#10B981] font-semibold text-center py-2">재채점 요청 완료!</p>
              ) : question.regradeStatus === "PENDING" ? (
                <p className="text-[14px] text-[#F59E0B] font-semibold text-center py-2">재채점 검토 중</p>
              ) : (
                <>
                  {regradeStatus === "error" && (
                    <p className="text-[12px] text-[#EF4444]">요청에 실패했습니다. 다시 시도해주세요.</p>
                  )}
                  <button
                    onClick={handleRegrade}
                    disabled={regradeStatus === "submitting"}
                    className="w-full border border-[#10B981] rounded-lg py-3 active:opacity-70"
                  >
                    <span className="text-[15px] font-semibold text-[#10B981] leading-[22.5px] tracking-tight">
                      {regradeStatus === "submitting" ? "요청 중..." : "재채점 요청하기"}
                    </span>
                  </button>
                </>
              )}
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

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <ProblemDetailContent params={params} />
    </Suspense>
  );
}
