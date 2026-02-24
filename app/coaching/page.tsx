import Link from "next/link";

const flow = [
  "Share your goal, schedule, and current fitness level.",
  "Receive a weekly structure with sets, reps, and progression guidance.",
  "Adjust each week using feedback from your training performance.",
];

export default function CoachingPage() {
  return (
    <div className="min-h-dvh bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">Coaching System</p>
        <h1 className="mt-3 text-4xl font-semibold uppercase text-white sm:text-5xl">How GymBro Coaching Works</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300/85 sm:text-base">
          Keep things simple: one focused system that helps you train, recover, and progress.
        </p>

        <ol className="mt-8 space-y-4">
          {flow.map((item, index) => (
            <li key={item} className="rounded-3xl bg-zinc-900 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange-200">Step {index + 1}</p>
              <p className="mt-2 text-sm text-slate-300/85 sm:text-base">{item}</p>
            </li>
          ))}
        </ol>

        <Link href="/" className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.1em] text-orange-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
