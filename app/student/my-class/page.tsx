"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, BarChart2, Upload, BookOpen, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyClassrooms } from "@/lib/api/classrooms";
import { getAssignments } from "@/lib/api/assignments";
import type { ClassroomResponse, AssignmentResponse } from "@/lib/api/types";

const tabs = [
  { label: "결과", icon: BarChart2, href: "/student/results", active: false },
  { label: "업로드", icon: Upload, href: "/student/upload", active: false },
  { label: "오답노트", icon: BookOpen, href: "#", active: false },
  { label: "내 반", icon: Users, href: "/student/my-class", active: true },
  { label: "AI튜터", icon: Bot, href: "#", active: false },
];

function assignmentBadge(item: AssignmentResponse, mySubmissionId: string | null) {
  if (!mySubmissionId) return { label: "미제출", color: "bg-[#F3F4F6] text-[#6B7280]" };
  // 내가 제출한 submission이 있으면 채점완료 여부는 status polling 없이 낙관적으로 표시
  // 실제 채점 완료 판단은 결과 페이지에서 확인
  return { label: "제출 완료", color: "bg-[#DBEAFE] text-[#3B82F6]" };
}

function deadlineLabel(dueDate: string | null) {
  if (!dueDate) return null;
  const diff = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return null;
  if (diff === 0) return { label: "D-Day", color: "bg-[#FEE2E2] text-[#EF4444]" };
  return { label: `D-${diff}`, color: diff <= 3 ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#F3F4F6] text-[#6B7280]" };
}

export default function StudentMyClassPage() {
  const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("학생");
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") ?? "학생";
    setStudentName(name);
    setCurrentUserName(name);

    (async () => {
      try {
        const classrooms = await getMyClassrooms();
        if (classrooms.length === 0) { setLoading(false); return; }
        const cls = classrooms[0];
        setClassroom(cls);
        const list = await getAssignments(cls.classId);
        setAssignments(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeCount = assignments.filter((a) => a.status === "PUBLISHED").length;

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
          <p className="text-[18px] font-semibold text-white leading-[27px] tracking-tight" suppressHydrationWarning>
            안녕하세요, {studentName} 님 👋
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
              {loading ? "불러오는 중..." : classroom?.name ?? "반 정보 없음"}
            </p>
            <p className="text-[13px] font-normal text-[#6B7280] leading-[19.5px]">
              {loading ? "" : `진행중 과제 ${activeCount}개`}
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
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl px-4 py-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] bg-[#F9FAFB] h-[72px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {assignments.map((item) => {
              const savedSubmissionId = localStorage.getItem(`submission_${currentUserName}_${item.assignmentId}`);
              const badge = assignmentBadge(item, savedSubmissionId);
              const deadline = deadlineLabel(item.dueDate);
              const isSubmitted = badge.label === "제출 완료";
              const href = isSubmitted && savedSubmissionId
                ? `/student/results?submissionId=${savedSubmissionId}`
                : !isSubmitted
                ? `/student/upload?assignmentId=${item.assignmentId}`
                : null;

              const card = (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                        {item.title}
                      </p>
                      {item.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-[14px] h-[14px] text-[#6B7280]" />
                          <span className="text-[13px] text-[#6B7280] leading-[19.5px]">
                            {item.dueDate.slice(0, 10)}
                          </span>
                        </div>
                      )}
                    </div>
                    {deadline && (
                      <span className={cn("text-[11px] font-medium leading-[16.5px] px-2 py-[2px] rounded-full", deadline.color)}>
                        {deadline.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[12px] font-medium leading-[18px] px-3 py-1 rounded-full", badge.color)}>
                      {badge.label}
                    </span>
                    {item.questions.length > 0 && (
                      <span className="text-[12px] text-[#6B7280] leading-[18px]">
                        {item.questions.length}개 문항
                      </span>
                    )}
                  </div>
                </div>
              );

              return href ? (
                <Link
                  key={item.assignmentId}
                  href={href}
                  className="rounded-xl px-4 pt-4 pb-4 flex flex-col gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] active:opacity-70"
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={item.assignmentId}
                  className="rounded-xl px-4 pt-4 pb-4 flex flex-col gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]"
                >
                  {card}
                </div>
              );
            })}
            {assignments.length === 0 && (
              <p className="text-[14px] text-[#6B7280] text-center py-8">과제가 없습니다.</p>
            )}
          </div>
        )}
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
