import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { threadId } = await req.json();

  if (!threadId) {
    return NextResponse.json(
      { error: "threadId is missing", success: false },
      { status: 400 }
    );
  }

  const openAI = new OpenAI();
  try {
    const threadMessage = await openAI.beta.threads.messages.list(threadId);
    console.log("from open ai", threadMessage);
    return NextResponse.json({ threadMessage, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 401 });
  }
}
