"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, FileText, Plus, MoreHorizontal, Loader2, Pencil, Trash2, X } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/teacher/Sidebar"
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from "@/lib/api/classrooms"
import { getAssignments } from "@/lib/api/assignments"
import type { ClassroomResponse } from "@/lib/api/types"

function CreateClassroomDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => createClassroom({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">반 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">반 이름</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && mutation.mutate()}
            placeholder="예: 3학년 2반"
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
          {mutation.isError && (
            <p className="mt-1.5 text-xs text-red-500">반 생성에 실패했습니다.</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!name.trim() || mutation.isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            추가
          </button>
        </div>
      </div>
    </div>
  )
}

function ClassroomCard({ cls }: { cls: ClassroomResponse }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(cls.name)
  const queryClient = useQueryClient()

  const { data: assignmentsData } = useQuery({
    queryKey: ["assignments", cls.classId],
    queryFn: () => getAssignments(cls.classId),
  })
  const assignmentCount = assignmentsData?.data?.length ?? 0

  const updateMutation = useMutation({
    mutationFn: () => updateClassroom(cls.classId, { name: editName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
      setEditOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteClassroom(cls.classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
    },
  })

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-md">
      {editOpen ? (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">반 이름 수정</p>
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mb-3 h-9 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setEditOpen(false)}
              className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-600"
            >
              취소
            </button>
            <button
              onClick={() => updateMutation.mutate()}
              disabled={!editName.trim() || updateMutation.isPending}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-500 py-1.5 text-xs font-medium text-white disabled:opacity-50"
            >
              {updateMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              저장
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="더 보기"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 z-10 w-28 rounded-lg border border-gray-200 bg-white shadow-md">
                  <button
                    onClick={() => { setEditOpen(true); setMenuOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    이름 수정
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("이 반을 삭제하시겠습니까?")) deleteMutation.mutate()
                      setMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    반 삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          <Link href={`/teacher/classes/${cls.classId}`}>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 hover:text-green-600">
              {cls.name}
            </h2>
          </Link>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              학생 {cls.studentCount ?? 0}명
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              과제 {assignmentCount}개
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default function TeacherPage() {
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  })

  const classrooms = data?.data ?? []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {showCreate && <CreateClassroomDialog onClose={() => setShowCreate(false)} />}

      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h1 className="text-xl font-bold text-gray-900">반 관리</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            반 추가
          </button>
        </header>

        <main className="p-8">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
              반 목록을 불러오지 못했습니다. 다시 시도해 주세요.
            </div>
          )}

          {!isLoading && !isError && classrooms.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">아직 등록된 반이 없습니다.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                첫 번째 반 추가하기
              </button>
            </div>
          )}

          {!isLoading && !isError && classrooms.length > 0 && (
            <div className="grid grid-cols-3 gap-6">
              {classrooms.map((cls) => (
                <ClassroomCard key={cls.classId} cls={cls} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
