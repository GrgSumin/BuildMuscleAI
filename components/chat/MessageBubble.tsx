import type { ChatMessage } from "@/app/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? "bg-gradient-to-br from-orange-300 to-amber-300 text-zinc-950 shadow-[0_10px_24px_rgba(251,146,60,0.22)]"
            : "bg-zinc-950 text-slate-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </article>
    </div>
  );
}
