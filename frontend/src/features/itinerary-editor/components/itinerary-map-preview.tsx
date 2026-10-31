"use client";

import dynamic from "next/dynamic";
import { useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ItineraryStop } from "./itinerary-stop-card";

// Dynamically import InteractiveMapView to avoid Next.js SSR window is not defined error for Leaflet
const DynamicMap = dynamic(
  () =>
    import("@/components/shared/interactive-map-view").then(
      (mod) => mod.InteractiveMapView,
    ),
  { ssr: false },
);

type ItineraryMapPreviewProps = {
  destination: string;
  stops: ItineraryStop[];
};

export function ItineraryMapPreview({
  destination,
  stops,
}: ItineraryMapPreviewProps) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedStopIdx, setSelectedStopIdx] = useState<number | null>(null);

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }
    setNotice("Route adjustments are a preview; AI custom adjustments will be fully connected in next phase.");
    setPrompt("");
  }

  const mapItems = stops.map((s) => ({
    id: s.id,
    title: s.title,
    time: s.time,
    duration: s.duration,
    category: s.category,
  }));

  return (
    <section
      aria-label={`Interactive map view for ${destination}`}
      className="relative h-full min-h-[620px] w-full overflow-hidden bg-[#e8e4dc]"
    >
      <div className="absolute inset-0">
        <DynamicMap
          destination={destination}
          items={mapItems}
          selectedIndex={selectedStopIdx}
          onSelectIndex={(idx) => setSelectedStopIdx(idx)}
        />
      </div>

      {/* Floating Itinerary Assistant in Map */}
      {isAssistantOpen ? (
        <aside
          aria-label="Itinerary map quick assistance"
          className="absolute bottom-5 right-5 z-20 w-[min(92vw,360px)] rounded-2xl border border-surface-container-highest/90 bg-surface-container-lowest/95 p-4 shadow-xl backdrop-blur-md transition-all sm:bottom-6 sm:right-6"
        >
          <div className="flex items-center justify-between gap-2 border-b border-surface-container-highest/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                <MaterialIcon className="text-[17px]" name="auto_awesome" />
              </span>
              <h3 className="font-label-md text-label-md font-bold text-on-surface">
                Trip Assistant
              </h3>
            </div>
            <button
              aria-label="Hide assistant"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-container"
              onClick={() => setIsAssistantOpen(false)}
              type="button"
            >
              <MaterialIcon className="text-[18px]" name="close" />
            </button>
          </div>

          <p className="mt-2.5 font-body-sm text-body-sm text-secondary">
            {stops.length} {stops.length === 1 ? "stop" : "stops"} mapped for this day in {destination}.
          </p>

          {notice && (
            <p className="mt-2 rounded-lg bg-secondary-container/50 px-2.5 py-1.5 font-label-sm text-label-sm text-primary-container">
              {notice}
            </p>
          )}

          <form className="relative mt-3" onSubmit={submitPrompt}>
            <input
              className="h-10 w-full rounded-xl border border-surface-container-highest bg-surface-container-low px-3 pr-10 font-body-sm text-body-sm text-on-surface placeholder:text-secondary focus:border-primary-container focus:outline-none"
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Suggest nearby lunch spot..."
              value={prompt}
            />
            <button
              aria-label="Send prompt"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container text-on-primary hover:bg-primary-hover"
              type="submit"
            >
              <MaterialIcon className="text-[15px]" name="arrow_forward" />
            </button>
          </form>
        </aside>
      ) : (
        <button
          aria-label="Open trip assistant"
          className="absolute bottom-5 right-5 z-20 flex h-11 items-center gap-2 rounded-full border border-surface-container-highest bg-surface-container-lowest px-4 font-label-md text-label-md font-semibold text-on-surface shadow-md backdrop-blur-md transition-all hover:bg-surface-container"
          onClick={() => setIsAssistantOpen(true)}
          type="button"
        >
          <MaterialIcon className="text-[18px] text-primary-container" name="auto_awesome" />
          Trip Assistant
        </button>
      )}
    </section>
  );
}
