import type { StyleInput } from "@/lib/types";
import { STYLE_OPTIONS } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface StyleStepProps {
  data: StyleInput;
  onChange: (data: StyleInput) => void;
}

export function StyleStep({ data, onChange }: StyleStepProps) {
  function toggleStyle(style: string) {
    const isSelected = data.styles.includes(style);
    const styles = isSelected
      ? data.styles.filter((s) => s !== style)
      : data.styles.length < 2
        ? [...data.styles, style]
        : [data.styles[1], style];

    onChange({ ...data, styles });
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-stone-900">
        What&apos;s your style?
      </h2>
      <p className="mt-2 text-stone-600">
        Pick up to two styles that speak to you.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <span className="mb-3 block text-sm font-medium text-stone-700">
            Style preferences
          </span>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map((style) => {
              const selected = data.styles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selected
                      ? "border-amber-700 bg-amber-700 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="colors"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Color preferences
          </label>
          <input
            id="colors"
            type="text"
            value={data.colors}
            onChange={(e) => onChange({ ...data, colors: e.target.value })}
            placeholder='e.g. "Warm neutrals with sage green accents"'
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </div>

        <div>
          <label
            htmlFor="mood"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Desired mood
          </label>
          <input
            id="mood"
            type="text"
            value={data.mood}
            onChange={(e) => onChange({ ...data, mood: e.target.value })}
            placeholder='e.g. "Calm and cozy", "Bright and energizing"'
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-stone-700">
            Budget range
          </span>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: "low", label: "Budget", hint: "Smart savings" },
                { value: "medium", label: "Mid-range", hint: "Balanced quality" },
                { value: "high", label: "Premium", hint: "Designer pieces" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...data, budget: option.value })}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  data.budget === option.value
                    ? "border-amber-700 bg-amber-50"
                    : "border-stone-300 bg-white hover:border-stone-400"
                }`}
              >
                <span className="block text-sm font-medium text-stone-900">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500">
                  {option.hint}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
