"use client";

import dynamic from "next/dynamic";
import type { ExplorePlace } from "@/features/explore-map/lib/places";

const DynamicMap = dynamic(
  () =>
    import("@/components/shared/interactive-map-view").then(
      (mod) => mod.InteractiveMapView,
    ),
  { ssr: false },
);

type ExploreMapCanvasProps = {
  places: ExplorePlace[];
  selectedPlaceId: string;
  zoom?: number;
  savedIds?: string[];
  onSelectPlace: (placeId: string) => void;
  onResetZoom?: () => void;
  onZoom?: (direction: -1 | 1) => void;
};

export function ExploreMapCanvas({
  places,
  selectedPlaceId,
  onSelectPlace,
}: ExploreMapCanvasProps) {
  const selectedIdx = places.findIndex((p) => p.id === selectedPlaceId);

  const mapItems = places.map((place) => ({
    id: place.id,
    title: place.title,
    category: place.category,
    time: place.location,
    duration: place.distance,
  }));

  return (
    <div
      aria-label="Interactive explore map"
      className="absolute inset-0 overflow-hidden bg-[#F4F1EA]"
    >
      <DynamicMap
        destination="Jaipur, India"
        items={mapItems}
        selectedIndex={selectedIdx >= 0 ? selectedIdx : undefined}
        onSelectIndex={(idx) => {
          if (places[idx]) {
            onSelectPlace(places[idx].id);
          }
        }}
      />
    </div>
  );
}
