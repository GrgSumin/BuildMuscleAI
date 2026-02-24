"use client";

import type { ChatMessage, ChatPreview } from "@/app/types/chat";
import { useChatStore } from "@/app/chatStore";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageList } from "@/components/chat/MessageList";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

function parseSseChunk(chunk: string) {
  return chunk
    .split("\n\n")
    .map((eventBlock) => {
      const lines = eventBlock.split("\n");
      const event = lines.find((line) => line.startsWith("event:"))?.replace("event:", "").trim();
      const dataText = lines.find((line) => line.startsWith("data:"))?.replace("data:", "").trim();

      if (!event || !dataText) {
        return null;
      }

      try {
        return { event, data: JSON.parse(dataText) as unknown };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<{ event: string; data: unknown }>;
}

export default function ChatPage() {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    chats,
    messages,
    activeChatId,
    isLoadingChats,
    isLoadingMessages,
    isStreaming,
    streamDraft,
    error,
    setChats,
    addChat,
    setMessages,
    appendMessage,
    setActiveChatId,
    setIsLoadingChats,
    setIsLoadingMessages,
    setIsStreaming,
    setStreamDraft,
    appendStreamDraft,
    setError,
  } = useChatStore();

  const sortedChats = useMemo(
    () =>
      [...chats].sort((a, b) => {
        const aTime = a.lastMessageAt ?? a.updatedAt;
        const bTime = b.lastMessageAt ?? b.updatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }),
    [chats]
  );

  const loadMessages = useCallback(
    async (chatId: string) => {
      setIsLoadingMessages(true);
      setError(null);

      try {
        const response = await fetch(`/api/chats/${chatId}/messages`, {
          method: "GET",
          cache: "no-store",
        });
        const data = (await response.json()) as ApiResponse<{ messages: ChatMessage[] }>;

        if (!response.ok || !data.success) {
          throw new Error(data.success ? "Unable to load messages." : data.error.message);
        }

        setMessages(data.data.messages);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Unable to load messages.";
        setError(message);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [setError, setIsLoadingMessages, setMessages]
  );

  const createChat = useCallback(async () => {
    setError(null);

    const response = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = (await response.json()) as ApiResponse<{ chat: ChatPreview }>;

    if (!response.ok || !data.success) {
      throw new Error(data.success ? "Unable to create chat." : data.error.message);
    }

    addChat(data.data.chat);
    setActiveChatId(data.data.chat.id);
    setMessages([]);
    router.replace(`/chat?chat=${data.data.chat.id}`);
    return data.data.chat;
  }, [addChat, router, setActiveChatId, setError, setMessages]);

  const hydrateChats = useCallback(async () => {
    setIsLoadingChats(true);
    setError(null);

    try {
      const response = await fetch("/api/chats", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as ApiResponse<{ chats: ChatPreview[] }>;

      if (!response.ok || !data.success) {
        throw new Error(data.success ? "Unable to load chats." : data.error.message);
      }

      const fetchedChats = data.data.chats;
      setChats(fetchedChats);

      const requestedChatId =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("chat")
          : null;

      const nextChatId = requestedChatId
        ? fetchedChats.find((chat) => chat.id === requestedChatId)?.id ?? null
        : fetchedChats[0]?.id ?? null;

      if (nextChatId) {
        setActiveChatId(nextChatId);
        router.replace(`/chat?chat=${nextChatId}`);
        await loadMessages(nextChatId);
      } else {
        const createdChat = await createChat();
        await loadMessages(createdChat.id);
      }
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Unable to load chats.";
      setError(message);
    } finally {
      setIsLoadingChats(false);
    }
  }, [createChat, loadMessages, router, setActiveChatId, setChats, setError, setIsLoadingChats]);

  useEffect(() => {
    hydrateChats();
  }, [hydrateChats]);

  const handleSelectChat = useCallback(
    async (chatId: string) => {
      setActiveChatId(chatId);
      router.replace(`/chat?chat=${chatId}`);
      setStreamDraft("");
      await loadMessages(chatId);
    },
    [loadMessages, router, setActiveChatId, setStreamDraft]
  );

  const handleCreateChat = useCallback(async () => {
    try {
      await createChat();
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : "Unable to create chat.";
      setError(message);
    }
  }, [createChat, setError]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  }, [setIsStreaming]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeChatId || isStreaming) {
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);
      setError(null);
      setStreamDraft("");

      try {
        const response = await fetch(`/api/chats/${activeChatId}/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const fallback = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
          throw new Error(
            fallback && !fallback.success ? fallback.error.message : "Unable to send message."
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const events = parseSseChunk(part + "\n\n");

            for (const event of events) {
              const eventData = event.data as Record<string, unknown>;

              if (event.event === "ack") {
                appendMessage(eventData.userMessage as ChatMessage);
              }

              if (event.event === "delta") {
                appendStreamDraft(String(eventData.delta ?? ""));
              }

              if (event.event === "done") {
                const finalContent = String(eventData.content ?? "");

                if (finalContent.trim()) {
                  appendMessage({
                    id: crypto.randomUUID(),
                    chatId: activeChatId,
                    role: "assistant",
                    content: finalContent,
                    createdAt: new Date().toISOString(),
                  });
                }
                setStreamDraft("");
              }

              if (event.event === "error") {
                const message = String(eventData.message ?? "The response was interrupted.");
                setError(message);
              }
            }
          }
        }

        await loadMessages(activeChatId);
      } catch (sendError) {
        if (controller.signal.aborted) {
          setError("Response stopped.");
        } else {
          const message = sendError instanceof Error ? sendError.message : "Unable to send message.";
          setError(message);
        }
      } finally {
        abortControllerRef.current = null;
        setIsStreaming(false);
        setStreamDraft("");
      }
    },
    [
      activeChatId,
      appendMessage,
      appendStreamDraft,
      isStreaming,
      loadMessages,
      setError,
      setIsStreaming,
      setStreamDraft,
    ]
  );

  return (
    <div className="relative h-[calc(100dvh-56px)] overflow-hidden p-3 sm:p-5">
      <div className="pointer-events-none absolute inset-0 gym-grid opacity-35" />
      <div className="relative mx-auto grid h-full max-w-7xl gap-3 lg:grid-cols-[300px_1fr]">
        <ChatSidebar
          chats={sortedChats}
          activeChatId={activeChatId}
          loading={isLoadingChats}
          onCreateChat={handleCreateChat}
          onSelectChat={handleSelectChat}
        />

        <section className="glass-panel flex min-h-0 flex-col rounded-4xl p-3">
          <div className="mb-3 rounded-2xl border border-emerald-200/20 bg-emerald-200/8 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">Your AI Performance Coach</p>
            <div aria-live="polite">{error ? <p className="mt-1 text-sm text-rose-300">{error}</p> : null}</div>
          </div>

          <main className="min-h-0 flex-1 overflow-y-auto">
            <MessageList
              messages={messages}
              streamDraft={streamDraft}
              loading={isLoadingMessages}
              isStreaming={isStreaming}
            />
          </main>

          <div className="pt-3">
            <ChatComposer
              disabled={!activeChatId || isLoadingChats}
              isStreaming={isStreaming}
              onSend={handleSend}
              onStop={stopStreaming}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
