import { Wizard } from "@/components/wizard/Wizard";

export default function Home() {
  return (
    <div className="mesh-bg min-h-full">
      <header className="border-b border-stone-900/5">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold tracking-wider text-stone-50">
              DT
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Design Therapist
            </p>
          </div>
          <h1 className="text-display mt-6 max-w-2xl text-4xl leading-[1.1] text-stone-900 sm:text-5xl">
            Your room, thoughtfully designed
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Share your space and style. We&apos;ll craft a bespoke room vision
            and a curated shopping list to bring it home.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <Wizard />
      </main>

      <footer className="border-t border-stone-900/5 py-8 text-center text-xs tracking-wide text-stone-400">
        Crafted for spaces that feel like you
      </footer>
    </div>
  );
}
