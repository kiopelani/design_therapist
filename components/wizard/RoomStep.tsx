import type { RoomInput } from "@/lib/types";
import { ROOM_TYPES } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface RoomStepProps {
  data: RoomInput;
  onChange: (data: RoomInput) => void;
}

export function RoomStep({ data, onChange }: RoomStepProps) {
  function setSizeMode(sizeMode: RoomInput["sizeMode"]) {
    onChange({ ...data, sizeMode });
  }

  function updateCustomDimensions(
    field: keyof RoomInput["customDimensions"],
    value: string,
  ) {
    onChange({
      ...data,
      customDimensions: { ...data.customDimensions, [field]: value },
    });
  }

  return (
    <Card className="animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
        Step 1
      </p>
      <h2 className="text-display mt-2 text-3xl text-stone-900">
        Tell us about your room
      </h2>
      <p className="mt-3 text-stone-600">
        We&apos;ll use this to shape a design that fits your space.
      </p>

      <div className="mt-8 space-y-7">
        <div>
          <label htmlFor="room-type" className="field-label">
            Room type
          </label>
          <select
            id="room-type"
            value={data.type}
            onChange={(e) => onChange({ ...data, type: e.target.value })}
            className="field-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b645c%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="field-label">Room size</span>
          <div className="mb-4 grid grid-cols-2 gap-3">
            {(
              [
                {
                  value: "approximate",
                  label: "Approximate",
                  hint: "Pick a general size",
                },
                {
                  value: "custom",
                  label: "Custom",
                  hint: "Enter your dimensions",
                },
              ] as const
            ).map((option) => {
              const selected = data.sizeMode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSizeMode(option.value)}
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

          {data.sizeMode === "approximate" ? (
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { value: "small", label: "Small", hint: "Under 120 sq ft" },
                  { value: "medium", label: "Medium", hint: "120–250 sq ft" },
                  { value: "large", label: "Large", hint: "250+ sq ft" },
                ] as const
              ).map((option) => {
                const selected = data.size === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange({ ...data, size: option.value })}
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
          ) : (
            <div className="space-y-4 rounded-2xl border border-stone-200/60 bg-white/50 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="room-length" className="field-label">
                    Length
                  </label>
                  <input
                    id="room-length"
                    type="number"
                    min="1"
                    step="0.1"
                    value={data.customDimensions.length}
                    onChange={(e) => updateCustomDimensions("length", e.target.value)}
                    placeholder="12"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="room-width" className="field-label">
                    Width
                  </label>
                  <input
                    id="room-width"
                    type="number"
                    min="1"
                    step="0.1"
                    value={data.customDimensions.width}
                    onChange={(e) => updateCustomDimensions("width", e.target.value)}
                    placeholder="14"
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <span className="field-label">Unit</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["ft", "m"] as const).map((unit) => {
                    const selected = data.customDimensions.unit === unit;
                    return (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => updateCustomDimensions("unit", unit)}
                        className={`option-tile ${selected ? "option-tile-selected" : ""}`}
                      >
                        <span className="block text-sm font-semibold">
                          {unit === "ft" ? "Feet" : "Meters"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="constraints" className="field-label">
            Constraints or must-haves
          </label>
          <textarea
            id="constraints"
            value={data.constraints}
            onChange={(e) => onChange({ ...data, constraints: e.target.value })}
            placeholder='e.g. "Must keep my desk", "Rental — no painting walls"'
            rows={4}
            className="field-input resize-none"
          />
        </div>
      </div>
    </Card>
  );
}
