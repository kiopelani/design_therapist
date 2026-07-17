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
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {labels.map((label, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-px flex-1 transition-colors duration-300 ${
                      index <= currentStep ? "bg-stone-900" : "bg-stone-200"
                    }`}
                  />
                )}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    isCurrent
                      ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                      : isComplete
                        ? "bg-stone-900 text-white"
                        : "border border-stone-200 bg-white text-stone-400"
                  }`}
                >
                  {isComplete ? (
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-px flex-1 transition-colors duration-300 ${
                      index < currentStep ? "bg-stone-900" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2.5 text-xs font-medium tracking-wide transition-colors ${
                  isCurrent ? "text-stone-900" : "text-stone-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
