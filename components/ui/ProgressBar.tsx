interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressBar({
  currentStep,
  totalSteps,
  labels,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-between text-xs font-medium text-stone-500">
        {labels.map((label, index) => (
          <span
            key={label}
            className={index <= currentStep ? "text-stone-800" : ""}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-amber-700 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
