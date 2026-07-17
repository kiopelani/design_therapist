"use client";

import { useCallback, useEffect, useState } from "react";
import type { StyleInput } from "@/lib/types";
import { MAX_INSPIRATION_SELECTION } from "@/lib/types";
import type { InspirationPhoto } from "@/lib/style-inspiration";
import { toSelectedInspiration } from "@/lib/style-inspiration";
import { Card } from "@/components/ui/Card";
import { StyleInspirationCard } from "@/components/wizard/StyleInspirationCard";

interface StyleStepProps {
  roomType: string;
  data: StyleInput;
  onChange: (data: StyleInput) => void;
}

function PhotoSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80">
      <div className="aspect-[4/3] animate-pulse bg-stone-200" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function StyleStep({ roomType, data, onChange }: StyleStepProps) {
  const [photos, setPhotos] = useState<InspirationPhoto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPhotos = useCallback(
    async (q: string) => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams();
        if (q.trim()) {
          params.set("q", q.trim());
        } else {
          params.set("roomType", roomType);
        }

        const response = await fetch(`/api/inspiration/search?${params.toString()}`);
        const result = (await response.json()) as {
          photos?: InspirationPhoto[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error || "Failed to load inspiration photos");
        }

        setPhotos(result.photos ?? []);
      } catch (err) {
        setFetchError(
          err instanceof Error ? err.message : "Failed to load inspiration photos",
        );
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    },
    [roomType],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPhotos(searchQuery);
    }, searchQuery ? 400 : 0);

    return () => clearTimeout(timeout);
  }, [searchQuery, fetchPhotos]);

  function toggleSelection(photo: InspirationPhoto) {
    const isSelected = data.selectedInspirations.some((item) => item.id === photo.id);

    if (isSelected) {
      onChange({
        ...data,
        selectedInspirations: data.selectedInspirations.filter(
          (item) => item.id !== photo.id,
        ),
      });
      return;
    }

    const selected = toSelectedInspiration(photo);
    const inspirations =
      data.selectedInspirations.length < MAX_INSPIRATION_SELECTION
        ? [...data.selectedInspirations, selected]
        : [...data.selectedInspirations.slice(1), selected];

    onChange({ ...data, selectedInspirations: inspirations });
  }

  return (
    <Card className="animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
        Step 2
      </p>
      <h2 className="text-display mt-2 text-3xl text-stone-900">
        Which rooms inspire you?
      </h2>
      <p className="mt-3 text-stone-600">
        Pick up to {MAX_INSPIRATION_SELECTION} rooms that match the look you want. We&apos;ve loaded ideas
        for your {roomType.toLowerCase()}.
      </p>

      <div className="mt-8 space-y-7">
        <div>
          <label htmlFor="style-search" className="field-label">
            Refine your search
          </label>
          <input
            id="style-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='e.g. "bohemian cozy", "modern minimal"'
            className="field-input"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="field-label mb-0">
              Inspiration photos
            </span>
            <span className="text-xs text-stone-500">
              {data.selectedInspirations.length}/{MAX_INSPIRATION_SELECTION} selected
            </span>
          </div>

          {fetchError && (
            <div className="mb-4 rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-800">
              {fetchError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <PhotoSkeleton key={index} />
                ))
              : photos.map((photo) => (
                  <StyleInspirationCard
                    key={photo.id}
                    photo={photo}
                    selected={data.selectedInspirations.some(
                      (item) => item.id === photo.id,
                    )}
                    onToggle={() => toggleSelection(photo)}
                  />
                ))}
          </div>

          {!isLoading && !fetchError && photos.length === 0 && (
            <p className="mt-4 text-center text-sm text-stone-500">
              No photos found. Try a different search term.
            </p>
          )}

          <p className="mt-4 text-center text-xs text-stone-400">
            Photos from Unsplash
          </p>
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
