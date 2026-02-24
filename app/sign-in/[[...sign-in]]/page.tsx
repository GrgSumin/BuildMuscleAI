import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 gym-grid" />
      <div className="glass-panel neon-ring relative w-full max-w-md rounded-4xl p-4 sm:p-6">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">
          Welcome Back
        </p>
        <SignIn
          appearance={{
            variables: {
              colorBackground: "transparent",
              colorText: "#e2e8f0",
              colorPrimary: "#fb923c",
              colorInputBackground: "#121823",
              colorInputText: "#f8fafc",
              colorNeutral: "#fbbf24",
            },
            elements: {
              rootBox: "!w-full",
              cardBox: "!w-full",
              card: "!bg-transparent !shadow-none !border-0",
              headerTitle: "!text-orange-100 !uppercase !tracking-[0.1em]",
              headerSubtitle: "!text-slate-300/80",
              socialButtonsBlockButton:
                "!border !border-orange-300/35 !bg-[#151c28] !text-slate-100 hover:!bg-[#1f2937]",
              socialButtonsBlockButtonText: "!text-slate-100",
              formFieldLabel: "!text-slate-200/85",
              formFieldInput:
                "!bg-[#121823] !border !border-slate-400/25 !text-slate-100 placeholder:!text-slate-300/60",
              footerActionText: "!text-slate-300/70",
              footerActionLink: "!text-orange-200 hover:!text-orange-100",
              formButtonPrimary: "!bg-orange-400 !text-zinc-950 hover:!bg-orange-300",
            },
          }}
        />
      </div>
    </main>
  );
}
