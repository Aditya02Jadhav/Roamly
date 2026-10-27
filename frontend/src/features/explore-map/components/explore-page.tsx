"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { MaterialIcon } from "@/components/ui/material-icon";
import {
  explorePlaces,
  placeCategories,
  type ExplorePlace,
  type PlaceCategory,
} from "@/features/explore-map/lib/places";
import { ExploreMapCanvas } from "./explore-map-canvas";
import { DiscoveryPanel } from "./discovery-panel";

function MapSearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
      <path d="M8 10.8h5.6M10.8 8v5.6" />
    </svg>
  );
}

function SelectedPlaceCard({
  place,
  saved,
  onClose,
  onToggleSaved,
}: {
  place: ExplorePlace;
  saved: boolean;
  onClose: () => void;
  onToggleSaved: () => void;
}) {
  return (
    <article
      aria-label={`${place.title} details`}
      className="absolute bottom-24 left-3 right-3 z-30 max-h-[42%] overflow-y-auto rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-[0_16px_40px_rgba(0,0,0,0.14)] sm:bottom-6 sm:left-auto sm:right-16 sm:max-h-[min(70vh,540px)] sm:w-full sm:max-w-[420px]"
    >
      <div className="relative h-36 w-full overflow-hidden bg-surface-container sm:h-44">
        <Image
          alt={place.imageAlt}
          className="object-cover transition-transform duration-500 hover:scale-105"
          fill
          sizes="(min-width: 640px) 420px, calc(100vw - 24px)"
          src={place.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <button
          aria-label="Close place preview"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/80 text-on-surface shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-container-lowest"
          onClick={onClose}
          type="button"
        >
          <MaterialIcon className="text-[18px]" name="close" />
        </button>
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-on-primary shadow-sm">
          <MaterialIcon className="text-[12px]" name="auto_awesome" />
          {place.badge}
        </span>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h2 className="font-headline-sm text-headline-sm font-bold drop-shadow-sm">
            {place.title}
          </h2>
          <p className="flex items-center gap-1 font-body-sm text-body-sm text-white/90 drop-shadow-sm">
            <MaterialIcon className="text-[14px]" name="location_on" />
            {place.location}
          </p>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="flex items-center gap-0.5 text-[#E5A000]">
              <span aria-hidden="true">★</span>
              <span className="text-sm text-on-surface">{place.rating}</span>
            </span>
            <span className="text-secondary">(Local favorite)</span>
          </div>
          <span className="flex items-center gap-1 font-medium text-tertiary">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
            Hours may vary
          </span>
        </div>
        <p className="font-body-md text-body-md leading-relaxed text-body">
          {place.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {place.tags.map((tag) => (
            <span
              className="rounded-md bg-surface-container px-2.5 py-0.5 font-label-sm text-label-sm text-secondary"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            aria-pressed={saved}
            className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl font-label-md text-label-md font-semibold shadow-sm transition-colors ${
              saved
                ? "bg-tertiary text-on-primary hover:bg-tertiary-container"
                : "bg-primary-container text-on-primary hover:bg-primary-hover"
            }`}
            onClick={onToggleSaved}
            type="button"
          >
            <MaterialIcon
              className="text-[18px]"
              name={saved ? "check" : "add"}
            />
            {saved ? "Added to Trip" : "Add to Trip"}
          </button>
          <a
            className="flex h-11 items-center gap-1 rounded-xl border border-on-surface/20 px-3 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, Jaipur`)}`}
            rel="noreferrer"
            target="_blank"
          >
            Directions
            <MaterialIcon className="text-[16px]" name="arrow_forward" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function ExplorePage() {
  const router = useRouter();
  const [selectedPlaceId, setSelectedPlaceId] = useState("nahargarh");
  const [activeCategories, setActiveCategories] = useState<PlaceCategory[]>([]);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isAiTrayOpen, setIsAiTrayOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visiblePlaces = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return explorePlaces.filter((place) => {
      const matchesCategory =
        activeCategories.length === 0 ||
        activeCategories.includes(place.category);
      const matchesSearch =
        !normalizedSearch ||
        `${place.name} ${place.title} ${place.category} ${place.location}`
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, searchQuery]);
  const selectedPlace = explorePlaces.find(
    (place) => place.id === selectedPlaceId,
  );
  const selectedSaved = Boolean(
    selectedPlace &&
      (selectedPlace.saved || savedIds.includes(selectedPlace.id)),
  );
  const savedCount = 4 + savedIds.filter(
    (id) => !explorePlaces.find((place) => place.id === id)?.saved,
  ).length;

  function selectPlace(placeId: string) {
    setSelectedPlaceId(placeId);
  }

  function toggleSaved(placeId: string) {
    const place = explorePlaces.find((item) => item.id === placeId);
    if (!place || place.saved) {
      return;
    }
    const alreadySaved = savedIds.includes(placeId);
    setSavedIds((current) =>
      alreadySaved
        ? current.filter((id) => id !== placeId)
        : [...current, placeId],
    );
    setNotice(
      alreadySaved
        ? `${place.name} removed from this trip.`
        : `${place.name} added to this trip.`,
    );
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchQuery(query);
    setIsSidebarOpen(true);
  }

  function searchForSuggestion(text: string) {
    setQuery(text);
    setSearchQuery(text);
    const place = explorePlaces.find((candidate) =>
      `${candidate.name} ${candidate.title} ${candidate.category}`
        .toLowerCase()
        .includes(text.toLowerCase().split(" ")[0]),
    );
    if (place) {
      selectPlace(place.id);
    }
    setIsAiTrayOpen(false);
    setIsSidebarOpen(true);
  }

  return (
    <>
      <Navbar activeItem="explore" />
      <main className="min-h-screen bg-surface-container-lowest pt-16">
        <div className="relative h-[calc(100svh-4rem)] min-h-[700px] overflow-hidden bg-surface-container-lowest font-body-md text-on-surface">
          <ExploreMapCanvas
            onResetZoom={() => setZoom(1)}
            onSelectPlace={selectPlace}
            onZoom={(direction) =>
              setZoom((current) =>
                Math.max(0.8, Math.min(1.5, current + direction * 0.1)),
              )
            }
            places={visiblePlaces}
            savedIds={savedIds}
            selectedPlaceId={selectedPlaceId}
            zoom={zoom}
          />

          <header className="pointer-events-none absolute left-3 right-3 top-3 z-40 flex flex-col items-center sm:left-4 sm:right-4 sm:top-4">
            <div className="pointer-events-auto flex w-full max-w-4xl flex-col items-center gap-2 sm:gap-3">
              <form
                className="flex w-full items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-container-lowest p-1.5 pl-3 shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all focus-within:border-on-surface focus-within:shadow-[0_10px_32px_rgba(0,0,0,0.12)] sm:gap-2 sm:pl-4"
                onSubmit={submitSearch}
                role="search"
              >
                <MapSearchIcon className="h-[22px] w-[22px] shrink-0 text-primary-container" />
                <label className="sr-only" htmlFor="explore-search">
                  Search places in Jaipur
                </label>
                <input
                  className="min-w-0 flex-1 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none"
                  id="explore-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search attractions, authentic cafés, artisan havelis..."
                  value={query}
                />
                {query ? (
                  <button
                    aria-label="Clear search"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container"
                    onClick={() => {
                      setQuery("");
                      setSearchQuery("");
                    }}
                    type="button"
                  >
                    <MaterialIcon className="text-[18px]" name="close" />
                  </button>
                ) : null}
                <button
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary-container px-3 font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-hover sm:h-10 sm:px-5"
                  type="submit"
                >
                  <MaterialIcon className="text-[18px]" name="explore" />
                  <span>Explore</span>
                </button>
              </form>

              <div
                aria-label="Filter places by category"
                className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto px-1 py-1"
                data-lenis-prevent
                role="group"
              >
                <button
                  aria-pressed={activeCategories.length === 0}
                  className={`flex h-[38px] shrink-0 items-center gap-1.5 rounded-full px-4 font-label-md text-label-md font-semibold shadow-sm transition-colors ${
                    activeCategories.length === 0
                      ? "bg-primary-container text-on-primary"
                      : "border border-outline-variant/60 bg-surface-container-lowest text-on-surface"
                  }`}
                  onClick={() => setActiveCategories([])}
                  type="button"
                >
                  <span aria-hidden="true">▦</span>
                  All Places ({explorePlaces.length})
                </button>
                {placeCategories.map((category) => (
                  <button
                    aria-pressed={activeCategories.includes(category.name)}
                    className={`flex h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-4 font-label-md text-label-md shadow-sm transition-colors ${
                      activeCategories.includes(category.name)
                        ? "border-primary-container/30 bg-secondary-container font-semibold text-primary-container"
                        : "border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-on-surface"
                    }`}
                    key={category.name}
                    onClick={() => {
                      setActiveCategories((current) =>
                        current.includes(category.name)
                          ? current.filter((item) => item !== category.name)
                          : [...current, category.name],
                      );
                    }}
                    type="button"
                  >
                    <MaterialIcon
                      className={`text-[16px] ${category.color}`}
                      name="explore"
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {!isSidebarOpen ? (
            <button
              aria-label="Open discovery list"
              className="absolute left-3 top-40 z-30 flex h-10 items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 text-on-surface shadow-md sm:left-4"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              <span aria-hidden="true">›</span>
              Discover places
            </button>
          ) : null}
          <DiscoveryPanel
            expanded={isSidebarOpen}
            onGoToItinerary={() => router.push("/trips/new")}
            onSelectPlace={selectPlace}
            onToggleExpanded={() => setIsSidebarOpen(false)}
            onToggleSaved={toggleSaved}
            places={visiblePlaces}
            savedCount={savedCount}
            savedIds={savedIds}
            selectedPlaceId={selectedPlaceId}
          />

          {selectedPlace ? (
            <SelectedPlaceCard
              onClose={() => setSelectedPlaceId("")}
              onToggleSaved={() => toggleSaved(selectedPlace.id)}
              place={selectedPlace}
              saved={Boolean(selectedSaved)}
            />
          ) : null}

          <div className="absolute bottom-4 left-1/2 z-30 flex w-[calc(100%-1.5rem)] -translate-x-1/2 flex-col items-center gap-2 sm:bottom-6 sm:w-auto">
            {isAiTrayOpen ? (
              <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest/95 p-1.5 shadow-xl backdrop-blur-md">
                {([
                  { label: "Quiet sunset spots", query: "sunset", icon: "wb_twilight" },
                  { label: "Authentic street food", query: "cafe", icon: "coffee" },
                  { label: "Craft artisan workshops", query: "museum", icon: "auto_awesome" },
                ] as const).map((suggestion) => (
                  <button
                    className="flex items-center gap-1.5 rounded-xl bg-surface-container px-3 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                    key={suggestion.query}
                    onClick={() => searchForSuggestion(suggestion.query)}
                    type="button"
                  >
                    <MaterialIcon
                      className="text-[14px] text-primary-container"
                      name={suggestion.icon}
                    />
                    {suggestion.label}
                  </button>
                ))}
              </div>
            ) : null}
            <button
              aria-expanded={isAiTrayOpen}
              className="flex h-11 max-w-full items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all hover:border-primary-container sm:px-5"
              onClick={() => setIsAiTrayOpen((open) => !open)}
              type="button"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-container text-primary-container">
                <MaterialIcon className="text-[15px]" name="auto_awesome" />
              </span>
              <span className="truncate font-label-md text-label-md font-semibold text-on-surface">
                Discover hidden spots in this map view
              </span>
              <span className="rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                AI
              </span>
            </button>
          </div>

          {notice ? (
            <p
              aria-live="polite"
              className="absolute left-1/2 top-[190px] z-50 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-lg border border-surface-container-highest bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface shadow-md sm:top-28"
              role="status"
            >
              {notice}
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}
