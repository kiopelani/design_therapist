import { Wizard } from "@/components/wizard/Wizard";

export default function Home() {
  return (
    <div className="min-h-full bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
            Design Therapist
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-stone-900">
            Your room, thoughtfully designed
          </h1>
          <p className="mt-2 max-w-xl text-stone-600">
            Share your space and style, and we&apos;ll create a custom room design
            with a shopping list to match.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Wizard />
      </main>
    </div>
  );
}
