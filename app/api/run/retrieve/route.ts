import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { runId, threadId } = await req.json();

  if (!runId || !threadId) {
    return NextResponse.json(
      { error: "runId or threadId or both missing", success: false },
      { status: 401 }
    );
  }
  const openAI = new OpenAI();

  try {
    const runs = await openAI.beta.threads.runs.retrieve(runId, {
      thread_id: threadId,
    });
    console.log("from open ai", runs);
    return NextResponse.json({ runs }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 401 });
  }
}
