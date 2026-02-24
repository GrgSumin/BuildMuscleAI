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
            ? "bg-emerald-300 text-emerald-950"
            : "border border-emerald-200/25 bg-black/30 text-emerald-50"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </article>
    </div>
  );
}
