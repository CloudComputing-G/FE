"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Camera, BarChart2, Upload, BookOpen, Users, Bot, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyClassrooms } from "@/lib/api/classrooms";
import { getAssignments, getUploadUrl, uploadToS3, confirmUpload } from "@/lib/api/assignments";
import type { AssignmentResponse } from "@/lib/api/types";

const tabs = [
  { label: "결과", icon: BarChart2, href: "/student/results", active: false },
  { label: "업로드", icon: Upload, href: "/student/upload", active: true },
  { label: "오답노트", icon: BookOpen, href: "#", active: false },
  { label: "내 반", icon: Users, href: "/student/my-class", active: false },
  { label: "AI튜터", icon: Bot, href: "#", active: false },
];

function StudentUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("assignmentId");

  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const classrooms = await getMyClassrooms();
        if (classrooms.length === 0) return;
        const list = await getAssignments(classrooms[0].classId);
        const submittable = (list.data ?? []).filter((a) => a.status === "PUBLISHED");
        setAssignments(submittable);
        const initial = preselectedId
          ? Number(preselectedId)
          : submittable[0]?.assignmentId ?? null;
        setSelectedId(initial);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [preselectedId]);

  const selected = assignments.find((a) => a.assignmentId === selectedId);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file || !selectedId) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const { submissionId, presignedUrl } = await getUploadUrl(selectedId, ext);
      await uploadToS3(presignedUrl, file);
      await confirmUpload(selectedId, submissionId);
      localStorage.setItem(`submission_${selectedId}`, String(submissionId));
      router.push(`/student/upload/grading?submissionId=${submissionId}`);
    } catch (e) {
      console.error(e);
      setError("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md h-dvh bg-[#F9FAFB] mx-auto">
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
          <div className="flex items-center">
            <Link href="/student/my-class" aria-label="뒤로가기" className="active:opacity-70">
              <ChevronLeft className="w-6 h-6 text-[#111827]" />
            </Link>
            <h1 className="flex-1 text-[20px] font-bold text-[#111827] leading-[30px] tracking-tight text-center pr-6">
              풀이 업로드
            </h1>
          </div>

          {/* Assignment Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full bg-white rounded-xl px-4 py-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] flex items-center justify-between active:opacity-70"
              disabled={assignments.length === 0}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 border-[1.4px] border-[#10B981] rounded" />
                </div>
                <div className="flex flex-col gap-[2px] text-left">
                  <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px] tracking-tight">
                    {selected?.title ?? "과제를 불러오는 중..."}
                  </span>
                  <span className="text-[12px] text-[#9CA3AF] leading-[18px]">
                    {selected?.dueDate ? `마감: ${selected.dueDate.slice(0, 10)}` : ""}
                  </span>
                </div>
              </div>
              {dropdownOpen
                ? <ChevronUp className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
              }
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] z-10 overflow-hidden">
                {assignments.map((opt) => (
                  <button
                    key={opt.assignmentId}
                    onClick={() => { setSelectedId(opt.assignmentId); setDropdownOpen(false); }}
                    className={cn(
                      "w-full px-4 py-3 flex flex-col gap-[2px] text-left active:opacity-70",
                      opt.assignmentId === selectedId ? "bg-[#F0FDF4]" : "bg-white"
                    )}
                  >
                    <span className={cn(
                      "text-[14px] font-semibold leading-[21px] tracking-tight",
                      opt.assignmentId === selectedId ? "text-[#10B981]" : "text-[#111827]"
                    )}>
                      {opt.title}
                    </span>
                    <span className="text-[12px] text-[#9CA3AF] leading-[18px]">
                      {opt.dueDate ? `마감: ${opt.dueDate.slice(0, 10)}` : "마감일 없음"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload Drop Zone */}
          <label
            className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D1D5DB] bg-white cursor-pointer active:opacity-70 overflow-hidden"
            style={{ minHeight: 311 }}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="풀이 미리보기"
                className="w-full h-full object-contain"
                style={{ minHeight: 311 }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-[65px] px-4">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8 text-[#6B7280]" />
                </div>
                <p className="text-[16px] font-semibold text-[#111827] leading-[24px] tracking-tight mb-3">
                  풀이 사진 추가
                </p>
                <p className="text-[13px] font-medium text-[#6B7280] leading-[19.5px] text-center px-4 mb-2">
                  탭하여 사진을 선택하거나 찍으세요 또는 파일
                </p>
                <p className="text-[12px] font-medium text-[#D1D5DB] leading-[18px] text-center">
                  JPG, PNG, HEIC 지원
                </p>
              </div>
            )}
          </label>

          {/* Tip Box */}
          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-4">
            <div className="flex items-start gap-2 mb-3">
              <Lightbulb className="w-[18px] h-[18px] text-[#F59E0B] flex-shrink-0 mt-[1px]" />
              <span className="text-[13px] font-semibold text-[#92400E] leading-[19.5px] tracking-tight">
                촬영 팁
              </span>
            </div>
            <div className="flex flex-col gap-1 pl-6">
              <p className="text-[12px] text-[#92400E] leading-[18px]">풀이 전체가 보이도록 찍어주세요</p>
              <p className="text-[12px] text-[#92400E] leading-[18px]">밝은 곳에서 그림자 없이 촬영해주세요</p>
              <p className="text-[12px] text-[#92400E] leading-[18px]">글씨가 선명하게 나오도록 초점을 맞춰주세요</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[13px] text-[#EF4444] text-center">{error}</p>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || !selectedId || uploading}
            className={cn(
              "w-full rounded-xl py-4 flex items-center justify-center active:opacity-80",
              !file || !selectedId || uploading
                ? "bg-[#D1D5DB]"
                : "bg-[#10B981]"
            )}
          >
            <span className="text-[16px] font-bold text-white leading-[24px] tracking-tight">
              {uploading ? "업로드 중..." : "업로드"}
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

export default function StudentUploadPage() {
  return (
    <Suspense>
      <StudentUploadContent />
    </Suspense>
  );
}
