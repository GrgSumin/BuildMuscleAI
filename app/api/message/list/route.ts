import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { threadId } = await req.json();

  if (!threadId) {
    return NextResponse.json(
      { error: "threadId is missing", success: false },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: "Legacy message API is deprecated. Use /api/chats/{chatId}/messages.",
    },
    { status: 410 }
  );
}
