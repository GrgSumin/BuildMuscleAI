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
    <aside className="glass-panel flex h-full w-full max-w-80 flex-col rounded-4xl p-3">
      <Button
        type="button"
        onClick={onCreateChat}
        className="mb-3 h-11 justify-start gap-2 rounded-2xl bg-emerald-300 px-4 text-emerald-950 hover:bg-emerald-200 focus-visible:ring-emerald-300"
      >
        <Plus aria-hidden="true" size={16} />
        New Chat
      </Button>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <p className="px-3 py-6 text-sm text-emerald-100/70">Loading chats...</p>
        ) : chats.length === 0 ? (
          <p className="px-3 py-6 text-sm text-emerald-100/70">Start your first conversation.</p>
        ) : (
          chats.map((chat) => {
            const isActive = activeChatId === chat.id;

            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className={`w-full rounded-2xl border px-3 py-2 text-left transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none ${
                  isActive
                    ? "border-emerald-200/45 bg-emerald-200/20 text-emerald-50"
                    : "border-emerald-200/10 bg-black/25 text-emerald-100 hover:border-emerald-200/30 hover:bg-emerald-200/10"
                }`}
              >
                <p className="truncate text-sm font-semibold">{chat.title}</p>
                <p
                  className={`truncate text-xs ${
                    isActive ? "text-emerald-100/80" : "text-emerald-100/60"
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
