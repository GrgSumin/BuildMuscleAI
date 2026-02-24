import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Thread API is deprecated. Use /api/chats endpoints with llama3.2:latest.",
    },
    { status: 410 }
  );
}
