import Link from "next/link";

const programs = [
  { name: "Lean Build", details: "4 days/week, hypertrophy focus, moderate volume." },
  { name: "Strength Cycle", details: "5 days/week, compound lifts, progressive overload." },
  { name: "Recomp Track", details: "3-4 days/week, balanced volume and conditioning." },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-dvh bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">GymBro Programs</p>
        <h1 className="mt-3 text-4xl font-semibold uppercase text-white sm:text-5xl">Choose Your Training Track</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300/85 sm:text-base">
          Pick a structure that fits your lifestyle, then personalize it inside chat coaching.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {programs.map((program) => (
            <article key={program.name} className="rounded-3xl bg-zinc-900 p-5">
              <h2 className="text-lg font-semibold uppercase text-orange-200">{program.name}</h2>
              <p className="mt-2 text-sm text-slate-300/85">{program.details}</p>
            </article>
          ))}
        </div>

        <Link href="/" className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.1em] text-orange-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
