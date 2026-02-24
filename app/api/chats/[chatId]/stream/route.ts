import { fail, requireUserId } from "@/lib/api";
import { createLlamaGenerateStream, type LlamaGenerateChunk } from "@/lib/llama";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ chatId: string }>;
};

type StreamRequest = {
  message: string;
};

type PersistedMessage = {
  role: "user" | "assistant";
  content: string;
};

const encoder = new TextEncoder();

function sse(event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

const COACH_INSTRUCTIONS = [
  "You are GymBroAI, a supportive and disciplined fitness coach.",
  "Keep answers concise and practical.",
  "Prioritize safety, recovery, and long-term consistency.",
  "Never provide dangerous advice or medical diagnoses.",
].join(" ");

function toConversationPrompt(messages: PersistedMessage[]) {
  const transcript = messages
    .map((message) => `${message.role === "assistant" ? "Coach" : "User"}: ${message.content}`)
    .join("\n");

  return `Conversation so far:\n${transcript}\nCoach:`;
}

export async function POST(req: Request, { params }: Params) {
  const userId = await requireUserId();

  if (!userId) {
    return fail({ code: "UNAUTHORIZED", message: "Sign in required." }, 401);
  }

  const { chatId } = await params;

  let payload: StreamRequest;

  try {
    payload = (await req.json()) as StreamRequest;
  } catch {
    return fail({ code: "BAD_REQUEST", message: "Invalid request body." }, 400);
  }

  const message = payload.message?.trim();

  if (!message) {
    return fail({ code: "BAD_REQUEST", message: "Message is required." }, 400);
  }

  if (message.length > 4000) {
    return fail({ code: "BAD_REQUEST", message: "Message is too long." }, 400);
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!chat) {
    return fail({ code: "NOT_FOUND", message: "Chat not found." }, 404);
  }

  const userMessage = await prisma.chatMessage.create({
    data: {
      chatId,
      role: "user",
      content: message,
    },
  });

  if (chat.title === "New Plan") {
    await prisma.chat.update({
      where: { id: chatId },
      data: { title: message.slice(0, 60) },
    });
  }

  await prisma.chat.update({
    where: { id: chatId },
    data: { lastMessageAt: new Date() },
  });

  const history = await prisma.chatMessage.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    take: 24,
    select: {
      role: true,
      content: true,
    },
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(
        sse("ack", {
          userMessage: {
            id: userMessage.id,
            role: userMessage.role,
            content: userMessage.content,
            createdAt: userMessage.createdAt.toISOString(),
          },
        })
      );

      let assistantContent = "";
      let finished = false;

      try {
        const body = await createLlamaGenerateStream(
          toConversationPrompt(history as PersistedMessage[]),
          COACH_INSTRUCTIONS,
          req.signal
        );
        const reader = body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const handleChunk = async (chunk: LlamaGenerateChunk) => {
          const delta = chunk.response ?? "";

          if (delta) {
            assistantContent += delta;
            controller.enqueue(sse("delta", { delta }));
          }

          if (chunk.done && !finished) {
            finished = true;
            const completedAt = new Date();

            if (assistantContent.trim()) {
              await prisma.chatMessage.create({
                data: {
                  chatId,
                  role: "assistant",
                  content: assistantContent,
                },
              });

              await prisma.chat.update({
                where: { id: chatId },
                data: { lastMessageAt: completedAt },
              });
            }

            controller.enqueue(
              sse("done", {
                content: assistantContent,
              })
            );
          }
        };

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          if (req.signal.aborted) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed) {
              continue;
            }

            const chunk = JSON.parse(trimmed) as LlamaGenerateChunk;
            await handleChunk(chunk);
          }
        }

        if (buffer.trim()) {
          const chunk = JSON.parse(buffer.trim()) as LlamaGenerateChunk;
          await handleChunk(chunk);
        }

        if (!finished && assistantContent.trim()) {
          await prisma.chatMessage.create({
            data: {
              chatId,
              role: "assistant",
              content: assistantContent,
            },
          });

          await prisma.chat.update({
            where: { id: chatId },
            data: { lastMessageAt: new Date() },
          });

          controller.enqueue(
            sse("done", {
              content: assistantContent,
            })
          );
        }

        controller.close();
      } catch (error) {
        console.error("Streaming failed", error);

        if (assistantContent.trim()) {
          try {
            await prisma.chatMessage.create({
              data: {
                chatId,
                role: "assistant",
                content: assistantContent,
              },
            });

            await prisma.chat.update({
              where: { id: chatId },
              data: { lastMessageAt: new Date() },
            });
          } catch (persistError) {
            console.error("Failed to persist partial assistant message", persistError);
          }
        }

        controller.enqueue(
          sse("error", {
            message: "The response was interrupted. Please retry.",
          })
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
