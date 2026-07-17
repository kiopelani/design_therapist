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
    <Card className="animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
        Step 2
      </p>
      <h2 className="text-display mt-2 text-3xl text-stone-900">
        What&apos;s your style?
      </h2>
      <p className="mt-3 text-stone-600">
        Pick up to two styles that speak to you.
      </p>

      <div className="mt-8 space-y-7">
        <div>
          <span className="field-label">Style preferences</span>
          <div className="flex flex-wrap gap-2.5">
            {STYLE_OPTIONS.map((style) => {
              const selected = data.styles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`style-chip ${selected ? "style-chip-selected" : ""}`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="colors" className="field-label">
            Color preferences
          </label>
          <input
            id="colors"
            type="text"
            value={data.colors}
            onChange={(e) => onChange({ ...data, colors: e.target.value })}
            placeholder='e.g. "Warm neutrals with sage green accents"'
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="mood" className="field-label">
            Desired mood
          </label>
          <input
            id="mood"
            type="text"
            value={data.mood}
            onChange={(e) => onChange({ ...data, mood: e.target.value })}
            placeholder='e.g. "Calm and cozy", "Bright and energizing"'
            className="field-input"
          />
        </div>

        <div>
          <span className="field-label">Budget range</span>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: "low", label: "Budget", hint: "Smart savings" },
                { value: "medium", label: "Mid-range", hint: "Balanced quality" },
                { value: "high", label: "Premium", hint: "Designer pieces" },
              ] as const
            ).map((option) => {
              const selected = data.budget === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...data, budget: option.value })}
                  className={`option-tile ${selected ? "option-tile-selected" : ""}`}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span
                    className={`option-hint mt-1 block text-xs ${selected ? "" : "text-stone-500"}`}
                  >
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
