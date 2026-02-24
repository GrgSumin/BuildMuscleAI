import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Assistant bootstrap is deprecated. The app now uses llama3.2:latest via /api/chats/{chatId}/stream.",
    },
    { status: 410 }
  );
}
