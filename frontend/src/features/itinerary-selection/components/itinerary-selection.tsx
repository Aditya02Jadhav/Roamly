"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TripStepProgress } from "@/components/shared/trip-step-progress";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { TripPreferencesValues } from "@/features/trip-preferences/lib/preferences-query";
import { serializeTripPreferences } from "@/features/trip-preferences/lib/preferences-query";
import { ItineraryCard } from "@/features/itinerary-selection/components/itinerary-card";
import { ItinerarySelectionDock } from "@/features/itinerary-selection/components/itinerary-selection-dock";
import {
  itineraryOptions,
  type ItineraryOption,
} from "@/features/itinerary-selection/components/itinerary-options";

type ItinerarySelectionProps = {
  preferences: TripPreferencesValues;
  initialSelectedPlan?: string;
};

const budgetLabels: Record<string, string> = {
  "budget-friendly": "₹1,500 – ₹3,000",
  moderate: "₹3,000 – ₹7,000",
  comfort: "₹7,000 – ₹15,000",
  premium: "₹15,000+",
};

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

export function ItinerarySelection({
  preferences,
  initialSelectedPlan = "balanced",
}: ItinerarySelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
  const tripDays = getTripDays(preferences.startDate, preferences.endDate);
  const selectedOption = useMemo(
    () =>
      itineraryOptions.find((option) => option.id === selectedPlan) ??
      itineraryOptions[0],
    [selectedPlan],
  );
  const preferencesQuery = serializeTripPreferences(preferences);

  function getCustomizeHref(option: ItineraryOption) {
    const params = new URLSearchParams(preferencesQuery);
    params.set("plan", option.id);
    return `/trips/new/explore?${params.toString()}`;
  }

  return (
    <>
      <Navbar activeItem="my-trips" />

      <main className="min-h-screen w-full flex-1 bg-surface-container-lowest pt-16">
        <div className="mx-auto w-full max-w-[1440px] px-gutter-mobile pb-16 sm:px-gutter md:px-8">
          <TripStepProgress currentStep={2} variant="compact" />

          <section className="pt-8 pb-4">
            <div className="max-w-2xl">
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface md:text-display-hero">
                Your trip, your way.
              </h1>
              <p className="mt-2 font-body-lg text-body-lg text-secondary">
                We created a few itinerary options based on your preferences.
                Choose the one that feels right for you.
              </p>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-surface-container-low px-5 py-3.5 md:flex-row md:items-center">
              <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface">
                  <MaterialIcon
                    className="text-[18px] text-primary-container"
                    name="location_on"
                  />
                  <dt className="sr-only">Destination</dt>
                  <dd className="font-semibold">{preferences.destination}</dd>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-surface-variant sm:block"
                />
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-secondary">
                  <MaterialIcon
                    className="text-[18px] text-secondary"
                    name="calendar_today"
                  />
                  <dt className="sr-only">Travel dates</dt>
                  <dd>
                    {tripDays} days, {tripDays - 1} nights
                    <span className="sr-only">
                      {" "}
                      ({formatDate(preferences.startDate)} to{" "}
                      {formatDate(preferences.endDate)})
                    </span>
                  </dd>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-surface-variant sm:block"
                />
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-secondary">
                  <MaterialIcon
                    className="text-[18px] text-secondary"
                    name="group"
                  />
                  <dt className="sr-only">Travellers</dt>
                  <dd>
                    {preferences.adults}{" "}
                    {preferences.adults === 1 ? "adult" : "adults"}
                    {preferences.children > 0
                      ? `, ${preferences.children} ${
                          preferences.children === 1 ? "child" : "children"
                        }`
                      : ""}
                  </dd>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-surface-variant sm:block"
                />
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-secondary">
                  <MaterialIcon
                    className="text-[18px] text-secondary"
                    name="account_balance_wallet"
                  />
                  <dt className="sr-only">Daily budget target</dt>
                  <dd>Target: {budgetLabels[preferences.budget]} / person</dd>
                </div>
              </dl>
              <Link
                className="inline-flex items-center gap-1.5 self-start font-label-md text-label-md text-secondary transition-colors hover:text-primary md:self-auto"
                href={`/preferences?${preferencesQuery}`}
              >
                <MaterialIcon className="text-[16px]" name="edit" />
                <span>Edit preferences</span>
              </Link>
            </div>
          </section>

          <section aria-labelledby="travel-style-heading" className="pt-8 pb-6">
            <h2
              className="font-headline-md text-headline-md text-on-surface"
              id="travel-style-heading"
            >
              Choose your travel style
            </h2>
            <p className="mt-1 font-body-md text-body-md text-secondary">
              Compare your options and customize your favorite.
            </p>
          </section>

          <section
            aria-label="Itinerary options"
            className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3"
          >
            {itineraryOptions.map((option) => (
              <ItineraryCard
                days={tripDays}
                key={option.id}
                onSelect={() => setSelectedPlan(option.id)}
                option={option}
                selected={selectedPlan === option.id}
              />
            ))}
          </section>

          <ItinerarySelectionDock
            customizeHref={getCustomizeHref(selectedOption)}
            option={selectedOption}
            preferencesHref={`/preferences?${preferencesQuery}`}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
