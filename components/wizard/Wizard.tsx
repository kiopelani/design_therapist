"use client";

import { useState } from "react";
import type { GenerateResponse, WizardData } from "@/lib/types";
import { DEFAULT_WIZARD_DATA } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RoomStep } from "@/components/wizard/RoomStep";
import { StyleStep } from "@/components/wizard/StyleStep";
import { GenerateStep } from "@/components/wizard/GenerateStep";
import { DesignResult } from "@/components/results/DesignResult";
import { ShoppingList } from "@/components/results/ShoppingList";

const STEP_LABELS = ["Room", "Style", "Design"];

export function Wizard() {
  const [step, setStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>(DEFAULT_WIZARD_DATA);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceedFromStyle = wizardData.style.styles.length > 0;

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wizardData),
      });

      const data = (await response.json().catch(() => null)) as
        | GenerateResponse
        | { error?: string }
        | null;

      if (!response.ok || !data) {
        throw new Error(
          (data && "error" in data && data.error) ||
            "Failed to generate design",
        );
      }

      if (!("designSummary" in data) || !("imageUrl" in data)) {
        throw new Error("Unexpected response from server");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartOver() {
    setStep(0);
    setWizardData(DEFAULT_WIZARD_DATA);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }

  if (result) {
    return (
      <div className="animate-fade-up space-y-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Your design
          </p>
          <h2 className="text-display mt-2 text-3xl text-stone-900 sm:text-4xl">
            {result.designSummary.title}
          </h2>
        </div>
        <DesignResult
          imageUrl={result.imageUrl}
          summary={result.designSummary}
        />
        <ShoppingList items={result.shoppingList} />
        <div className="flex justify-center pb-4">
          <Button variant="secondary" onClick={handleStartOver}>
            Start over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <ProgressBar
        currentStep={step}
        totalSteps={STEP_LABELS.length}
        labels={STEP_LABELS}
      />

      <div key={step}>
        {step === 0 && (
          <RoomStep
            data={wizardData.room}
            onChange={(room) => setWizardData({ ...wizardData, room })}
          />
        )}

        {step === 1 && (
          <StyleStep
            data={wizardData.style}
            onChange={(style) => setWizardData({ ...wizardData, style })}
          />
        )}

        {step === 2 && (
          <GenerateStep data={wizardData} isLoading={isLoading} error={error} />
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-stone-900/5 pt-6">
        {step > 0 ? (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={isLoading}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !canProceedFromStyle}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate my design"}
          </Button>
        )}
      </div>
    </div>
  );
}
