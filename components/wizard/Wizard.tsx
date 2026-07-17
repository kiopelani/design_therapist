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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate design");
      }

      setResult(data as GenerateResponse);
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
      <div className="space-y-8">
        <DesignResult
          imageUrl={result.imageUrl}
          summary={result.designSummary}
        />
        <ShoppingList items={result.shoppingList} />
        <div className="flex justify-center pb-8">
          <Button variant="secondary" onClick={handleStartOver}>
            Start over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProgressBar
        currentStep={step}
        totalSteps={STEP_LABELS.length}
        labels={STEP_LABELS}
      />

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

      <div className="flex justify-between gap-4">
        {step > 0 ? (
          <Button
            variant="secondary"
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
