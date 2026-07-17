import type { WizardData } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface GenerateStepProps {
  data: WizardData;
  isLoading: boolean;
  error: string | null;
}

export function GenerateStep({ data, isLoading, error }: GenerateStepProps) {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-stone-900">
        Ready to design your room
      </h2>
      <p className="mt-2 text-stone-600">
        Review your choices, then we&apos;ll generate a custom design and
        shopping list.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-xl bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-stone-800">Room</h3>
          <dl className="mt-2 space-y-1 text-sm text-stone-600">
            <div className="flex justify-between gap-4">
              <dt>Type</dt>
              <dd className="text-right font-medium text-stone-800">
                {data.room.type}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Size</dt>
              <dd className="text-right font-medium capitalize text-stone-800">
                {data.room.size}
              </dd>
            </div>
            {data.room.constraints && (
              <div>
                <dt className="mb-1">Constraints</dt>
                <dd className="text-stone-700">{data.room.constraints}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-stone-800">Style</h3>
          <dl className="mt-2 space-y-1 text-sm text-stone-600">
            <div className="flex justify-between gap-4">
              <dt>Styles</dt>
              <dd className="text-right font-medium text-stone-800">
                {data.style.styles.join(", ")}
              </dd>
            </div>
            {data.style.colors && (
              <div className="flex justify-between gap-4">
                <dt>Colors</dt>
                <dd className="text-right text-stone-700">{data.style.colors}</dd>
              </div>
            )}
            {data.style.mood && (
              <div className="flex justify-between gap-4">
                <dt>Mood</dt>
                <dd className="text-right text-stone-700">{data.style.mood}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt>Budget</dt>
              <dd className="text-right font-medium capitalize text-stone-800">
                {data.style.budget}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
          <p className="font-medium text-amber-900">Creating your design...</p>
          <p className="mt-1 text-sm text-amber-800">
            This usually takes 20–45 seconds. We&apos;re generating your room
            image and shopping list.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
    </Card>
  );
}
