"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { TripSummaryResponse } from "@/lib/api";

type TripOverviewClientProps = {
  summary: TripSummaryResponse;
};

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateValue}T00:00:00Z`));
}

export function TripOverviewClient({ summary }: TripOverviewClientProps) {
  const [copied, setCopied] = useState(false);
  const { preferences, selectedOption, stats, days, tripId } = summary;

  const travellerLabel = `${preferences.adults} ${
    preferences.adults === 1 ? "adult" : "adults"
  }${
    preferences.children > 0
      ? `, ${preferences.children} ${
          preferences.children === 1 ? "child" : "children"
        }`
      : ""
  }`;

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-gutter-mobile py-8 sm:px-gutter sm:py-12">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-container-highest/80 bg-surface-container-low p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1 font-label-md text-label-md font-semibold text-primary-container">
              <MaterialIcon className="text-[16px]" name="explore" />
              Trip Itinerary
            </span>
            <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 font-label-md text-label-md text-secondary">
              {summary.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleShare}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container"
              type="button"
            >
              <MaterialIcon
                className="text-[17px]"
                name={copied ? "check" : "bolt"}
              />
              {copied ? "Link Copied!" : "Share Link"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container"
              type="button"
            >
              <MaterialIcon className="text-[17px]" name="offline_pin" />
              Print
            </button>
            <Link
              href={`/trips/${tripId}/explore`}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-container px-4 font-label-md text-label-md font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover"
            >
              <MaterialIcon className="text-[17px]" name="edit" />
              Customize
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="font-headline-lg text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
            {summary.destination}
          </h1>
          <p className="mt-2 font-body-lg text-body-lg text-secondary">
            {formatDate(preferences.startDate)} – {formatDate(preferences.endDate)} ·{" "}
            {stats.total_days} {stats.total_days === 1 ? "day" : "days"} ·{" "}
            {selectedOption?.title ?? "Tailored"} Plan
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-surface-container-highest/60 bg-surface-container-lowest p-4">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary">
              <MaterialIcon className="text-[16px] text-primary-container" name="calendar_today" />
              Duration
            </div>
            <div className="mt-1 font-headline-sm text-headline-sm font-bold text-on-surface">
              {stats.total_days} {stats.total_days === 1 ? "Day" : "Days"}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-container-highest/60 bg-surface-container-lowest p-4">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary">
              <MaterialIcon className="text-[16px] text-primary-container" name="location_on" />
              Total Places
            </div>
            <div className="mt-1 font-headline-sm text-headline-sm font-bold text-on-surface">
              {stats.total_stops} {stats.total_stops === 1 ? "Stop" : "Stops"}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-container-highest/60 bg-surface-container-lowest p-4">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary">
              <MaterialIcon className="text-[16px] text-primary-container" name="group" />
              Travellers
            </div>
            <div className="mt-1 font-label-lg text-label-lg font-bold text-on-surface truncate" title={travellerLabel}>
              {travellerLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-container-highest/60 bg-surface-container-lowest p-4">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary">
              <MaterialIcon className="text-[16px] text-primary-container" name="account_balance_wallet" />
              Budget & Style
            </div>
            <div className="mt-1 font-label-lg text-label-lg font-bold capitalize text-on-surface">
              {preferences.totalBudget
                ? `₹${preferences.totalBudget.toLocaleString("en-IN")} total · `
                : ""}
              {preferences.budget} · {preferences.pace}
            </div>
          </div>
        </div>
      </div>

      {/* Days Timeline Section */}
      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Day-by-Day Schedule
          </h2>
          <span className="font-label-md text-label-md text-secondary">
            {stats.total_days} days planned
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {days.map((day) => (
            <div
              key={day.id}
              className="rounded-3xl border border-surface-container-highest/70 bg-surface-container-lowest p-6 sm:p-8 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-highest/60 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container font-label-md text-label-md font-bold text-on-primary">
                    {day.day_number}
                  </span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Day {day.day_number}: {day.title}
                    </h3>
                    <p className="font-label-sm text-label-sm text-secondary">
                      {formatDate(day.date)}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-container-low px-3 py-1 font-label-sm text-label-sm text-secondary">
                  {day.stops.length} {day.stops.length === 1 ? "place" : "places"}
                </span>
              </div>

              {day.stops.length > 0 ? (
                <div className="mt-6 flex flex-col gap-4">
                  {day.stops.map((stop, sIndex) => (
                    <div
                      key={stop.id}
                      className="group relative flex gap-4 rounded-2xl border border-surface-container-highest/50 bg-surface-container-low/50 p-4 transition-colors hover:bg-surface-container-low"
                    >
                      <div className="flex flex-col items-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container font-label-sm text-label-sm font-semibold text-primary-container">
                          {sIndex + 1}
                        </span>
                        {sIndex < day.stops.length - 1 && (
                          <span className="mt-2 h-full w-0.5 border-l border-dashed border-outline-variant" />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-center">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                            {stop.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-highest/60 px-2.5 py-0.5 font-label-sm text-label-sm text-on-surface">
                              <MaterialIcon className="text-[13px]" name="calendar_today" />
                              {stop.time}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-highest/60 px-2.5 py-0.5 font-label-sm text-label-sm text-secondary">
                              <MaterialIcon className="text-[13px]" name="bolt" />
                              {stop.duration}
                            </span>
                          </div>
                        </div>

                        {stop.description && (
                          <p className="mt-1.5 font-body-sm text-body-sm text-secondary">
                            {stop.description}
                          </p>
                        )}

                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-md bg-surface-container-lowest px-2 py-0.5 font-label-sm text-[12px] text-secondary">
                            {stop.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-xl bg-surface-container-low p-4 font-body-md text-body-md text-secondary">
                  No stops added for this day yet.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
