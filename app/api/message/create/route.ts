import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { message, threadId } = await req.json();

  if (!threadId || !message) {
    return NextResponse.json(
      { error: "thread and messaga are required", success: false },
      { status: 400 }
    );
  }
  const openAi = new OpenAI();

  try {
    const threadMessage = await openAi.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
    console.log("from open ai", threadMessage);
    return NextResponse.json(
      { message: threadMessage, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
