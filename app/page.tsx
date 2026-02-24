import Link from "next/link";
import { Activity, ArrowRight, Dumbbell, Timer } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const highlights = [
  {
    title: "Adaptive Workouts",
    description: "Plans tuned to your split, available equipment, and recovery level.",
    icon: Dumbbell,
  },
  {
    title: "Always-On Coach",
    description: "Get form cues, deload advice, and nutrition nudges in one chat.",
    icon: Activity,
  },
  {
    title: "Fast Iterations",
    description: "Adjust weekly with quick follow-ups and smarter progression decisions.",
    icon: Timer,
  },
];

const metrics = [
  { value: "24/7", label: "Coaching Access" },
  { value: "3x", label: "Faster Planning" },
  { value: "100%", label: "Built For Lifters" },
];

const explorePages = [
  {
    title: "Programs",
    description: "See focused training splits for different goals and schedules.",
    href: "/programs",
  },
  {
    title: "Transformations",
    description: "Read realistic progress stories and consistency habits.",
    href: "/transformations",
  },
  {
    title: "Coaching",
    description: "Understand how GymBro coaching works week to week.",
    href: "/coaching",
  },
];

const workoutPhotos = [
  {
    title: "Upper Body Strength",
    subtitle: "Men training power and control",
    image:
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Athletic Conditioning",
    subtitle: "Women focused on speed and endurance",
    image:
      "https://images.unsplash.com/photo-1597452485677-d661b7ea03d5?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Functional Sessions",
    subtitle: "Mixed routines for real-life performance",
    image:
      "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Core and Mobility",
    subtitle: "Balanced training for long-term progress",
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80",
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
    <div className="min-h-dvh bg-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">
        <header className="mb-14 flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-orange-400 text-black shadow-[0_0_20px_rgba(251,146,60,0.35)]">
              <Dumbbell aria-hidden="true" className="size-4" />
            </span>
            <p className="text-2xl font-semibold uppercase tracking-[0.18em] text-orange-200 sm:text-3xl">GymBro</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={secondaryHref}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-zinc-800 hover:text-orange-100"
            >
              {secondaryLabel}
            </Link>
            <Link
              href={primaryHref}
              className="rounded-xl bg-orange-400 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-[0_0_22px_rgba(251,146,60,0.28)] transition hover:bg-orange-300"
            >
              {primaryLabel}
            </Link>
          </div>
        </header>

        <main>
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="type-sequence mt-5 max-w-4xl text-5xl font-semibold uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">
              <span className="type-line type-line-1">Train Harder.</span>
              <span className="type-line type-line-2">Recover Smarter.</span>
              <span className="type-line type-line-3">Stay Consistent.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-200/85 sm:text-lg">
              GymBro gives you focused coaching in seconds. Build better plans, adjust your training load, and keep
              momentum without overthinking.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-400 px-6 py-3 text-base font-semibold text-zinc-950 shadow-[0_0_24px_rgba(251,146,60,0.32)] transition hover:translate-y-[-1px] hover:bg-orange-300"
              >
                {primaryLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center rounded-2xl bg-zinc-900 px-6 py-3 text-base font-semibold text-slate-100 transition hover:bg-zinc-800 hover:text-orange-100"
              >
                {secondaryLabel}
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-3">
              {metrics.map((item) => (
                <div key={item.label}>
                  <p className="text-3xl font-semibold text-orange-300 sm:text-4xl">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-300/80">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">Performance Stack</p>
              <div className="mt-5 space-y-5">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex size-8 items-center justify-center rounded-full bg-zinc-900 text-orange-200">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <h2 className="text-xl font-medium uppercase text-white">{item.title}</h2>
                        <p className="mt-1 text-sm text-slate-300/85">{item.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">How It Works</p>
              <div className="mt-5 space-y-5">
                {[
                  {
                    step: "01",
                    title: "Tell your goal",
                    text: "Cut, bulk, recomp, or strength block. Add your schedule and constraints.",
                  },
                  {
                    step: "02",
                    title: "Get your plan",
                    text: "Receive structured sessions, progressions, and recovery recommendations.",
                  },
                  {
                    step: "03",
                    title: "Refine weekly",
                    text: "Adjust loads and volume with quick follow-up chats as you improve.",
                  },
                ].map((item) => (
                  <article key={item.step} className="flex items-start gap-4">
                    <span className="text-sm font-semibold tracking-[0.18em] text-orange-300">{item.step}</span>
                    <div>
                      <h3 className="text-xl font-medium uppercase text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-300/85">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">Training Inspiration</p>
            <p className="mt-3 max-w-3xl text-sm text-slate-300/85 sm:text-base">
              Simple visuals. Real effort. Use GymBro to build sessions that match your pace and your goals.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {workoutPhotos.map((photo, index) => (
                <article
                  key={photo.title}
                  className="group relative overflow-hidden rounded-3xl bg-zinc-900 animate-in fade-in slide-in-from-bottom-3"
                  style={{ animationDelay: `${index * 120}ms`, animationDuration: "700ms" }}
                >
                  <div
                    className="h-56 w-full bg-cover bg-center transition duration-500 group-hover:scale-105 sm:h-64"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.1)), url(${photo.image})` }}
                    role="img"
                    aria-label={photo.subtitle}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-lg font-semibold uppercase text-orange-100">{photo.title}</p>
                    <p className="mt-1 text-sm text-slate-200/90">{photo.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-8 rounded-3xl bg-zinc-900/70 p-6 sm:p-8 lg:grid-cols-3">
            {[
              { title: "Beginner", text: "Start with low complexity plans and build confidence each week." },
              { title: "Intermediate", text: "Progressive overload and volume tuning with recovery checks." },
              { title: "Advanced", text: "Dial in intensity blocks and fatigue management for peak output." },
            ].map((track) => (
              <article key={track.title}>
                <h3 className="text-xl font-semibold uppercase text-orange-200">{track.title}</h3>
                <p className="mt-2 text-sm text-slate-300/85">{track.text}</p>
              </article>
            ))}
          </section>

          <section className="mt-16 animate-in fade-in duration-700">
            <p className="text-center text-lg font-medium text-slate-100 sm:text-xl">
              <span className="text-orange-300">Simple look.</span> Serious coaching.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-400 px-7 py-3 text-base font-semibold text-zinc-950 shadow-[0_0_24px_rgba(251,146,60,0.32)] transition hover:bg-orange-300"
              >
                {primaryLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">Explore Pages</p>
            <h2 className="mt-3 text-3xl font-semibold uppercase text-white sm:text-4xl">More Than One Screen</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {explorePages.map((item) => (
                <article key={item.href} className="rounded-3xl bg-zinc-900 p-5">
                  <h3 className="text-xl font-semibold uppercase text-orange-200">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300/85">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-orange-300 transition hover:text-orange-200"
                  >
                    Open page
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
