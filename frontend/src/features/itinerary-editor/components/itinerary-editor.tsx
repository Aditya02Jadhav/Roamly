"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { TripStepProgress } from "@/components/shared/trip-step-progress";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ItineraryOption } from "@/features/itinerary-selection/components/itinerary-options";
import {
  serializeTripPreferences,
  type TripPreferencesValues,
} from "@/features/trip-preferences/lib/preferences-query";
import { ItineraryMapPreview } from "./itinerary-map-preview";
import { ItineraryStopCard, type ItineraryStop } from "./itinerary-stop-card";

type ItineraryEditorProps = {
  option: ItineraryOption;
  preferences: TripPreferencesValues;
};

const suggestedAdjustments = [
  "Make the day more relaxed",
  "Find hidden gems",
  "Reduce travel time",
] as const;

function getTripDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1);
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateValue}T00:00:00Z`));
}

function createDays(
  option: ItineraryOption,
  dayCount: number,
): ItineraryStop[][] {
  return Array.from({ length: dayCount }, (_, dayIndex) => {
    if (dayIndex === 0) {
      const times = ["9:00 AM", "10:30 AM", "12:15 PM", "1:30 PM"];
      return option.highlights.map((highlight, index) => ({
        id: `day-${dayIndex + 1}-stop-${index + 1}`,
        title: highlight,
        time: times[index] ?? "Flexible",
        duration: index === 0 ? "1 hour" : "1–1.5 hours",
        category: index === 0 ? "Trip highlight" : "Plan highlight",
        description: `A featured experience from your ${option.title.toLowerCase()} plan.`,
      }));
    }

    const outline = option.dayOutline[dayIndex];
    return [
      {
        id: `day-${dayIndex + 1}-stop-1`,
        title: outline ?? "Open time to explore",
        time: "Flexible",
        duration: "At your own pace",
        category: outline ? "Day outline" : "Flexible time",
        description: outline
          ? option.description
          : "Keep this day open and decide what feels right while you travel.",
      },
    ];
  });
}

function formatShortDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateValue}T00:00:00Z`));
}

export function ItineraryEditor({
  option,
  preferences,
}: ItineraryEditorProps) {
  const tripDays = getTripDays(preferences.startDate, preferences.endDate);
  const [itinerary, setItinerary] = useState(() =>
    createDays(option, tripDays),
  );
  const [activeDay, setActiveDay] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const addedStopCount = useRef(0);
  const activeStops = itinerary[activeDay] ?? [];
  const dayTitle =
    option.dayOutline[activeDay] ?? "Open time to explore";
  const plansHref = (() => {
    const params = new URLSearchParams(serializeTripPreferences(preferences));
    params.set("plan", option.id);
    return `/trips/new?${params.toString()}`;
  })();

  function updateActiveStops(
    update: (stops: ItineraryStop[]) => ItineraryStop[],
  ) {
    setItinerary((current) =>
      current.map((stops, index) =>
        index === activeDay ? update(stops) : stops,
      ),
    );
  }

  function moveStop(index: number, direction: -1 | 1) {
    updateActiveStops((stops) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= stops.length) {
        return stops;
      }

      const reordered = [...stops];
      [reordered[index], reordered[targetIndex]] = [
        reordered[targetIndex],
        reordered[index],
      ];
      return reordered;
    });
  }

  function addStop() {
    addedStopCount.current += 1;
    updateActiveStops((stops) => [
      ...stops,
      {
        id: `added-stop-${addedStopCount.current}`,
        title: "Free time to explore",
        time: "Flexible",
        duration: "At your own pace",
        category: "Your addition",
        description: "Rename this stop to make it your own.",
      },
    ]);
    setNotice("A flexible stop was added to this day.");
  }

  function updateStopTitle(stopId: string, title: string) {
    updateActiveStops((stops) =>
      stops.map((stop) =>
        stop.id === stopId ? { ...stop, title } : stop,
      ),
    );
  }

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    setNotice(
      "AI itinerary adjustments are not connected yet. Your itinerary has not been changed.",
    );
    setPrompt("");
  }

  return (
    <>
      <Navbar activeItem="my-trips" />
      <main className="min-h-screen w-full flex-1 bg-surface-container-lowest pt-16">
        <div className="mx-auto max-w-[1440px] px-gutter-mobile sm:px-gutter">
          <TripStepProgress currentStep={3} variant="compact" />
        </div>

        <div className="mx-auto flex w-full max-w-[1440px] flex-col bg-surface-container-lowest lg:min-h-[calc(100vh-64px)] lg:flex-row">
          <section
            aria-labelledby="itinerary-heading"
            className="flex w-full shrink-0 flex-col border-r border-surface-container-highest/80 bg-surface-container-lowest lg:h-[calc(100vh-64px)] lg:min-h-0 lg:w-[43%] lg:overflow-y-auto lg:overscroll-y-contain lg:touch-pan-y lg:[-webkit-overflow-scrolling:touch]"
            data-lenis-prevent
          >
            <header className="sticky top-16 z-20 border-b border-surface-container-highest/60 bg-surface-container-lowest p-space-lg pb-space-md lg:static lg:p-space-xl lg:pb-space-md">
              <div className="mb-space-sm flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 font-label-md text-label-md font-semibold text-on-surface">
                  <MaterialIcon
                    className="text-[15px] text-primary-container"
                    name="location_on"
                  />
                  {preferences.destination}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-1 font-label-md text-label-md text-secondary">
                  {option.title}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-1 font-label-md text-label-md text-secondary">
                  {option.pace} pace
                </span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1
                    className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface"
                    id="itinerary-heading"
                  >
                    Your {option.title} itinerary
                  </h1>
                  <p className="mt-1 font-body-md text-body-md text-secondary">
                    A first draft shaped around your trip. Make it yours.
                  </p>
                  <p className="mt-2 font-label-md text-label-md text-secondary">
                    {formatShortDate(preferences.startDate)} –{" "}
                    {formatShortDate(preferences.endDate)} · {tripDays}{" "}
                    {tripDays === 1 ? "day" : "days"} · {option.price}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    className="inline-flex h-10 items-center gap-1 rounded-xl border border-surface-container-highest px-2.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low sm:px-space-md"
                    href={plansHref}
                  >
                    <MaterialIcon className="text-[16px]" name="arrow_back" />
                    Plans
                  </Link>
                  <button
                    className="hidden h-10 items-center gap-1.5 rounded-xl border border-on-surface px-space-md font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low sm:inline-flex"
                    onClick={() =>
                      setNotice(
                        "Regenerating plans is not connected yet. Your selected plan is unchanged.",
                      )
                    }
                    type="button"
                  >
                    <MaterialIcon className="text-[17px]" name="shuffle" />
                    Regenerate
                  </button>
                  <button
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-container px-space-md font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-hover"
                    onClick={() =>
                      setNotice(
                        "Trip saving will be available when accounts are connected.",
                      )
                    }
                    type="button"
                  >
                    <MaterialIcon className="text-[17px]" name="check" />
                    Save trip
                  </button>
                </div>
              </div>

              <div
                aria-label="Itinerary days"
                className="no-scrollbar mt-space-md flex items-center gap-2 overflow-x-auto pt-space-sm"
                role="tablist"
              >
                {itinerary.map((_, index) => {
                  const selected = activeDay === index;
                  const title =
                    option.dayOutline[index] ?? "Flexible day";
                  return (
                    <button
                      aria-selected={selected}
                      aria-controls="itinerary-day-panel"
                      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 font-label-md text-label-md transition-colors ${
                        selected
                          ? "border-outline-variant/60 bg-secondary-container font-bold text-primary-container shadow-sm"
                          : "border-transparent bg-surface-container-low text-secondary hover:bg-surface-container hover:text-on-surface"
                      }`}
                      id={`day-tab-${index}`}
                      key={`${index}-${title}`}
                      onClick={() => setActiveDay(index)}
                      role="tab"
                      type="button"
                    >
                      {selected ? (
                        <span className="h-2 w-2 rounded-full bg-primary-container" />
                      ) : null}
                      Day {index + 1} · {title}
                    </button>
                  );
                })}
              </div>
            </header>

            {notice ? (
              <p
                aria-live="polite"
                className="mx-space-lg mt-4 rounded-lg border border-surface-container-highest bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface lg:mx-space-xl"
                role="status"
              >
                {notice}
              </p>
            ) : null}

            <div
              aria-labelledby={`day-tab-${activeDay}`}
              className="flex flex-col gap-0 p-space-lg lg:p-space-xl"
              id="itinerary-day-panel"
              role="tabpanel"
            >
              <div className="sr-only">{dayTitle}</div>
              {activeStops.length > 0 ? (
                activeStops.map((stop, index) => (
                  <div key={stop.id}>
                    <ItineraryStopCard
                      active={index === 0}
                      canMoveDown={index < activeStops.length - 1}
                      index={index}
                      onMoveDown={() => moveStop(index, 1)}
                      onMoveUp={() => moveStop(index, -1)}
                      onRemove={() => {
                        updateActiveStops((stops) =>
                          stops.filter((item) => item.id !== stop.id),
                        );
                        setNotice(`${stop.title} was removed from this day.`);
                      }}
                      onRename={(title) => updateStopTitle(stop.id, title)}
                      stop={stop}
                    />
                    {index < activeStops.length - 1 ? (
                      <div className="flex items-center gap-2 py-2.5 pl-6 font-label-sm text-label-sm text-secondary">
                        <span
                          aria-hidden="true"
                          className="mr-2 h-6 w-0.5 border-l-2 border-dashed border-outline-variant"
                        />
                        <span className="inline-flex items-center gap-1 rounded-full border border-surface-container-highest/60 bg-surface-container-low px-2 py-0.5">
                          <MaterialIcon
                            className="text-[14px]"
                            name="directions_walk"
                          />
                          Continue to next stop
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-surface-container-low p-4 font-body-md text-body-md text-secondary">
                  No stops are planned for this day yet. Add one when you are
                  ready.
                </p>
              )}

              <div className="mt-space-lg flex flex-col gap-space-md">
                <button
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant font-label-md text-label-md text-on-surface transition-colors hover:border-primary-container hover:bg-secondary-container/20 hover:text-primary-container"
                  onClick={addStop}
                  type="button"
                >
                  <MaterialIcon className="text-xl" name="add" />
                  Add a place
                </button>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-container-low p-3.5 font-label-md text-label-md text-secondary">
                  <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <MaterialIcon
                      className="text-[18px] text-primary-container"
                      name="recommend"
                    />
                    Day {activeDay + 1} summary
                  </span>
                  <span>
                    {activeStops.length}{" "}
                    {activeStops.length === 1 ? "stop" : "stops"} ·{" "}
                    {dayTitle}
                  </span>
                </div>
              </div>

              <section
                aria-labelledby="adjustments-heading"
                className="mb-space-lg mt-space-xl flex flex-col gap-space-sm rounded-xl border border-surface-container-highest bg-surface-container-low p-space-md"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                    <MaterialIcon className="text-[18px]" name="auto_awesome" />
                  </span>
                  <h2
                    className="font-label-lg text-label-lg font-bold text-on-surface"
                    id="adjustments-heading"
                  >
                    Want to change anything?
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedAdjustments.map((adjustment) => (
                    <button
                      className="rounded-full border border-surface-container-highest bg-surface-container-lowest px-2.5 py-1 font-label-sm text-label-sm text-on-surface transition-colors hover:border-primary-container hover:text-primary-container"
                      key={adjustment}
                      onClick={() => setPrompt(adjustment)}
                      type="button"
                    >
                      {adjustment}
                    </button>
                  ))}
                </div>
                <form className="relative mt-1" onSubmit={submitPrompt}>
                  <label className="sr-only" htmlFor="itinerary-prompt">
                    Request an itinerary adjustment
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-surface-container-highest bg-surface-container-lowest py-2 pl-3.5 pr-12 font-body-md text-body-md text-on-surface shadow-xs placeholder:text-secondary focus:border-on-surface focus:outline-none"
                    id="itinerary-prompt"
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Ask Roamly to adjust your trip..."
                    value={prompt}
                  />
                  <button
                    aria-label="Submit adjustment request"
                    className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary-container text-on-primary transition-colors hover:bg-primary-hover"
                    type="submit"
                  >
                    <MaterialIcon
                      className="text-[18px]"
                      name="arrow_forward"
                    />
                  </button>
                </form>
                <p className="font-body-sm text-body-sm text-secondary">
                  Suggestions are a preview; AI itinerary changes are not
                  connected yet.
                </p>
              </section>

            </div>
          </section>

          <div className="w-full bg-[#f4f3f0] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:w-[57%]">
            <ItineraryMapPreview
              destination={preferences.destination}
              stops={activeStops}
            />
          </div>
        </div>
        <p className="sr-only">
          Trip dates: {formatDate(preferences.startDate)} to{" "}
          {formatDate(preferences.endDate)}.
        </p>
      </main>
      <Footer />
    </>
  );
}
