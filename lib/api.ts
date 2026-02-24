import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type ApiError = {
  code: string;
  message: string;
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: ApiError, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function requireUserId() {
  const { userId } = await auth();
  return userId;
}
