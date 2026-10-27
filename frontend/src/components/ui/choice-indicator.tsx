import { MaterialIcon } from "@/components/ui/material-icon";

type ChoiceIndicatorProps = {
  selected: boolean;
};

export function ChoiceIndicator({ selected }: ChoiceIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
        selected
          ? "bg-primary-container text-on-primary"
          : "border border-surface-container-highest"
      }`}
    >
      {selected ? (
        <MaterialIcon className="text-[12px]" name="check" />
      ) : null}
    </span>
  );
}
