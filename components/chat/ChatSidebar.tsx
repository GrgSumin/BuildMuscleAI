"use client";

import type { ChatPreview } from "@/app/types/chat";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ChatSidebarProps = {
  chats: ChatPreview[];
  activeChatId: string | null;
  loading: boolean;
  onCreateChat: () => void;
  onSelectChat: (chatId: string) => void;
};

export function ChatSidebar({
  chats,
  activeChatId,
  loading,
  onCreateChat,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full max-w-80 flex-col rounded-4xl bg-zinc-900 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.38)]">
      <Button
        type="button"
        onClick={onCreateChat}
        className="mb-3 h-11 justify-start gap-2 rounded-2xl bg-orange-300 px-4 text-zinc-950 hover:bg-orange-200 focus-visible:ring-orange-200"
      >
        <Plus aria-hidden="true" size={16} />
        New Chat
      </Button>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <p className="px-3 py-6 text-sm text-slate-200/70">Loading chats…</p>
        ) : chats.length === 0 ? (
          <p className="px-3 py-6 text-sm text-slate-200/70">Start your first conversation.</p>
        ) : (
          chats.map((chat) => {
            const isActive = activeChatId === chat.id;

            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className={`w-full rounded-2xl px-3 py-2 text-left transition focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:outline-none ${
                  isActive
                    ? "bg-[#24170f] text-orange-50"
                    : "bg-zinc-950 text-slate-100 hover:bg-zinc-900"
                }`}
              >
                <p className="truncate text-sm font-semibold">{chat.title}</p>
                <p
                  className={`truncate text-xs ${
                    isActive ? "text-orange-100/85" : "text-slate-300/70"
                  }`}
                >
                  {chat.preview || "No messages yet"}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
