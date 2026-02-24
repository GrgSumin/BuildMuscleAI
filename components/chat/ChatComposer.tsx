"use client";

import { Button } from "@/components/ui/button";
import { Send, Square } from "lucide-react";
import { FormEvent, KeyboardEvent, useState } from "react";

type ChatComposerProps = {
  disabled: boolean;
  isStreaming: boolean;
  onSend: (text: string) => Promise<void>;
  onStop: () => void;
};

export function ChatComposer({ disabled, isStreaming, onSend, onStop }: ChatComposerProps) {
  const [value, setValue] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = value.trim();

    if (!text || disabled) {
      return;
    }

    setValue("");
    await onSend(text);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const isComposing = event.nativeEvent.isComposing;

    if (isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-emerald-300/20 bg-black/35 p-2 shadow-lg">
      <label htmlFor="chat-input" className="sr-only">
        Message GymBroAI
      </label>
      <div className="flex items-end gap-2">
        <textarea
          id="chat-input"
          name="chatInput"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask for your next session plan…"
          autoComplete="off"
          className="max-h-40 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-emerald-50 placeholder:text-emerald-100/55 focus-visible:outline-none"
        />

        {isStreaming ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onStop}
            aria-label="Stop response"
            className="h-11 w-11 rounded-2xl border-emerald-200/30 bg-black/20 text-emerald-100 hover:bg-emerald-300/20"
          >
            <Square aria-hidden="true" size={16} />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={disabled || value.trim().length === 0}
            aria-label="Send message"
            className="h-11 w-11 rounded-2xl bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
            size="icon"
          >
            <Send aria-hidden="true" size={16} />
          </Button>
        )}
      </div>
    </form>
  );
}
