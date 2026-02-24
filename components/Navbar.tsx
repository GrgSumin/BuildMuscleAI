"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const routes = [
  { name: "Home", href: "/" },
  { name: "Chat", href: "/chat" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-300/20 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/chat" className="text-2xl font-semibold uppercase tracking-[0.14em] text-emerald-100">
          GymBroAI
        </Link>

        <div className="flex items-center gap-5">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium uppercase tracking-[0.08em] transition ${
                pathname === route.href
                  ? "text-emerald-200"
                  : "text-emerald-100/70 hover:text-emerald-100"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-emerald-200/20 bg-emerald-200/10 p-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
