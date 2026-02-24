import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, CalendarDays, Flame, MessageSquare, Sparkles } from "lucide-react";

function formatShortDate(date: Date | null) {
  if (!date) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatJoinedDate(date: Date | null) {
  if (!date) {
    return "New member";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const [chatCount, messageCount, latestChat, latestMessage, recentChats] = await Promise.all([
    prisma.chat.count({ where: { userId: user.id } }),
    prisma.chatMessage.count({ where: { chat: { userId: user.id } } }),
    prisma.chat.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.chatMessage.findFirst({
      where: { chat: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      take: 5,
    }),
  ]);

  const lastActiveDate = (() => {
    const latestChatDate = latestChat?.updatedAt ?? null;
    const latestMessageDate = latestMessage?.createdAt ?? null;

    if (!latestChatDate) {
      return latestMessageDate;
    }

    if (!latestMessageDate) {
      return latestChatDate;
    }

    return latestChatDate > latestMessageDate ? latestChatDate : latestMessageDate;
  })();

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "GymBro";
  const primaryEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress;
  const profileImage = user.imageUrl;
  const joinedAt = user.createdAt ? new Date(user.createdAt) : null;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-black p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <section className="relative overflow-hidden rounded-4xl bg-zinc-900 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-orange-300/12 to-transparent" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <div
                  aria-label={displayName}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-300/40 bg-[#202734] text-xl font-bold text-orange-100 shadow-md sm:h-24 sm:w-24"
                  style={
                    profileImage
                      ? {
                          backgroundImage: `url(${profileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  {!profileImage ? initials || "G" : null}
                </div>
                <span className="absolute -bottom-1 -right-1 rounded-full border border-orange-100/40 bg-orange-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-950">
                  Active
                </span>
              </div>

              <div>
                <p className="inline-flex items-center gap-1 rounded-full border border-orange-300/35 bg-[#1b212c] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-100">
                  <Sparkles aria-hidden="true" className="size-3.5" />
                  Athlete Profile
                </p>
                <h1 className="mt-2 text-3xl font-semibold uppercase tracking-[0.04em] text-slate-50 sm:text-4xl">{displayName}</h1>
                <p className="text-sm text-slate-200/75">{primaryEmail ?? "No email available"}</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-300/70">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  Joined {formatJoinedDate(joinedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button asChild className="rounded-xl bg-orange-400 text-zinc-950 hover:bg-orange-300">
                <Link href="/chat">Go to Chat</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-orange-300/30 bg-[#1c2330] text-slate-100 hover:bg-[#242d3d]">
                <Link href="/chat?new=1">Start New Plan</Link>
              </Button>
            </div>
          </div>
        </section>

         <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-zinc-900 p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300/75">
              <Activity aria-hidden="true" className="size-3.5" />
              Total Plans
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">{chatCount}</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300/75">
              <MessageSquare aria-hidden="true" className="size-3.5" />
              Total Messages
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">{messageCount}</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300/75">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              Last Active
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{formatShortDate(lastActiveDate)}</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300/75">
              <Flame aria-hidden="true" className="size-3.5" />
              Streak
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">7</p>
            <p className="text-xs text-slate-300/75">Daily check-ins this week</p>
          </div>
        </section>

        <section className="rounded-4xl bg-zinc-900 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
                <h2 className="text-lg font-semibold uppercase tracking-[0.08em] text-slate-50">Recent Activity</h2>
                <p className="text-sm text-slate-200/75">Your latest coaching conversations and plan updates.</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {recentChats.length === 0 ? (
                <div className="rounded-2xl bg-zinc-950 p-5 text-sm text-slate-200/80">
                  No plans yet. Start your first coaching session to see activity here.
                </div>
              ) : (
                recentChats.map((chat) => {
                const preview = chat.messages[0]?.content || "No messages yet";

                return (
                  <Link
                    href={`/chat?chat=${chat.id}`}
                    key={chat.id}
                    className="block rounded-2xl bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-50">{chat.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-200/75">{preview}</p>
                      </div>
                      <p className="shrink-0 text-xs font-medium uppercase tracking-wide text-orange-100/75">
                        {formatShortDate(chat.lastMessageAt ?? chat.updatedAt)}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
