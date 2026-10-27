import { MaterialIcon } from "@/components/ui/material-icon";

const steps = ["Preferences", "Choose Plan", "Customize Itinerary"] as const;

type TripStepProgressProps = {
  currentStep: 1 | 2 | 3;
  variant?: "sticky" | "compact";
};

export function TripStepProgress({
  currentStep,
  variant = "sticky",
}: TripStepProgressProps) {
  const stepTitle = [
    "Trip preferences",
    "Choose your itinerary",
    "Customize itinerary",
  ][currentStep - 1];

  if (variant === "compact") {
    return (
      <div className="flex flex-col justify-between gap-4 border-b border-surface-variant pb-6 pt-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-space-md">
          <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            Step {currentStep} of 3
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {currentStep === 2 ? "Choose Your Itinerary" : stepTitle}
          </h2>
        </div>
        <nav aria-label="Trip planning steps">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 font-body-sm text-body-sm">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const complete = stepNumber < currentStep;
              const active = stepNumber === currentStep;

              return (
                <li className="flex items-center gap-2" key={step}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-surface-variant">
                      /
                    </span>
                  ) : null}
                  <span
                    aria-current={active ? "step" : undefined}
                    className={`flex items-center gap-space-xs ${
                      active
                        ? "font-semibold text-primary-container"
                        : "text-on-surface-variant"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                        complete
                          ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                          : active
                            ? "bg-primary-container font-bold text-on-primary"
                            : "border border-surface-variant text-secondary"
                      }`}
                    >
                      {complete ? (
                        <MaterialIcon
                          className="text-[13px]"
                          name="check"
                        />
                      ) : (
                        stepNumber
                      )}
                    </span>
                    <span>{stepNumber}. {step}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-30 w-full border-b border-surface-container-highest bg-surface-container-lowest shadow-sm">
      <div className="mx-auto max-w-[1100px] px-gutter-mobile py-3 sm:px-gutter">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-container font-label-sm text-label-sm font-bold text-on-primary">
              {currentStep}
            </span>
            <span className="font-label-lg text-label-lg text-on-surface">
              Step {currentStep} of 3 — {stepTitle}
            </span>
          </div>
        </div>
        <div
          aria-label={`Step ${currentStep} of 3`}
          aria-valuemax={3}
          aria-valuemin={1}
          aria-valuenow={currentStep}
          className="grid h-2.5 grid-cols-3 gap-2 overflow-hidden rounded-full bg-surface-container"
          role="progressbar"
        >
          {steps.map((step, index) => (
            <span
              className={`h-full rounded-full ${
                index < currentStep
                  ? "bg-primary-container"
                  : "bg-surface-variant"
              }`}
              key={step}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
