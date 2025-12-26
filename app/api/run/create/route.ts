import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { assistantId, threadId } = await req.json();

  if (!assistantId || !threadId) {
    return NextResponse.json(
      { error: "assisrantId or threadId or both missing", success: false },
      { status: 401 }
    );
  }
  const openAI = new OpenAI();

  try {
    const runs = await openAI.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    console.log("from open ai", runs);
    return NextResponse.json({ runs }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 401 });
  }
}
