import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, threadId } = await req.json();

  if (!threadId || !message) {
    return NextResponse.json(
      { error: "thread and messaga are required", success: false },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: "Legacy message API is deprecated. Use /api/chats/{chatId}/stream with llama3.2:latest.",
    },
    { status: 410 }
  );
}
