import { create } from "zustand";
import type { UserThread } from "@/lib/generated/prisma/client";

type ChatState = {
  userThread: UserThread | null;
  setUserThread: (thread: UserThread | null) => void;
  resetUserThread: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  userThread: null,
  setUserThread: (thread) => set({ userThread: thread }),
  resetUserThread: () => set({ userThread: null }),
}));

 