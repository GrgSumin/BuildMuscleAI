import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 gym-grid opacity-40" />
      <div className="glass-panel neon-ring relative w-full max-w-md rounded-4xl p-4 sm:p-6">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
          Start Your Program
        </p>
        <SignUp
          appearance={{
            variables: {
              colorBackground: "transparent",
              colorText: "#d1fae5",
              colorPrimary: "#86efac",
              colorInputBackground: "rgba(0, 0, 0, 0.3)",
              colorInputText: "#ecfdf5",
              colorNeutral: "#99f6b8",
            },
            elements: {
              rootBox: "!w-full",
              cardBox: "!w-full",
              card: "!bg-transparent !shadow-none !border-0",
              headerTitle: "!text-emerald-100 !uppercase !tracking-[0.1em]",
              headerSubtitle: "!text-emerald-100/70",
              socialButtonsBlockButton:
                "!border !border-emerald-300/30 !bg-emerald-200/10 !text-emerald-100 hover:!bg-emerald-200/20",
              socialButtonsBlockButtonText: "!text-emerald-100",
              formFieldLabel: "!text-emerald-100/80",
              formFieldInput:
                "!bg-black/30 !border !border-emerald-300/20 !text-emerald-50 placeholder:!text-emerald-100/50",
              footerActionText: "!text-emerald-100/70",
              footerActionLink: "!text-emerald-200 hover:!text-emerald-100",
              formButtonPrimary: "!bg-emerald-300 !text-emerald-950 hover:!bg-emerald-200",
            },
          }}
        />
      </div>
    </main>
  );
}
