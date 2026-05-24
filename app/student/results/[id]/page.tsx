"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, BarChart2, Upload, BookOpen, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackLine = { ok: boolean; text: string; strikethrough?: boolean };

type ProblemData = {
  label: string;
  status: "correct" | "partial" | "wrong";
  badgeLabel: string;
  badgeColor: string;
  badgeText: string;
  questionText: string;
  score: string;
  totalScore: string;
  feedback: FeedbackLine[];
  answer: string;
};

const problemsData: Record<number, ProblemData> = {
  1: {
    label: "1번 문제",
    status: "correct",
    badgeLabel: "정답",
    badgeColor: "bg-[#D1FAE5]",
    badgeText: "text-[#10B981]",
    questionText: "다음 이차방정식을 풀어라. x² - 5x + 6 = 0",
    score: "15",
    totalScore: "15",
    feedback: [
      { ok: true, text: "(x - 2)(x - 3) = 0 으로 인수분해" },
      { ok: true, text: "x = 2 또는 x = 3" },
    ],
    answer: "x = 2 또는 x = 3",
  },
  2: {
    label: "2번 문제",
    status: "partial",
    badgeLabel: "부분점수",
    badgeColor: "bg-[#FEF3C7]",
    badgeText: "text-[#F59E0B]",
    questionText: "삼각형 ABC에서 AB = 8, BC = 10, ∠B = 60°일 때, AC의 길이를 구하시오.",
    score: "12",
    totalScore: "15",
    feedback: [
      { ok: false, text: "코사인 법칙 공식: c² = a² + b² - 2ab cos C", strikethrough: true },
      { ok: true,  text: "AC² = 8² + 10² - 2(8)(10)cos60°" },
      { ok: true,  text: "AC² = 64 + 100 - 80" },
      { ok: false, text: "AC = √84 (계산 오류)", strikethrough: true },
    ],
    answer: "AC = 2√21",
  },
  3: {
    label: "3번 문제",
    status: "wrong",
    badgeLabel: "오답",
    badgeColor: "bg-[#FEE2E2]",
    badgeText: "text-[#EF4444]",
    questionText: "등차수열 {aₙ}에서 a₁ = 3, 공차 d = 4일 때, a₁₀의 값을 구하시오.",
    score: "0",
    totalScore: "15",
    feedback: [
      { ok: false, text: "aₙ = a₁ + (n-1)d 공식 미적용", strikethrough: true },
      { ok: false, text: "a₁₀ = 3 + 10 × 4 = 43 (n-1 누락)", strikethrough: true },
    ],
    answer: "a₁₀ = 3 + 9 × 4 = 39",
  },
  4: {
    label: "4번 문제",
    status: "correct",
    badgeLabel: "정답",
    badgeColor: "bg-[#D1FAE5]",
    badgeText: "text-[#10B981]",
    questionText: "log₂8 + log₂4의 값을 구하시오.",
    score: "15",
    totalScore: "15",
    feedback: [
      { ok: true, text: "log₂8 = 3, log₂4 = 2" },
      { ok: true, text: "3 + 2 = 5" },
    ],
    answer: "5",
  },
  5: {
    label: "5번 문제",
    status: "correct",
    badgeLabel: "정답",
    badgeColor: "bg-[#D1FAE5]",
    badgeText: "text-[#10B981]",
    questionText: "함수 f(x) = 2x³ - 3x² + 1을 미분하시오.",
    score: "15",
    totalScore: "15",
    feedback: [
      { ok: true, text: "f'(x) = 6x² - 6x" },
    ],
    answer: "f'(x) = 6x² - 6x",
  },
  6: {
    label: "6번 문제",
    status: "correct",
    badgeLabel: "정답",
    badgeColor: "bg-[#D1FAE5]",
    badgeText: "text-[#10B981]",
    questionText: "∫(2x + 3)dx를 구하시오. (단, 적분상수는 C)",
    score: "15",
    totalScore: "15",
    feedback: [
      { ok: true, text: "x² + 3x + C" },
    ],
    answer: "x² + 3x + C",
  },
  7: {
    label: "7번 문제",
    status: "correct",
    badgeLabel: "정답",
    badgeColor: "bg-[#D1FAE5]",
    badgeText: "text-[#10B981]",
    questionText: "확률변수 X가 정규분포 N(50, 10²)을 따를 때, P(40 ≤ X ≤ 60)을 구하시오.",
    score: "15",
    totalScore: "15",
    feedback: [
      { ok: true, text: "Z = (X - 50) / 10 으로 표준화" },
      { ok: true, text: "P(-1 ≤ Z ≤ 1) = 0.6826" },
    ],
    answer: "약 0.6826",
  },
};

const tabs = [
  { label: "결과",   icon: BarChart2, href: "/student/results",   active: true },
  { label: "업로드", icon: Upload,    href: "/student/upload",    active: false },
  { label: "오답노트", icon: BookOpen, href: "#",                 active: false },
  { label: "내 반",  icon: Users,     href: "/student/my-class",  active: false },
  { label: "AI튜터", icon: Bot,       href: "#",                  active: false },
];

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const problemId = parseInt(id, 10);
  const problem = problemsData[problemId] ?? problemsData[1];

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

        {/* Header: back + title */}
        <div className="flex items-center gap-3">
          <Link href="/student/results" aria-label="뒤로가기" className="active:opacity-70">
            <ChevronLeft className="w-6 h-6 text-[#111827]" />
          </Link>
          <h1 className="text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight">
            {problem.label}
          </h1>
        </div>

        {/* Card 1 — 문제 */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
              문제
            </span>
            <span className={cn("text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full", problem.badgeColor, problem.badgeText)}>
              {problem.badgeLabel}
            </span>
          </div>

          <div className="bg-[#F9FAFB] rounded-lg px-4 py-4">
            <p className="text-[14px] text-[#111827] leading-[21px] tracking-tight">
              {problem.questionText}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280] leading-[19.5px] tracking-tight">배점</span>
            <span className="text-[18px] font-bold text-[#111827] leading-[27px] tracking-tight">
              {problem.score}/{problem.totalScore}점
            </span>
          </div>
        </div>

        {/* Card 2 — 내 풀이 */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
            내 풀이
          </span>
          <div className="bg-[#F3F4F6] rounded-lg flex items-center justify-center" style={{ height: 280 }}>
            <span className="text-[16px] text-[#6B7280] leading-[24px]">[학생 풀이 이미지]</span>
          </div>
        </div>

        {/* Card 3 — AI 채점 피드백 */}
        <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] px-4 pt-4 pb-4 flex flex-col gap-3">
          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
            AI 채점 피드백
          </span>

          <div className="flex flex-col gap-3">
            {problem.feedback.map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={cn("text-[14px] font-bold leading-[21px] flex-shrink-0", line.ok ? "text-[#10B981]" : "text-[#EF4444]")}>
                  {line.ok ? "✓" : "✗"}
                </span>
                <p className={cn("text-[14px] leading-[21px] tracking-tight text-[#6B7280]", line.strikethrough && "line-through")}>
                  {line.text}
                </p>
              </div>
            ))}

            <div className="bg-[#F0FDF4] rounded-lg px-3 py-3">
              <p className="text-[14px] font-bold text-[#047857] leading-[21px] tracking-tight">
                정답: {problem.answer}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 — 재채점 요청 */}
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

          <button className="w-full border border-[#10B981] rounded-lg py-3 active:opacity-70">
            <span className="text-[15px] font-semibold text-[#10B981] leading-[22.5px] tracking-tight">
              재채점 요청하기
            </span>
          </button>
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
