 "use client";

import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useChatStore } from "@/app/chatStore";

export default function AppLayout({
  //layout basically hepls in styling and state mangement
  //this one is the local one so we will do local level stylingand state mangement here
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userThread = useChatStore((s) => s.userThread);
  const setUserThread = useChatStore((s) => s.setUserThread);

  useEffect(() => {
    async function ensureUserThread() {
      try {
        const res = await fetch("/api/user-thread");
        const data = await res.json();
        if (data?.success && data?.userThread) {
          setUserThread(data.userThread);
        } else {
          setUserThread(null);
        }
      } catch {
        setUserThread(null);
      }
    }

    if (!userThread) ensureUserThread();
  }, [setUserThread, userThread]);

  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      {children}
    </div>
  );
}
