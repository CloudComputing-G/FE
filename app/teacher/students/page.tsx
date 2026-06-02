"use client"

import { useState } from "react"
import { Users, Plus, X, Loader2, Check } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { getClassrooms, addStudentsToClassroom } from "@/lib/api/classrooms"
import { cn } from "@/lib/utils"

export default function StudentsPage() {
  const queryClient = useQueryClient()
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [successCount, setSuccessCount] = useState<number | null>(null)
  const [error, setError] = useState("")

  const { data: classroomsData, isLoading } = useQuery({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  })

  const classrooms = classroomsData?.data ?? []

  const mutation = useMutation({
    mutationFn: () => addStudentsToClassroom(selectedClassId!, emails),
    onSuccess: (res) => {
      setSuccessCount(res.data?.length ?? emails.length)
      setEmails([])
      setEmailInput("")
      setError("")
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
    },
    onError: () => {
      setError("학생 추가에 실패했습니다. 이메일을 다시 확인해 주세요.")
    },
  })

  function addEmail() {
    const trimmed = emailInput.trim()
    if (!trimmed) return
    if (emails.includes(trimmed)) {
      setEmailInput("")
      return
    }
    setEmails((prev) => [...prev, trimmed])
    setEmailInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail()
    }
  }

  function removeEmail(email: string) {
    setEmails((prev) => prev.filter((e) => e !== email))
  }

  function handleSubmit() {
    setError("")
    setSuccessCount(null)
    if (!selectedClassId) {
      setError("반을 선택해 주세요.")
      return
    }
    if (emails.length === 0) {
      setError("추가할 학생 이메일을 입력해 주세요.")
      return
    }
    mutation.mutate()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-8">
          <h1 className="text-xl font-bold text-gray-900">학생 관리</h1>
        </header>

        <main className="p-8">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-gray-900">반에 학생 추가</h2>

              {/* 반 선택 */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  반 선택 <span className="text-red-400">*</span>
                </label>
                {isLoading ? (
                  <div className="flex h-10 items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {classrooms.map((cls) => (
                      <button
                        key={cls.classId}
                        onClick={() => {
                          setSelectedClassId(cls.classId)
                          setSuccessCount(null)
                        }}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          selectedClassId === cls.classId
                            ? "border-green-500 bg-green-50 font-medium text-green-700"
                            : "border-gray-200 text-gray-700 hover:border-green-300 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{cls.name}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">학생 {cls.studentCount ?? 0}명</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 이메일 입력 */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  학생 이메일 <span className="text-red-400">*</span>
                </label>
                <div className="min-h-[80px] rounded-lg border border-gray-300 p-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20">
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {emails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700"
                      >
                        {email}
                        <button
                          onClick={() => removeEmail(email)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addEmail}
                    placeholder="이메일 입력 후 Enter 또는 쉼표로 구분"
                    className="w-full text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  여러 이메일은 Enter 또는 쉼표(,)로 구분하세요
                </p>
              </div>

              {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

              {successCount !== null && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                  <Check className="h-4 w-4" />
                  {successCount}명의 학생이 성공적으로 추가되었습니다.
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                학생 추가
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
