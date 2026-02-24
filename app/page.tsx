import Link from "next/link";
import { Activity, ArrowRight, Dumbbell, Sparkles, Timer } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const highlights = [
  {
    title: "Adaptive Workouts",
    description: "Tell GymBroAI your goal and get a plan tuned for your equipment, split, and recovery.",
    icon: Dumbbell,
  },
  {
    title: "Always-On Coach",
    description: "Form cues, deload advice, nutrition prompts, and progression tweaks in one focused chat.",
    icon: Activity,
  },
  {
    title: "Fast Iterations",
    description: "Ask follow-up questions in seconds and keep your sessions evolving every week.",
    icon: Timer,
  },
];

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);
  const primaryHref = isSignedIn ? "/chat" : "/sign-up?redirect_url=%2Fchat";
  const secondaryHref = isSignedIn ? "/profile" : "/sign-in?redirect_url=%2Fchat";
  const primaryLabel = isSignedIn ? "Open Chat" : "Start Free";
  const secondaryLabel = isSignedIn ? "Profile" : "Sign In";

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 gym-grid opacity-40" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
        <header className="mb-10 flex items-center justify-between sm:mb-16">
          <p className="text-3xl font-semibold uppercase tracking-[0.18em] text-orange-300">GymBroAI</p>
          <div className="flex items-center gap-2">
            <Link
              href={secondaryHref}
              className="rounded-xl border border-orange-300/35 bg-orange-100/10 px-4 py-2 text-sm font-medium text-orange-100 transition hover:border-orange-200/45 hover:bg-orange-100/20"
            >
              {secondaryLabel}
            </Link>
            <Link
              href={primaryHref}
              className="rounded-xl bg-orange-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-200"
            >
              {primaryLabel}
            </Link>
          </div>
        </header>

        <main className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="animate-in fade-in slide-in-from-left-4 duration-700">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-300/35 bg-orange-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-100">
              <Sparkles className="size-3.5" />
              Built For Consistency
            </p>
            <h1 className="mt-5 text-5xl font-semibold uppercase leading-[0.88] text-white sm:text-6xl lg:text-7xl">
              Train Hard.
              <br />
              Recover Smart.
              <br />
              Chat Better.
            </h1>
            <p className="mt-5 max-w-xl text-base text-zinc-100/80 sm:text-lg">
              A high-performance coaching chat for lifters who care about progress. Build programs, tune intensity,
              and stay locked in with personalized guidance.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-300 px-6 py-3 text-base font-semibold text-zinc-950 transition hover:translate-y-[-1px] hover:bg-orange-200"
              >
                {primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center rounded-2xl border border-orange-200/30 bg-orange-100/10 px-6 py-3 text-base font-semibold text-orange-100 transition hover:border-orange-200/45 hover:bg-orange-100/20"
              >
                {secondaryLabel}
              </Link>
            </div>
          </section>

          <section className="glass-panel neon-ring animate-in fade-in slide-in-from-right-4 rounded-4xl p-5 duration-700 sm:p-7">
            <div className="relative overflow-hidden rounded-3xl border border-orange-200/25 bg-black/45">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-52 w-full object-cover object-center opacity-85 sm:h-60"
                poster="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80"
                aria-label="Athlete training in the gym"
              >
                <source
                  src="https://videos.pexels.com/video-files/4761779/4761779-hd_1920_1080_25fps.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <p className="absolute bottom-3 left-3 rounded-full border border-orange-200/30 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-100">
                Real Workouts. Real Results.
              </p>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">Performance Stack</p>
            <div className="mt-4 space-y-3">
              {highlights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="animate-in fade-in slide-in-from-bottom-3 rounded-2xl border border-orange-200/20 bg-black/35 p-4"
                    style={{ animationDelay: `${index * 120}ms`, animationDuration: "700ms" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="rounded-xl bg-orange-200/15 p-2 text-orange-200">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <h2 className="text-lg font-medium uppercase text-white">{item.title}</h2>
                        <p className="mt-1 text-sm text-zinc-100/75">{item.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
