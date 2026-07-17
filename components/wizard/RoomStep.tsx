import type { RoomInput } from "@/lib/types";
import { ROOM_TYPES } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface RoomStepProps {
  data: RoomInput;
  onChange: (data: RoomInput) => void;
}

export function RoomStep({ data, onChange }: RoomStepProps) {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-stone-900">Tell us about your room</h2>
      <p className="mt-2 text-stone-600">
        We&apos;ll use this to shape a design that fits your space.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="room-type"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Room type
          </label>
          <select
            id="room-type"
            value={data.type}
            onChange={(e) => onChange({ ...data, type: e.target.value })}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-stone-700">
            Approximate size
          </span>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: "small", label: "Small", hint: "Under 120 sq ft" },
                { value: "medium", label: "Medium", hint: "120–250 sq ft" },
                { value: "large", label: "Large", hint: "250+ sq ft" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...data, size: option.value })}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  data.size === option.value
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

        <div>
          <label
            htmlFor="constraints"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Constraints or must-haves
          </label>
          <textarea
            id="constraints"
            value={data.constraints}
            onChange={(e) => onChange({ ...data, constraints: e.target.value })}
            placeholder='e.g. "Must keep my desk", "Rental — no painting walls"'
            rows={4}
            className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </div>
      </div>
    </Card>
  );
}
