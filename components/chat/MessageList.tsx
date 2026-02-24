"use client";

import type { ChatMessage } from "@/app/types/chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useEffect, useRef } from "react";

type MessageListProps = {
  messages: ChatMessage[];
  streamDraft: string;
  loading: boolean;
  isStreaming: boolean;
};

export function MessageList({ messages, streamDraft, loading, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, streamDraft]);

  if (loading) {
    return <p className="p-4 text-sm text-emerald-100/70">Loading messages...</p>;
  }

  if (!messages.length && !streamDraft) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <div>
          <p className="text-4xl">🏋️</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase text-emerald-100">Build Momentum</h1>
          <p className="mt-2 text-sm text-emerald-100/70">Ask for a plan, form cues, or recovery strategy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2 py-2 sm:px-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {streamDraft ? (
        <MessageBubble
          message={{
            id: "draft",
            chatId: "draft",
            role: "assistant",
            content: streamDraft,
            createdAt: new Date().toISOString(),
          }}
        />
      ) : null}

      {isStreaming ? <p className="px-2 text-xs text-emerald-100/70">Coach is typing...</p> : null}
      <div ref={bottomRef} />
    </div>
  );
}
