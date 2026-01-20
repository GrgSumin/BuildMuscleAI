"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import type { Message } from "openai/resources/beta/threads/index";

export default function Page() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your AI fitness coach
        </p>
      </header>
      {loading && (
        <div className="text-6xl text-center text-black">loading ...</div>
      )}

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* No messages state */}
        {message.length == 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 text-4xl">🏋️‍♂️</div>
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              No messages yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Ask GymBroAI about workouts, recovery, motivation, or consistency.
            </p>
          </div>
        )}

        {/* Later: map messages here */}
        {/*
        <div className="space-y-4">
          <MessageBubble />
        </div>
        */}
      </main>

      {/* Input box */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask GymBroAI something..."
            className="flex-1 rounded-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:ring-zinc-100"
          />
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200">
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
