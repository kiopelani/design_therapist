import type { WizardData } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface GenerateStepProps {
  data: WizardData;
  isLoading: boolean;
  error: string | null;
}

function ReviewBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/50 p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function GenerateStep({ data, isLoading, error }: GenerateStepProps) {
  return (
    <Card className="animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
        Step 3
      </p>
      <h2 className="text-display mt-2 text-3xl text-stone-900">
        Ready to design your room
      </h2>
      <p className="mt-3 text-stone-600">
        Review your choices, then we&apos;ll generate a custom design and
        shopping list.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ReviewBlock title="Room">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4 border-b border-stone-100 py-2.5">
              <dt className="text-stone-500">Type</dt>
              <dd className="font-medium text-stone-900">{data.room.type}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-100 py-2.5">
              <dt className="text-stone-500">Size</dt>
              <dd className="font-medium capitalize text-stone-900">
                {data.room.size}
              </dd>
            </div>
            {data.room.constraints && (
              <div className="pt-2.5">
                <dt className="text-stone-500">Constraints</dt>
                <dd className="mt-1 text-stone-800">{data.room.constraints}</dd>
              </div>
            )}
          </dl>
        </ReviewBlock>

        <ReviewBlock title="Style">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4 border-b border-stone-100 py-2.5">
              <dt className="text-stone-500">Styles</dt>
              <dd className="text-right font-medium text-stone-900">
                {data.style.styles.join(", ")}
              </dd>
            </div>
            {data.style.colors && (
              <div className="flex justify-between gap-4 border-b border-stone-100 py-2.5">
                <dt className="text-stone-500">Colors</dt>
                <dd className="text-right text-stone-800">{data.style.colors}</dd>
              </div>
            )}
            {data.style.mood && (
              <div className="flex justify-between gap-4 border-b border-stone-100 py-2.5">
                <dt className="text-stone-500">Mood</dt>
                <dd className="text-right text-stone-800">{data.style.mood}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-stone-500">Budget</dt>
              <dd className="font-medium capitalize text-stone-900">
                {data.style.budget}
              </dd>
            </div>
          </dl>
        </ReviewBlock>
      </div>

      {isLoading && (
        <div className="mt-8 rounded-2xl border border-stone-200/80 bg-stone-900 p-8 text-center text-white">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
          <p className="text-display text-2xl">Creating your design</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-300">
            This usually takes 20–45 seconds. We&apos;re generating your room
            image and shopping list.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}
    </Card>
  );
}
