import { fail, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ chatId: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const userId = await requireUserId();

  if (!userId) {
    return fail({ code: "UNAUTHORIZED", message: "Sign in required." }, 401);
  }

  const { chatId } = await params;

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      select: { id: true },
    });

    if (!chat) {
      return fail({ code: "NOT_FOUND", message: "Chat not found." }, 404);
    }

    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return ok({
      messages: messages.map((message) => ({
        id: message.id,
        chatId: message.chatId,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to load messages", error);
    return fail({ code: "INTERNAL_ERROR", message: "Unable to load messages." }, 500);
  }
}
