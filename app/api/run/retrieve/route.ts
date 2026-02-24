import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { runId, threadId } = await req.json();

  if (!runId || !threadId) {
    return NextResponse.json(
      { error: "runId or threadId or both missing", success: false },
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
