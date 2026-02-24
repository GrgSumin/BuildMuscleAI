import Link from "next/link";

const stories = [
  { name: "Aarav", result: "Dropped 9kg in 16 weeks with consistent lifting + nutrition guidance." },
  { name: "Maya", result: "Added strength to all major lifts while improving recovery habits." },
  { name: "Jordan", result: "Moved from random workouts to a structured routine with visible progress." },
];

export default function TransformationsPage() {
  return (
    <div className="min-h-dvh bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">Transformations</p>
        <h1 className="mt-3 text-4xl font-semibold uppercase text-white sm:text-5xl">Real Consistency Stories</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300/85 sm:text-base">
          Progress is built through repeatable systems. These examples show what consistency looks like.
        </p>

        <div className="mt-8 space-y-4">
          {stories.map((story) => (
            <article key={story.name} className="rounded-3xl bg-zinc-900 p-5">
              <h2 className="text-lg font-semibold uppercase text-orange-200">{story.name}</h2>
              <p className="mt-2 text-sm text-slate-300/85">{story.result}</p>
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
