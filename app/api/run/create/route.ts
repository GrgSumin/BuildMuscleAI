import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { assistantId, threadId } = await req.json();

  if (!assistantId || !threadId) {
    return NextResponse.json(
      { error: "assisrantId or threadId or both missing", success: false },
      { status: 401 }
    );
  }
  return NextResponse.json(
    {
      success: false,
      error: "Legacy run API is deprecated. Use /api/chats/{chatId}/stream with llama3.2:latest.",
    },
    { status: 410 }
  );
}
