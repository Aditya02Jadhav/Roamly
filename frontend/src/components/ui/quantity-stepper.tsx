import { MaterialIcon } from "@/components/ui/material-icon";

type QuantityStepperProps = {
  label: string;
  description: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
};

export function QuantityStepper({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: QuantityStepperProps) {
  const decrementDisabled = value <= min;
  const incrementDisabled = max !== undefined && value >= max;

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="font-label-md text-label-md font-semibold text-on-surface">
          {label}
        </div>
        <div className="font-body-sm text-body-sm text-secondary">
          {description}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <button
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-container-highest text-secondary transition-colors hover:border-on-surface hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
          disabled={decrementDisabled}
          onClick={() => onChange(Math.max(min, value - 1))}
          type="button"
        >
          <MaterialIcon className="text-[16px]" name="remove" />
        </button>
        <output
          aria-label={`${label}: ${value}`}
          className="w-4 text-center font-label-lg text-label-lg font-bold text-on-surface"
        >
          {value}
        </output>
        <button
          aria-label={`Increase ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-container-highest text-secondary transition-colors hover:border-on-surface hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
          disabled={incrementDisabled}
          onClick={() => onChange(value + 1)}
          type="button"
        >
          <MaterialIcon className="text-[16px]" name="add" />
        </button>
      </div>
    </div>
  );
}
