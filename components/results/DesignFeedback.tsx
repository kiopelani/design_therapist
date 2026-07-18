"use client";

import { useState } from "react";
import { hasValidFeedback } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface DesignFeedbackProps {
  isRefining: boolean;
  error: string | null;
  onRefine: (feedback: string) => void;
}

export function DesignFeedback({
  isRefining,
  error,
  onRefine,
}: DesignFeedbackProps) {
  const [feedback, setFeedback] = useState("");
  const trimmed = feedback.trim();
  const isValid = hasValidFeedback(feedback);
  const showTooShort = trimmed.length > 0 && trimmed.length < 10;

  function handleSubmit() {
    if (!isValid || isRefining) {
      return;
    }
    onRefine(trimmed);
  }

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
        Refine
      </p>
      <h2 className="text-display mt-2 text-3xl text-stone-900">
        Want to adjust this design?
      </h2>
      <p className="mt-3 text-stone-600">
        Tell us what to change and we&apos;ll regenerate your room image, design
        summary, and shopping list.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="design-feedback" className="field-label">
            Your feedback
          </label>
          <textarea
            id="design-feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder='e.g. "Warmer wood tones, swap the sofa for something smaller, less minimal"'
            rows={4}
            maxLength={1000}
            disabled={isRefining}
            className="field-input mt-2 resize-none"
          />
          <p className="mt-2 text-xs text-stone-400">
            {trimmed.length}/1000 characters (minimum 10)
          </p>
          {showTooShort && (
            <p className="mt-2 text-sm text-red-700">
              Please add a bit more detail so we know what to change.
            </p>
          )}
        </div>

        {isRefining && (
          <div className="rounded-2xl border border-stone-200/80 bg-stone-900 px-5 py-6 text-center text-white">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
            <p className="text-display text-xl">Refining your design</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone-300">
              This usually takes 30–60 seconds.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!isValid || isRefining}
          className="w-full sm:w-auto"
        >
          {isRefining ? "Refining..." : "Refine design"}
        </Button>
      </div>
    </Card>
  );
}
