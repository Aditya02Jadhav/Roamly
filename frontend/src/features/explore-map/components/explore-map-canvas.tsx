"use client";

import type { ExplorePlace } from "@/features/explore-map/lib/places";
import { savedPlaceNames } from "@/features/explore-map/lib/places";

type ExploreMapCanvasProps = {
  places: ExplorePlace[];
  selectedPlaceId: string;
  zoom: number;
  savedIds: string[];
  onSelectPlace: (placeId: string) => void;
  onResetZoom: () => void;
  onZoom: (direction: -1 | 1) => void;
};

export function ExploreMapCanvas({
  places,
  selectedPlaceId,
  zoom,
  savedIds,
  onSelectPlace,
  onResetZoom,
  onZoom,
}: ExploreMapCanvasProps) {
  return (
    <div
      aria-label="Illustrative Jaipur map"
      className="absolute inset-0 overflow-hidden bg-[#F4F1EA]"
    >
      <svg
        aria-label="Stylized map showing Jaipur streets, parks and lakes"
        className="absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="none"
        role="img"
        style={{ transform: `scale(${zoom})`, transition: "transform 200ms" }}
        viewBox="0 0 1600 1000"
      >
        <rect fill="#F4F1EA" height="1000" width="1600" />
        <path
          d="M 1020 80 C 1140 70, 1260 110, 1310 180 C 1330 230, 1280 290, 1190 300 C 1080 310, 990 260, 980 190 C 970 120, 1000 85, 1020 80 Z"
          fill="#D2E8F0"
          opacity="0.95"
        />
        <text fill="#5F8D9E" fontSize="13" fontWeight="600" letterSpacing="1.5" x="1110" y="195">
          MAN SAGAR LAKE (JAL MAHAL)
        </text>
        <path
          d="M 1250 20 C 1320 15, 1380 40, 1370 80 C 1350 110, 1290 100, 1260 85 Z"
          fill="#D2E8F0"
          opacity="0.8"
        />
        <text fill="#6A97A8" fontSize="10" fontWeight="600" x="1275" y="60">
          MAOTA LAKE
        </text>
        <path
          d="M 450 0 C 510 120, 680 180, 750 320 C 820 460, 890 510, 920 620"
          fill="none"
          opacity="0.65"
          stroke="#E4DCD0"
          strokeLinecap="round"
          strokeWidth="48"
        />
        <path
          d="M 480 30 C 540 140, 700 200, 780 340"
          fill="none"
          opacity="0.7"
          stroke="#DCD3C5"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <text
          fill="#A89D8E"
          fontSize="11"
          fontWeight="700"
          letterSpacing="2"
          transform="rotate(32, 610, 240)"
          x="610"
          y="240"
        >
          ARAVALLI RANGE (NAHARGARH RIDGE)
        </text>
        <rect fill="#E2EEDD" height="150" opacity="0.9" rx="28" width="170" x="710" y="660" />
        <text fill="#588550" fontSize="11" fontWeight="600" x="740" y="740">
          RAM NIWAS GARDEN
        </text>
        <ellipse cx="610" cy="790" fill="#E2EEDD" opacity="0.9" rx="120" ry="85" />
        <text fill="#588550" fontSize="11" fontWeight="600" x="560" y="795">
          CENTRAL PARK
        </text>
        <polygon
          fill="#FBF5F1"
          points="760,370 1120,380 1100,610 740,600"
          stroke="#E9D5CF"
          strokeDasharray="10 6"
          strokeWidth="4"
        />
        <text
          fill="#AF0037"
          fontSize="11"
          fontWeight="700"
          letterSpacing="3"
          opacity="0.75"
          x="880"
          y="398"
        >
          WALLED PINK CITY (OLD JAIPUR)
        </text>
        <path
          d="M 940 600 L 960 380 L 1050 240 L 1150 110 L 1280 20"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="9"
        />
        <path
          d="M 940 600 L 960 380 L 1050 240 L 1150 110 L 1280 20"
          fill="none"
          stroke="#E6E0D6"
          strokeWidth="2"
        />
        <text
          fill="#888175"
          fontSize="10"
          fontWeight="600"
          transform="rotate(-52, 1060, 220)"
          x="1060"
          y="220"
        >
          AMER ROAD
        </text>
        <path
          d="M 420 630 L 760 630 L 980 640 L 1260 670"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
        />
        <path
          d="M 420 630 L 760 630 L 980 640 L 1260 670"
          fill="none"
          stroke="#E2DDD4"
          strokeWidth="2"
        />
        <text fill="#888175" fontSize="10" fontWeight="600" x="480" y="622">
          MIRZA ISMAIL (MI) ROAD
        </text>
        <path
          d="M 760 480 L 1100 490 M 930 380 L 930 600"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
        />
        <text fill="#888175" fontSize="9" fontWeight="600" x="800" y="474">
          TRIPOLIA BAZAAR
        </text>
        <text
          fill="#888175"
          fontSize="9"
          fontWeight="600"
          transform="rotate(90, 938, 540)"
          x="938"
          y="540"
        >
          JOHARI BAZAAR
        </text>
        <path
          d="M 680 680 L 710 880 L 750 1000"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
        />
        <path
          d="M 680 680 L 710 880 L 750 1000"
          fill="none"
          stroke="#DFD7CB"
          strokeWidth="2"
        />
        <text
          fill="#888175"
          fontSize="10"
          fontWeight="600"
          transform="rotate(70, 725, 930)"
          x="725"
          y="930"
        >
          TONK ROAD
        </text>
        <path
          d="M 520 400 L 760 480 M 610 520 L 760 630 M 740 600 L 680 720 M 890 640 L 920 840 M 1100 490 L 1280 540 M 1100 610 L 1260 720"
          fill="none"
          opacity="0.9"
          stroke="#FFFFFF"
          strokeWidth="5"
        />
      </svg>

      {places.map((place) => {
        const selected = place.id === selectedPlaceId;
        const saved = place.saved || savedIds.includes(place.id);
        return (
          <button
            aria-pressed={selected}
            className={`absolute z-20 -translate-x-1/2 -translate-y-full rounded-full border-2 px-2.5 py-1.5 shadow-md transition-transform hover:scale-105 ${
              selected
                ? "border-white bg-primary-container text-on-primary ring-2 ring-primary-fixed"
                : saved
                  ? "border-primary-container bg-surface-container-lowest text-primary-container ring-2 ring-primary-fixed"
                  : "border-outline-variant/60 bg-surface-container-lowest text-on-surface"
            }`}
            key={place.id}
            onClick={() => onSelectPlace(place.id)}
            style={{ top: place.mapPosition.top, left: place.mapPosition.left }}
            type="button"
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true" className="text-[12px]">
                {saved ? "◆" : selected ? "✦" : "●"}
              </span>
              <span className="font-label-md text-label-md font-semibold">
                {place.name}
              </span>
              <span className="font-label-sm text-label-sm">{place.rating}★</span>
              {saved ? (
                <span className="rounded-full bg-primary-fixed px-1.5 py-0.5 text-[9px] font-bold text-on-primary-fixed-variant">
                  SAVED
                </span>
              ) : null}
            </span>
          </button>
        );
      })}

      {savedPlaceNames.slice(0, 3).map((name, index) => (
        <div
          className="absolute z-10 hidden -translate-x-1/2 -translate-y-full rounded-full border border-primary-container bg-surface-container-lowest px-2 py-1 shadow-md ring-2 ring-primary-fixed md:block"
          key={name}
          style={{
            top: ["46%", "42%", "9%"][index],
            left: ["64%", "58%", "83%"][index],
          }}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap font-label-md text-label-md font-semibold text-primary-container">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-[10px] text-on-primary">
              ♥
            </span>
            {name}
            <span className="rounded-full bg-primary-fixed px-1.5 py-0.5 text-[9px] text-on-primary-fixed-variant">
              SAVED
            </span>
          </span>
        </div>
      ))}

      <div className="absolute bottom-5 right-4 z-30 flex flex-col items-center gap-2 sm:bottom-6 sm:right-6">
        <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-lg">
          <button
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center text-on-surface transition-colors hover:bg-surface-container"
            onClick={() => onZoom(1)}
            type="button"
          >
            +
          </button>
          <div className="h-px bg-surface-container-high" />
          <button
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center text-on-surface transition-colors hover:bg-surface-container"
            onClick={() => onZoom(-1)}
            type="button"
          >
            −
          </button>
        </div>
        <button
          aria-label="Re-center on Jaipur Old City"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-primary-container shadow-lg transition-colors hover:bg-surface-container"
          onClick={onResetZoom}
          type="button"
        >
          ◎
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-10 hidden items-center gap-4 rounded-lg border border-outline-variant/40 bg-surface-container-lowest/90 px-3 py-1.5 text-xs text-secondary shadow-sm backdrop-blur-md xl:flex">
        {[
          ["bg-primary-container", "4 Saved in Trip"],
          ["bg-[#D35400]", "Attractions"],
          ["bg-tertiary", "Cafés"],
          ["bg-[#4A3DB5]", "Culture"],
          ["bg-secondary", "Hidden Gems"],
        ].map(([color, label]) => (
          <span className="flex items-center gap-1.5" key={label}>
            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
