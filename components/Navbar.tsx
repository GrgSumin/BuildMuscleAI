"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const routes = [
  { name: "Chat", href: "/" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md dark:bg-black/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          GymBroAI
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          {routes.map((route, i) => (
            <Link
              key={i}
              href={route.href}
              className={`${
                pathname === route.href ? "border-b-2 border-black" : " "
              } hover:text-gray-500`}
            >
              {route.name}
            </Link>
          ))}
        </div>

        {/* Clerk */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
