import Image from "next/image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ItineraryOption } from "@/features/itinerary-selection/components/itinerary-options";

type ItineraryCardProps = {
  option: ItineraryOption;
  days: number;
  selected: boolean;
  onSelect: () => void;
};

export function ItineraryCard({
  option,
  days,
  selected,
  onSelect,
}: ItineraryCardProps) {
  return (
    <article
      aria-labelledby={`${option.id}-title`}
      className={`group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest transition-all duration-200 ${
        selected
          ? "shadow-md ring-2 ring-primary-container"
          : "ring-1 ring-surface-variant hover:shadow-md hover:ring-on-surface-variant/40"
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-surface-variant">
        <Image
          alt={option.imageAlt}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={option.image}
        />
        {option.recommended ? (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 font-label-sm text-label-sm font-semibold tracking-wide text-primary">
            <MaterialIcon className="text-[14px]" name="recommend" />
            <span>Recommended for you</span>
          </div>
        ) : null}
        <div className="absolute bottom-3 left-3 rounded-full bg-surface-container-lowest/95 px-2.5 py-1 font-label-sm text-label-sm font-medium text-on-surface">
          Pace: {option.pace}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3
            className="font-headline-sm text-headline-sm text-on-surface"
            id={`${option.id}-title`}
          >
            {option.title}
          </h3>
          <p className="mt-1 font-body-sm text-body-sm text-secondary">
            {option.description}
          </p>

          <div className="mt-5 border-b border-surface-variant pb-5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                {option.price}
              </span>
              <span className="font-body-sm text-body-sm text-secondary">
                / person
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-body-sm text-secondary">
              <span>Estimated total trip cost</span>
              <span className="font-label-md text-label-md font-medium text-on-surface">
                {days} days · {option.stopCount} {option.stopDescription}
              </span>
            </div>
          </div>

          <div className="border-b border-surface-variant py-5">
            <h4 className="mb-3 block font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Key Highlights
            </h4>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface">
              {option.highlights.map((highlight) => (
                <li className="flex items-start gap-2.5" key={highlight}>
                  <MaterialIcon
                    className={`mt-0.5 shrink-0 text-[18px] ${
                      selected ? "text-primary-container" : "text-secondary"
                    }`}
                    name="check_circle"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-5">
            <h4 className="mb-3 block font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Day-by-Day Outline
            </h4>
            <ol className="space-y-2 text-body-sm text-secondary">
              {option.dayOutline.slice(0, days).map((activity, index) => (
                <li className="flex items-start gap-2" key={activity}>
                  <span className="w-12 shrink-0 font-semibold text-on-surface">
                    Day {index + 1}:
                  </span>
                  <span>{activity}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 pt-4">
          <button
            aria-pressed={selected}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg border font-label-lg text-label-lg transition-all ${
              selected
                ? "border-primary-container bg-primary-container font-semibold text-on-primary shadow-sm"
                : "border-surface-variant bg-surface-container-lowest font-medium text-on-surface hover:border-primary-container hover:text-primary-container"
            }`}
            onClick={onSelect}
            type="button"
          >
            {selected ? (
              <>
                <MaterialIcon className="text-[18px]" name="check" />
                <span>Selected Plan</span>
              </>
            ) : (
              <span>Choose this plan</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
