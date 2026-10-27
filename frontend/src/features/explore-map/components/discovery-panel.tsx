"use client";

import Image from "next/image";
import type { ExplorePlace } from "@/features/explore-map/lib/places";

type DiscoveryPanelProps = {
  places: ExplorePlace[];
  selectedPlaceId: string;
  savedIds: string[];
  savedCount: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  onSelectPlace: (placeId: string) => void;
  onToggleSaved: (placeId: string) => void;
  onGoToItinerary: () => void;
};

export function DiscoveryPanel({
  places,
  selectedPlaceId,
  savedIds,
  savedCount,
  expanded,
  onToggleExpanded,
  onSelectPlace,
  onToggleSaved,
  onGoToItinerary,
}: DiscoveryPanelProps) {
  return (
    <aside
      aria-label="Explore places"
      className={`absolute bottom-3 left-3 z-30 flex max-h-[48%] w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_12px_36px_rgba(0,0,0,0.10)] transition-all duration-300 md:bottom-6 md:left-4 md:top-24 md:max-h-none md:w-[360px] ${
        expanded
          ? "translate-x-0 opacity-100"
          : "-translate-x-[calc(100%+1rem)] opacity-0"
      }`}
      inert={!expanded}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-surface-container p-3.5 sm:p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface">
              Discover Jaipur
            </h2>
            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-bold text-primary-container">
              {places.length} featured
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-secondary">
            Curated spots to inspire your journey
          </p>
        </div>
        <button
          aria-label="Collapse discovery list"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
          onClick={onToggleExpanded}
          type="button"
        >
          <span aria-hidden="true" className="text-xl">‹</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center justify-between border-b border-surface-container bg-surface-container-low px-4 py-2.5 text-xs text-secondary">
        <span>
          Sorted by: <strong className="text-on-surface">Recommended</strong>
        </span>
        <span className="font-label-sm text-label-sm font-semibold text-primary-container">
          Near Saved Stops
        </span>
      </div>

      <div
        className="min-h-0 flex-1 touch-pan-y space-y-2 overflow-y-auto overscroll-y-contain p-2 [-webkit-overflow-scrolling:touch]"
        data-lenis-prevent
      >
        {places.length ? (
          places.map((place) => {
            const selected = place.id === selectedPlaceId;
            const saved = place.saved || savedIds.includes(place.id);
            return (
              <article
                className={`rounded-xl p-3 transition-all ${
                  selected
                    ? "border-2 border-primary-container bg-secondary-container/40"
                    : "border border-transparent bg-surface-container-lowest hover:border-outline-variant/60 hover:bg-surface-container-low"
                }`}
                key={place.id}
              >
                <div className="flex gap-3">
                  <button
                    aria-pressed={selected}
                    className="flex min-w-0 flex-1 gap-3 text-left"
                    onClick={() => onSelectPlace(place.id)}
                    type="button"
                  >
                    <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                      <Image
                        alt={place.imageAlt}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={place.image}
                      />
                      <span className="absolute left-1 top-1 rounded bg-surface-container-lowest/90 px-1 py-0.5 text-[9px] font-bold text-primary-container">
                        {place.gem ? "GEM" : place.category.toUpperCase()}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-1">
                        <span className="truncate font-label-lg text-label-lg font-semibold text-on-surface">
                          {place.name}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-on-surface">
                          <span aria-hidden="true" className="text-[#E5A000]">
                            ★
                          </span>{" "}
                          {place.rating}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate font-body-sm text-body-sm text-secondary">
                        {place.distance}
                      </span>
                      <span className="mt-1 block line-clamp-1 font-body-sm text-[12px] text-body">
                        {place.description}
                      </span>
                      <span className="mt-2.5 block truncate text-[11px] font-medium text-tertiary">
                        {place.category}
                      </span>
                    </span>
                  </button>
                  {!place.saved ? (
                  <button
                    aria-label={
                      saved ? `Remove ${place.name} from trip` : `Add ${place.name} to trip`
                    }
                    className={`shrink-0 self-end rounded-lg px-2.5 py-1 font-label-sm text-label-sm font-semibold transition-colors ${
                      saved
                        ? "bg-surface-container text-secondary"
                        : "bg-primary-container text-on-primary hover:bg-primary-hover"
                    }`}
                    onClick={() => onToggleSaved(place.id)}
                    type="button"
                  >
                    {saved ? "In Trip" : "Add"}
                  </button>
                  ) : (
                    <span className="shrink-0 self-end rounded-lg bg-surface-container px-2.5 py-1 font-label-sm text-label-sm font-semibold text-secondary">
                      In Trip
                    </span>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <p className="rounded-xl bg-surface-container-low p-4 font-body-md text-body-md text-secondary">
            No places match your search. Try another name or category.
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-surface-container bg-surface-container-lowest p-3">
        <span className="flex items-center gap-2 font-body-sm text-body-sm font-medium text-secondary">
          <span className="h-2 w-2 rounded-full bg-primary-container" />
          {savedCount} stops in your trip
        </span>
        <button
          className="inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary-container hover:underline"
          onClick={onGoToItinerary}
          type="button"
        >
          Go to Itinerary <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
}
