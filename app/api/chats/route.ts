import { fail, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type CreateChatRequest = {
  title?: string;
};

export async function GET() {
  const userId = await requireUserId();

  if (!userId) {
    return fail({ code: "UNAUTHORIZED", message: "Sign in required." }, 401);
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return ok({
      chats: chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        updatedAt: chat.updatedAt.toISOString(),
        createdAt: chat.createdAt.toISOString(),
        lastMessageAt: chat.lastMessageAt?.toISOString() ?? null,
        preview: chat.messages[0]?.content ?? "",
      })),
    });
  } catch (error) {
    console.error("Failed to load chats", error);
    return fail({ code: "INTERNAL_ERROR", message: "Unable to load chats." }, 500);
  }
}

export async function POST(req: Request) {
  const userId = await requireUserId();

  if (!userId) {
    return fail({ code: "UNAUTHORIZED", message: "Sign in required." }, 401);
  }

  let payload: CreateChatRequest;

  try {
    payload = (await req.json()) as CreateChatRequest;
  } catch {
    payload = {};
  }

  const title = payload.title?.trim() ? payload.title.trim().slice(0, 80) : "New Plan";

  try {
    const chat = await prisma.chat.create({
      data: {
        userId,
        title,
      },
    });

    return ok(
      {
        chat: {
          id: chat.id,
          title: chat.title,
          updatedAt: chat.updatedAt.toISOString(),
          createdAt: chat.createdAt.toISOString(),
          lastMessageAt: chat.lastMessageAt?.toISOString() ?? null,
          preview: "",
        },
      },
      201
    );
  } catch (error) {
    console.error("Failed to create chat", error);
    return fail({ code: "INTERNAL_ERROR", message: "Unable to create chat." }, 500);
  }
}
