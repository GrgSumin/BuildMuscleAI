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
    <div className="relative min-h-[calc(100dvh-56px)] overflow-x-hidden p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 gym-grid opacity-35" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <section className="glass-panel relative rounded-4xl p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <div
                  aria-label={displayName}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-200/30 bg-gradient-to-br from-emerald-300/40 via-emerald-200/20 to-lime-200/30 text-xl font-bold text-emerald-50 shadow-md sm:h-24 sm:w-24"
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
                <span className="absolute -bottom-1 -right-1 rounded-full border border-emerald-100/40 bg-emerald-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-950">
                  Active
                </span>
              </div>

              <div>
                <p className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100">
                  <Sparkles className="size-3.5" />
                  Athlete Profile
                </p>
                <h1 className="mt-2 text-3xl font-semibold uppercase tracking-[0.04em] text-emerald-50 sm:text-4xl">{displayName}</h1>
                <p className="text-sm text-emerald-100/75">{primaryEmail ?? "No email available"}</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-emerald-100/70">
                  <CalendarDays className="size-3.5" />
                  Joined {formatJoinedDate(joinedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button asChild className="rounded-xl bg-emerald-300 text-emerald-950 hover:bg-emerald-200">
                <Link href="/chat">Go to Chat</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-emerald-300/30 bg-emerald-200/10 text-emerald-100 hover:bg-emerald-300/20">
                <Link href="/chat?new=1">Start New Plan</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-emerald-300/20 bg-black/30 p-4 shadow-sm backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
              <Activity className="size-3.5" />
              Total Plans
            </p>
            <p className="mt-2 text-3xl font-semibold text-emerald-50">{chatCount}</p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-black/30 p-4 shadow-sm backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
              <MessageSquare className="size-3.5" />
              Total Messages
            </p>
            <p className="mt-2 text-3xl font-semibold text-emerald-50">{messageCount}</p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-black/30 p-4 shadow-sm backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
              <CalendarDays className="size-3.5" />
              Last Active
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-50">{formatShortDate(lastActiveDate)}</p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-black/30 p-4 shadow-sm backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-100/70">
              <Flame className="size-3.5" />
              Streak
            </p>
            <p className="mt-2 text-3xl font-semibold text-emerald-50">7</p>
            <p className="text-xs text-emerald-100/70">Daily check-ins this week</p>
          </div>
        </section>

        <section className="glass-panel rounded-4xl p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
                <h2 className="text-lg font-semibold uppercase tracking-[0.08em] text-emerald-50">Recent Activity</h2>
                <p className="text-sm text-emerald-100/70">Your latest coaching conversations and plan updates.</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {recentChats.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-emerald-200/35 bg-black/30 p-5 text-sm text-emerald-100/75">
                  No plans yet. Start your first coaching session to see activity here.
                </div>
              ) : (
                recentChats.map((chat) => {
                const preview = chat.messages[0]?.content || "No messages yet";

                return (
                  <Link
                    href={`/chat?chat=${chat.id}`}
                    key={chat.id}
                    className="block rounded-2xl border border-emerald-300/20 bg-black/25 px-4 py-3 transition hover:border-emerald-300/35 hover:bg-emerald-300/8"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-emerald-50">{chat.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-emerald-100/75">{preview}</p>
                      </div>
                      <p className="shrink-0 text-xs font-medium uppercase tracking-wide text-emerald-100/65">
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
