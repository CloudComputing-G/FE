"use client"

import { useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Loader2, ChevronRight, X, Plus, Minus } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { createAssignment, publishAssignment, getProblemUploadUrl } from "@/lib/api/assignments"
import { getClassroom } from "@/lib/api/classrooms"
import { cn } from "@/lib/utils"

function UploadZone({
  label,
  hint,
  file,
  onChange,
}: {
  label: string
  hint?: string
  file: File | null
  onChange: (f: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{label}</h3>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onChange(f) }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors",
          file ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
        )}
      >
        <Upload className={cn("h-7 w-7", file ? "text-green-500" : "text-gray-400")} />
        {file ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-700">{file.name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null) }}
              className="rounded-full p-0.5 text-green-500 hover:bg-green-200">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">파일을 선택하거나 드래그하세요</p>
        )}
      </div>
      {hint && (
        <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
          💡 {hint}
        </div>
      )}
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  )
}

export default function NewAssignmentPage() {
  const router = useRouter()
  const params = useParams()
  const classId = Number(params.classId)

  const { data: classroomData } = useQuery({
    queryKey: ["classroom", classId],
    queryFn: () => getClassroom(classId),
    enabled: !!classId,
  })

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [problemFile, setProblemFile] = useState<File | null>(null)
  const [answerFile, setAnswerFile] = useState<File | null>(null)
  const [questionCount, setQuestionCount] = useState(5)
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""))
  const [scores, setScores] = useState<number[]>(Array(5).fill(10))
  const [pendingAction, setPendingAction] = useState<"draft" | "publish" | null>(null)
  const [error, setError] = useState("")

  function handleCountChange(count: number) {
    const n = Math.max(1, Math.min(30, count))
    setQuestionCount(n)
    setAnswers((prev) => {
      const next = [...prev]
      while (next.length < n) next.push("")
      return next.slice(0, n)
    })
    setScores((prev) => {
      const next = [...prev]
      while (next.length < n) next.push(10)
      return next.slice(0, n)
    })
  }

  const uploadFile = async (file: File, type: "problem" | "answer") => {
    const ext = file.name.split(".").pop() ?? "pdf"
    const res = await getProblemUploadUrl(type, ext)
    await fetch(res.data.presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    })
    return res.data.s3Key
  }

  const mutation = useMutation({
    mutationFn: async (shouldPublish: boolean) => {
      let problemS3Key: string | undefined
      let answerS3Key: string | undefined

      if (problemFile) problemS3Key = await uploadFile(problemFile, "problem")
      if (answerFile) answerS3Key = await uploadFile(answerFile, "answer")

      const created = await createAssignment({
        title,
        subject: subject || undefined,
        classId,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        problemS3Key,
        answerS3Key,
        questions: answers.map((answer, i) => ({
          orderNum: i + 1,
          content: `${i + 1}번 문항`,
          answer,
          maxScore: scores[i],
        })),
      })

      if (shouldPublish && created.data?.assignmentId) {
        await publishAssignment(created.data.assignmentId)
      }

      return created
    },
    onSuccess: () => router.push(`/teacher/classes/${classId}`),
    onError: () => {
      setError("과제 저장에 실패했습니다. 다시 시도해 주세요.")
      setPendingAction(null)
    },
  })

  const handleSubmit = (shouldPublish: boolean) => {
    setError("")
    if (!title.trim()) { setError("과제명을 입력해 주세요."); return }
    if (answers.some((a) => !a.trim())) { setError("모든 문항의 정답을 입력해 주세요."); return }
    setPendingAction(shouldPublish ? "publish" : "draft")
    mutation.mutate(shouldPublish)
  }

  const isPending = mutation.isPending

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/teacher" className="text-gray-500 hover:text-gray-700">반 관리</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/teacher/classes/${classId}`} className="text-gray-500 hover:text-gray-700">
              {classroomData?.data?.name ?? `반 ${classId}`}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">새 과제 만들기</span>
          </nav>
        </header>

        <main className="mx-auto max-w-2xl px-8 py-8">
          <div className="mb-6 flex items-center gap-3">
            <button onClick={() => router.back()}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">새 과제 만들기</h1>
          </div>

          <div className="flex flex-col gap-5">
            {/* 기본 정보 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">기본 정보</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    과제명 <span className="text-red-400">*</span>
                  </label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 2차 수학 단원평가"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">과목</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)}
                    placeholder="예: 수학"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">마감일</label>
                  <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors" />
                </div>
              </div>
            </div>

            {/* 문제지 업로드 */}
            <UploadZone label="문제지 업로드" file={problemFile} onChange={setProblemFile} />

            {/* 답지 업로드 */}
            <UploadZone label="답지 업로드"
              hint="답지 업로드 시 AI가 자동으로 채점 기준을 분석합니다"
              file={answerFile} onChange={setAnswerFile} />

            {/* 정답 입력 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  정답 입력 <span className="text-red-400">*</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">문항 수</span>
                  <button type="button" onClick={() => handleCountChange(questionCount - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="number" value={questionCount} min={1} max={30}
                    onChange={(e) => handleCountChange(Number(e.target.value))}
                    className="h-7 w-12 rounded-lg border border-gray-200 text-center text-sm outline-none focus:border-green-500" />
                  <button type="button" onClick={() => handleCountChange(questionCount + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {answers.map((answer, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-center text-xs text-gray-400">{i + 1}번</span>
                    <input
                      value={answer}
                      onChange={(e) => {
                        const next = [...answers]
                        next[i] = e.target.value
                        setAnswers(next)
                      }}
                      placeholder="정답"
                      className="h-9 w-full rounded-lg border border-gray-200 px-2 text-center text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                    />
                    <input
                      type="number" value={scores[i]} min={1}
                      onChange={(e) => {
                        const next = [...scores]
                        next[i] = Number(e.target.value)
                        setScores(next)
                      }}
                      className="h-7 w-full rounded-lg border border-gray-200 px-2 text-center text-xs text-gray-500 outline-none focus:border-green-500"
                    />
                    <span className="text-center text-xs text-gray-300">배점</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => router.back()} disabled={isPending}
              className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
              취소
            </button>
            <button type="button" disabled={isPending} onClick={() => handleSubmit(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 py-3 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors">
              {isPending && pendingAction === "draft" && <Loader2 className="h-4 w-4 animate-spin" />}
              임시저장
            </button>
            <button type="button" disabled={isPending} onClick={() => handleSubmit(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-3 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 transition-colors">
              {isPending && pendingAction === "publish" && <Loader2 className="h-4 w-4 animate-spin" />}
              게시하기
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
