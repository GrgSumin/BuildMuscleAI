"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Dumbbell } from "lucide-react";

const routes = [
  { name: "Home", href: "/" },
  { name: "Chat", href: "/chat" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/chat" className="group inline-flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-orange-400 text-black shadow-[0_0_20px_rgba(251,146,60,0.35)] transition group-hover:scale-105">
            <Dumbbell aria-hidden="true" className="size-4" />
          </span>
          <span className="text-xl font-semibold uppercase tracking-[0.14em] text-orange-100">GymBro</span>
        </Link>

        <div className="flex items-center gap-2 rounded-full bg-zinc-950 px-2 py-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition sm:text-sm ${
                pathname === route.href
                  ? "bg-zinc-800 text-orange-200"
                  : "text-slate-300/80 hover:text-orange-100"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>

        <div className="rounded-full bg-zinc-900 p-1.5">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
