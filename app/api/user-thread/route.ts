import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "unautorized access" },
      { status: 401 }
    );
  }

  //get userthread from database
  try {
    const userThread = await prisma.userThread.findUnique({
      where: { userId: user.id },
    });

    //if it exits return it
    if (userThread) {
      return NextResponse.json({ userThread, success: true }, { status: 200 });
    }

    //TODO: if doesnot create from open ai
    const openAi = new OpenAI();
    const thread = await openAi.beta.threads.create();

    //save it to database
    const newThreadUser = await prisma.userThread.create({
      data: {
        userId: user.id,
        threadId: thread.id,
      },
    });
    //return it to user

    return NextResponse.json({ newThreadUser, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
