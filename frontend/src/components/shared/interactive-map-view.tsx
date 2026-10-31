"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Safeguard Leaflet against destroyed DOM nodes during animations/re-renders
if (typeof window !== "undefined" && L && L.DomUtil) {
  const originalGetPosition = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el: HTMLElement) {
    if (!el) {
      return new L.Point(0, 0);
    }
    try {
      return originalGetPosition.call(this, el) || new L.Point(0, 0);
    } catch {
      return new L.Point(0, 0);
    }
  };
}

export type MapCoordinate = {
  lat: number;
  lng: number;
};

export type MapMarkerItem = {
  id: string;
  title: string;
  category?: string;
  time?: string;
  duration?: string;
  coordinates?: MapCoordinate | null;
};

type InteractiveMapViewProps = {
  destination: string;
  items: MapMarkerItem[];
  selectedIndex?: number | null;
  onSelectIndex?: (index: number) => void;
};

// Known destination coordinates cache
const DESTINATION_COORDS: Record<string, MapCoordinate> = {
  "spain": { lat: 40.4168, lng: -3.7038 },
  "madrid, spain": { lat: 40.4168, lng: -3.7038 },
  "barcelona, spain": { lat: 41.3851, lng: 2.1734 },
  barcelona: { lat: 41.3851, lng: 2.1734 },
  "kyoto, japan": { lat: 35.0116, lng: 135.7681 },
  kyoto: { lat: 35.0116, lng: 135.7681 },
  "tokyo, japan": { lat: 35.6762, lng: 139.6503 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  "jaipur, india": { lat: 26.9124, lng: 75.7873 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  "goa, india": { lat: 15.2993, lng: 74.124 },
  goa: { lat: 15.2993, lng: 74.124 },
  "paris, france": { lat: 48.8566, lng: 2.3522 },
  paris: { lat: 48.8566, lng: 2.3522 },
  "rome, italy": { lat: 41.9028, lng: 12.4964 },
  rome: { lat: 41.9028, lng: 12.4964 },
  "bali, indonesia": { lat: -8.4095, lng: 115.1889 },
  bali: { lat: -8.4095, lng: 115.1889 },
  "new york, usa": { lat: 40.7128, lng: -74.006 },
  "new york": { lat: 40.7128, lng: -74.006 },
  "london, uk": { lat: 51.5074, lng: -0.1278 },
  london: { lat: 51.5074, lng: -0.1278 },
};

function getDestinationCenter(dest: string): MapCoordinate {
  const normalized = dest.toLowerCase().trim();
  if (DESTINATION_COORDS[normalized]) {
    return DESTINATION_COORDS[normalized];
  }
  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  // Default world center if unknown
  return { lat: 40.4168, lng: -3.7038 };
}

function getOffsetCoords(center: MapCoordinate, index: number, total: number): MapCoordinate {
  const radius = 0.025; // ~2.5km spread
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  return {
    lat: center.lat + Math.sin(angle) * radius * 0.75,
    lng: center.lng + Math.cos(angle) * radius,
  };
}

function createCustomIcon(idx: number, isSelected: boolean) {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background-color: ${isSelected ? "#af0037" : "#1a1c1e"};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 13px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
        transition: transform 0.15s ease;
        transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
      ">
        ${idx + 1}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export function InteractiveMapView({
  destination,
  items,
  selectedIndex,
  onSelectIndex,
}: InteractiveMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      const center = getDestinationCenter(destination);
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom zoom control in bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.stop();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
        markersRef.current = [];
      }
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Update markers, polyline and bounds ONLY when destination or items change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    map.stop();
    layerGroup.clearLayers();
    markersRef.current = [];

    const center = getDestinationCenter(destination);
    const stopCoords: [number, number][] = [];

    items.forEach((item, idx) => {
      const pos = item.coordinates ?? getOffsetCoords(center, idx, items.length);
      stopCoords.push([pos.lat, pos.lng]);

      const isSelected = selectedIndex === idx;
      const customIcon = createCustomIcon(idx, isSelected);
      const marker = L.marker([pos.lat, pos.lng], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; font-size: 14px; color: #1a1c1e;">${item.title}</div>
          ${item.time ? `<div style="font-size: 12px; color: #666; margin-top: 2px;">🕒 ${item.time} (${item.duration ?? ""})</div>` : ""}
          ${item.category ? `<div style="font-size: 11px; color: #af0037; font-weight: 600; margin-top: 4px;">${item.category}</div>` : ""}
        </div>
      `);

      marker.on("click", () => {
        if (onSelectIndex) {
          onSelectIndex(idx);
        }
      });

      layerGroup.addLayer(marker);
      markersRef.current.push(marker);
    });

    // Draw route polyline connecting sequential stops
    if (stopCoords.length > 1) {
      const polyline = L.polyline(stopCoords, {
        color: "#af0037",
        weight: 3.5,
        opacity: 0.85,
        dashArray: "6, 8",
      });
      layerGroup.addLayer(polyline);
    }

    // Fit map bounds to encompass all points without triggering breaking animations
    if (stopCoords.length > 0) {
      const bounds = L.latLngBounds(stopCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: false });
    } else {
      map.setView([center.lat, center.lng], 13, { animate: false });
    }
  }, [destination, items]);

  // Update selected marker highlight WITHOUT rebuilding or wiping the layers
  useEffect(() => {
    markersRef.current.forEach((marker, idx) => {
      const isSelected = selectedIndex === idx;
      marker.setIcon(createCustomIcon(idx, isSelected));
    });
  }, [selectedIndex]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full z-10" />
      {/* Attribution Overlay Pill */}
      <div className="absolute top-4 left-4 z-20 rounded-full border border-surface-container-highest/80 bg-surface-container-lowest/90 px-3 py-1 font-label-sm text-[12px] font-semibold text-on-surface shadow-xs backdrop-blur-xs">
        📍 {destination}
      </div>
    </div>
  );
}
