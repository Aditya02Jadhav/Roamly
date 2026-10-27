import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ItineraryOption } from "@/features/itinerary-selection/components/itinerary-options";

type ItinerarySelectionDockProps = {
  option: ItineraryOption;
  preferencesHref: string;
  customizeHref: string;
};

export function ItinerarySelectionDock({
  option,
  preferencesHref,
  customizeHref,
}: ItinerarySelectionDockProps) {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-xl border-t border-surface-variant bg-surface-container-lowest px-5 py-4 shadow-sm sm:px-6 md:flex-row md:px-8">
      <Link
        className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary transition-colors hover:text-on-surface"
        href={preferencesHref}
      >
        <MaterialIcon className="text-[16px]" name="arrow_back" />
        <span>Back to preferences</span>
      </Link>

      <div
        aria-live="polite"
        className="flex items-center gap-2.5 text-center"
      >
        <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-primary-container" />
        <span className="font-label-md text-label-md font-medium text-on-surface">
          Selected: <span className="font-semibold">{option.title}</span>
          <span className="text-secondary">
            {" "}
            ({option.price} / person)
          </span>
        </span>
      </div>

      <div className="flex w-full flex-col items-stretch gap-1 md:w-auto md:items-end">
        <ButtonLink
          className="h-12 w-full gap-2 rounded-lg px-8 shadow-none md:w-auto"
          href={customizeHref}
        >
          <span>Customize this trip</span>
          <MaterialIcon className="text-[18px]" name="arrow_forward" />
        </ButtonLink>
        <span className="text-center text-[11px] text-secondary md:text-right">
          Next: Opens the day-by-day itinerary and map editor
        </span>
      </div>
    </div>
  );
}
