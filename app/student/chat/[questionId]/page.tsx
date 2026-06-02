"use client";

import { use, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send, BarChart2, Upload, BookOpen, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getChatHistory, sendChatMessage } from "@/lib/api/chat";
import { getSubmissionResults } from "@/lib/api/submissions";
import type { ChatMessageResponse } from "@/lib/api/chat";

const tabs = [
  { label: "결과",    icon: BarChart2, href: "/student/results",     active: false },
  { label: "업로드",  icon: Upload,    href: "/student/upload",      active: false },
  { label: "오답노트", icon: BookOpen,  href: "/student/wrong-notes", active: false },
  { label: "내 반",   icon: Users,     href: "/student/my-class",    active: false },
  { label: "AI튜터",  icon: Bot,       href: "/student/chat",        active: true },
];

function ChatContent({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId: qidStr } = use(params);
  const questionId = Number(qidStr);
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [questionLabel, setQuestionLabel] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!questionId) return;
    getChatHistory(questionId)
      .then(setMessages)
      .catch(console.error);
  }, [questionId]);

  useEffect(() => {
    if (!submissionId) return;
    getSubmissionResults(Number(submissionId))
      .then((result) => {
        setAssignmentTitle(result.assignmentTitle);
        const idx = result.questions.findIndex((q) => q.questionId === questionId);
        if (idx !== -1) setQuestionLabel(`${idx + 1}번 문제`);
      })
      .catch(console.error);
  }, [submissionId, questionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    const optimistic: ChatMessageResponse = {
      chatId: Date.now(),
      role: "user",
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const reply = await sendChatMessage(questionId, text);
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          chatId: Date.now(),
          role: "assistant",
          message: "죄송합니다. 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const from = searchParams.get("from");
  const backHref = from === "chat-select"
    ? `/student/chat${submissionId ? `?submissionId=${submissionId}` : ""}`
    : submissionId
    ? `/student/results/${questionId}?submissionId=${submissionId}`
    : "/student/chat";

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

      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-[#F3F4F6]">
        <Link href={backHref} aria-label="뒤로가기" className="active:opacity-70">
          <ChevronLeft className="w-6 h-6 text-[#111827]" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-[#111827] leading-[22.5px]">AI 튜터</span>
          {(assignmentTitle || questionLabel) && (
            <span className="text-[11px] text-[#6B7280] leading-[16.5px]">
              {[assignmentTitle, questionLabel].filter(Boolean).join(" / ")}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* 초기 안내 메시지 */}
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0 self-end">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="max-w-[75%] bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
            <p className="text-[14px] text-[#111827] leading-[21px]">
              안녕하세요! 수학 문제에 대해 궁금한 점이 있으면 언제든지 물어보세요. 😊
            </p>
          </div>
        </div>

        {messages.map((msg) => (
          msg.role === "user" ? (
            <div key={msg.chatId} className="flex justify-end">
              <div className="max-w-[75%] bg-[#10B981] rounded-2xl rounded-br-sm px-4 py-3">
                <p className="text-[14px] text-white leading-[21px] whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ) : (
            <div key={msg.chatId} className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0 self-end">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[75%] bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
                <p className="text-[14px] text-[#111827] leading-[21px] whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          )
        ))}

        {sending && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white px-4 py-3 border-t border-[#F3F4F6]">
        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요..."
            className="flex-1 bg-transparent text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none leading-[21px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
              input.trim() && !sending ? "bg-[#10B981]" : "bg-[#D1D5DB]"
            )}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
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

export default function ChatPage({ params }: { params: Promise<{ questionId: string }> }) {
  return (
    <Suspense>
      <ChatContent params={params} />
    </Suspense>
  );
}
