"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ItineraryStop } from "./itinerary-stop-card";

type ItineraryMapPreviewProps = {
  destination: string;
  stops: ItineraryStop[];
};

export function ItineraryMapPreview({
  destination,
  stops,
}: ItineraryMapPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }
    setNotice("Route suggestions are a preview; AI adjustments are not connected.");
    setPrompt("");
  }

  return (
    <section
      aria-label={`Illustrative Jaipur map preview for ${destination}`}
      className="relative h-full min-h-[760px] overflow-hidden bg-[#e8e4dc] sm:min-h-[760px] lg:min-h-[620px]"
    >
      <div className="absolute inset-0 select-none overflow-hidden">
        <svg
          aria-label="Illustrative vector map of Jaipur's old city with sample route and points of interest"
          className="h-full w-full transition-transform duration-200"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          style={{ transform: `scale(${zoom})` }}
          viewBox="0 0 1060 940"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#af0037" />
              <stop offset="100%" stopColor="#da1249" />
            </linearGradient>
            <filter
              height="140%"
              id="pinShadow"
              width="140%"
              x="-20%"
              y="-20%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                floodColor="#000000"
                floodOpacity="0.25"
                stdDeviation="4"
              />
            </filter>
            <pattern
              height="40"
              id="cityGrid"
              patternUnits="userSpaceOnUse"
              width="40"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#ded8cd"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect fill="#ece8df" height="100%" width="100%" />
          <rect fill="url(#cityGrid)" height="100%" opacity="0.6" width="100%" />
          <polygon fill="#e2ded4" points="120,80 440,50 510,210 260,280" />
          <polygon fill="#e5dfd6" points="530,90 890,70 940,320 620,380" />
          <polygon fill="#e0dbd0" points="210,320 540,290 580,590 190,560" />
          <polygon fill="#e4ded5" points="610,390 980,360 960,720 590,740" />
          <path
            d="M 180,680 C 240,650 360,670 410,740 C 440,790 390,860 300,880 C 210,870 150,810 180,680 Z"
            fill="#d2e3d3"
            opacity="0.85"
          />
          <text
            fill="#58775f"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="1"
            x="250"
            y="780"
          >
            RAM NIWAS GARDEN
          </text>
          <path
            d="M 720,120 C 780,100 860,110 880,160 C 900,210 820,240 760,220 Z"
            fill="#d2e3d3"
            opacity="0.85"
          />
          <text
            fill="#58775f"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="11"
            fontWeight="600"
            x="765"
            y="175"
          >
            JAL MAHAL PRECINCT
          </text>
          <ellipse cx="440" cy="180" fill="#c3dbe7" rx="70" ry="32" />
          <text
            fill="#4d7285"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="11"
            fontWeight="500"
            x="408"
            y="184"
          >
            Tal Katora
          </text>
          <polyline
            fill="none"
            points="140,110 160,540 180,820"
            stroke="#c5bbae"
            strokeDasharray="6,4"
            strokeWidth="3"
          />
          <polyline
            fill="none"
            points="140,110 880,80 950,560 920,850"
            stroke="#c5bbae"
            strokeDasharray="6,4"
            strokeWidth="3"
          />
          <path
            d="M 60,390 L 1020,340"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <path
            d="M 60,390 L 1020,340"
            stroke="#f6f3ee"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <text
            fill="#8c8275"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="10"
            fontWeight="700"
            letterSpacing="1.5"
            x="180"
            y="380"
          >
            CHANDPOLE BAZAR
          </text>
          <text
            fill="#8c8275"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="10"
            fontWeight="700"
            letterSpacing="1.5"
            x="720"
            y="355"
          >
            TRIPOLIA BAZAR
          </text>
          <path
            d="M 520,60 L 510,880"
            stroke="#ffffff"
            strokeWidth="14"
          />
          <path
            d="M 520,60 L 510,880"
            stroke="#f6f3ee"
            strokeWidth="9"
          />
          <text
            fill="#8c8275"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="10"
            fontWeight="700"
            letterSpacing="1"
            x="525"
            y="240"
          >
            SIREH DEORI BAZAR
          </text>
          <text
            fill="#8c8275"
            fontFamily="var(--font-plus-jakarta-sans), sans-serif"
            fontSize="10"
            fontWeight="700"
            letterSpacing="1"
            x="525"
            y="600"
          >
            JOHARI BAZAR
          </text>
          <g fill="none" stroke="#ffffff" strokeWidth="7">
            <path d="M 330,80 L 320,860" />
            <path d="M 740,70 L 730,860" />
            <path d="M 120,240 L 940,210" />
            <path d="M 110,540 L 950,510" />
            <path d="M 100,690 L 960,670" />
          </g>
          <path
            d="M 580,260 L 460,285 L 420,335 L 530,480"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
          />
          <path
            d="M 580,260 L 460,285 L 420,335 L 530,480"
            fill="none"
            stroke="url(#routeGradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.5"
          />
          <path
            d="M 420,335 L 530,480"
            fill="none"
            opacity="0.9"
            stroke="#ffffff"
            strokeDasharray="6,6"
            strokeLinecap="round"
            strokeWidth="2"
          />
          {[
            "M 530,480 L 360,720",
            "M 580,260 L 710,180",
          ].map((path) => (
            <path
              d={path}
              fill="none"
              key={path}
              opacity="0.6"
              stroke="#906f71"
              strokeDasharray="5,6"
              strokeWidth="2.5"
            />
          ))}
          <g transform="translate(360, 720)">
            <circle cx="0" cy="0" fill="#ffffff" filter="url(#pinShadow)" r="14" />
            <circle cx="0" cy="0" fill="#00634d" r="5" />
            <rect
              fill="#ffffff"
              filter="url(#pinShadow)"
              height="24"
              rx="12"
              width="138"
              x="18"
              y="-12"
            />
            <text
              fill="#1b1c1c"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="11"
              fontWeight="600"
              x="28"
              y="4"
            >
              Albert Hall Museum
            </text>
          </g>
          <g transform="translate(710, 180)">
            <circle cx="0" cy="0" fill="#ffffff" filter="url(#pinShadow)" r="14" />
            <circle cx="0" cy="0" fill="#00634d" r="5" />
            <rect
              fill="#ffffff"
              filter="url(#pinShadow)"
              height="24"
              rx="12"
              width="115"
              x="18"
              y="-12"
            />
            <text
              fill="#1b1c1c"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="11"
              fontWeight="600"
              x="28"
              y="4"
            >
              Nahargarh Fort
            </text>
          </g>
          <g transform="translate(240, 520)">
            <circle cx="0" cy="0" fill="#ffffff" filter="url(#pinShadow)" r="10" />
            <circle cx="0" cy="0" fill="#695b60" r="4" />
            <rect
              fill="#ffffff"
              filter="url(#pinShadow)"
              height="20"
              rx="10"
              width="125"
              x="14"
              y="-10"
            />
            <text
              fill="#695b60"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="10"
              fontWeight="500"
              x="22"
              y="4"
            >
              Tapri Central Café
            </text>
          </g>
          <g transform="translate(530, 480)">
            <circle cx="0" cy="0" fill="#1b1c1c" filter="url(#pinShadow)" r="18" />
            <circle cx="0" cy="0" fill="#1b1c1c" r="15" />
            <text
              fill="#ffffff"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              x="0"
              y="5"
            >
              4
            </text>
            <rect fill="#1b1c1c" height="26" rx="6" width="85" x="22" y="-14" />
            <text
              fill="#ffffff"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="11"
              fontWeight="600"
              x="28"
              y="3"
            >
              LMB Feasts
            </text>
          </g>
          <g transform="translate(420, 335)">
            <circle cx="0" cy="0" fill="#1b1c1c" filter="url(#pinShadow)" r="18" />
            <circle cx="0" cy="0" fill="#1b1c1c" r="15" />
            <text
              fill="#ffffff"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              x="0"
              y="5"
            >
              3
            </text>
            <rect
              fill="#ffffff"
              filter="url(#pinShadow)"
              height="26"
              rx="6"
              width="98"
              x="-115"
              y="-14"
            />
            <text
              fill="#1b1c1c"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="11"
              fontWeight="600"
              x="-106"
              y="3"
            >
              Jantar Mantar
            </text>
          </g>
          <g transform="translate(460, 285)">
            <circle cx="0" cy="0" fill="#1b1c1c" filter="url(#pinShadow)" r="18" />
            <circle cx="0" cy="0" fill="#1b1c1c" r="15" />
            <text
              fill="#ffffff"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              x="0"
              y="5"
            >
              2
            </text>
            <rect
              fill="#ffffff"
              filter="url(#pinShadow)"
              height="24"
              rx="6"
              width="86"
              x="-95"
              y="-36"
            />
            <text
              fill="#1b1c1c"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="11"
              fontWeight="600"
              x="-87"
              y="-20"
            >
              City Palace
            </text>
          </g>
          <g transform="translate(580, 260)">
            <circle cx="0" cy="0" fill="#ffb2b8" opacity="0.45" r="32" />
            <circle cx="0" cy="0" fill="#af0037" opacity="0.2" r="24" />
            <circle cx="0" cy="0" fill="#af0037" filter="url(#pinShadow)" r="18" />
            <circle cx="0" cy="0" fill="#af0037" r="14" />
            <text
              fill="#ffffff"
              fontFamily="var(--font-plus-jakarta-sans), sans-serif"
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
              x="0"
              y="5"
            >
              1
            </text>
          </g>
        </svg>
      </div>

      <article className="absolute left-3 right-3 top-[154px] z-30 rounded-2xl bg-surface-container-lowest p-3.5 shadow-xl sm:left-auto sm:right-[5%] sm:top-[165px] sm:w-80 lg:left-[55%] lg:right-auto">
        <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-surface-container">
          <Image
            alt="Hawa Mahal's pink sandstone facade and intricately carved balconies"
            className="object-cover"
            fill
            sizes="(min-width: 640px) 320px, calc(100vw - 24px)"
            src="/images/hawa-mahal.jpg"
            unoptimized
          />
          <span className="absolute left-2 top-2 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-[10px] font-bold text-primary backdrop-blur">
            Stop 1 · Active
          </span>
          <button
            aria-label={isFavorite ? "Remove Hawa Mahal from favorites" : "Add Hawa Mahal to favorites"}
            aria-pressed={isFavorite}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest/90 text-primary backdrop-blur hover:bg-surface-container-lowest"
            onClick={() => setIsFavorite((favorite) => !favorite)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </button>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Hawa Mahal
            </h3>
            <span className="flex items-center gap-0.5 font-label-sm text-label-sm font-bold text-on-surface">
              <span aria-hidden="true" className="text-primary">★</span>
              4.8
            </span>
          </div>
          <p className="mt-0.5 font-body-sm text-body-sm text-secondary">
            09:00 AM – 10:00 AM · 1 hr
          </p>
          <p className="mt-0.5 truncate font-body-sm text-body-sm text-secondary">
            Badi Choupad, J.D.A. Market, Pink City
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-surface-container-highest pt-2.5">
            <a
              className="flex items-center gap-1 font-label-md text-label-md font-bold text-primary hover:underline"
              href="https://www.google.com/maps/search/?api=1&query=Hawa+Mahal+Jaipur"
              rel="noreferrer"
              target="_blank"
            >
              Directions
              <MaterialIcon className="text-[16px]" name="arrow_forward" />
            </a>
            <div className="flex items-center gap-1.5">
              <button
                className="rounded-lg bg-surface-container px-3 py-1.5 font-label-sm text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                onClick={() =>
                  setNotice("Stop editing is available in the itinerary panel.")
                }
                type="button"
              >
                Edit stop
              </button>
              <button
                aria-label="Remove Hawa Mahal from route"
                className="rounded-lg bg-surface-container p-1.5 text-secondary transition-colors hover:bg-surface-container-high hover:text-error"
                onClick={() =>
                  setNotice("Manage stops in the itinerary panel.")
                }
                title="Remove stop"
                type="button"
              >
                <MaterialIcon className="text-[16px]" name="close" />
              </button>
            </div>
          </div>
        </div>
      </article>

      <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-start justify-between gap-2 sm:left-4 sm:right-4 lg:left-6 lg:right-auto">
        <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2.5 shadow-md sm:px-4">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          <span className="font-label-md text-label-md font-bold text-on-surface">
            Day 1 Route
          </span>
          <span className="text-xs text-secondary">•</span>
          <span className="font-label-md text-label-md text-secondary">
            {stops.length} stops
          </span>
          <span className="hidden text-xs text-secondary sm:inline">•</span>
          <span className="hidden font-label-md text-label-md text-secondary sm:inline">
            3.5 km
          </span>
          <span className="hidden items-center gap-1 border-l border-surface-container-highest pl-2 sm:flex">
            <MaterialIcon
              className="text-[16px] text-secondary"
              name="directions_walk"
            />
            <MaterialIcon
              className="text-[16px] text-secondary"
              name="local_taxi"
            />
          </span>
        </div>
        <button
          className="hidden items-center gap-1 rounded-full bg-surface-container-lowest px-3 py-2 font-label-sm text-label-sm font-semibold text-on-surface shadow-md transition-colors hover:bg-surface-container sm:inline-flex"
          onClick={() =>
            setNotice("Route settings are a preview and are not connected yet.")
          }
          type="button"
        >
          <MaterialIcon className="text-[16px] text-secondary" name="tune" />
          Route Settings
        </button>
      </div>

      <div className="absolute right-3 top-[88px] z-20 flex flex-col gap-2 sm:right-4 sm:top-4 lg:right-6">
        <div className="flex items-center gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-md">
          <span className="rounded-lg bg-on-surface px-3 py-1.5 font-label-sm text-label-sm font-semibold text-surface">
            Map
          </span>
          <button
            aria-disabled="true"
            className="cursor-not-allowed rounded-lg px-3 py-1.5 font-label-sm text-label-sm font-medium text-secondary opacity-60"
            title="Satellite imagery is not connected."
            type="button"
          >
            Satellite
          </button>
        </div>
        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-md">
          <button
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center text-on-surface transition-colors hover:bg-surface-container"
            onClick={() => setZoom((current) => Math.min(current + 0.15, 1.6))}
            title="Zoom in"
            type="button"
          >
            <MaterialIcon className="text-xl" name="add" />
          </button>
          <div className="h-px w-full bg-surface-container-highest" />
          <button
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center text-on-surface transition-colors hover:bg-surface-container"
            onClick={() => setZoom((current) => Math.max(current - 0.15, 0.7))}
            title="Zoom out"
            type="button"
          >
            <MaterialIcon className="text-xl" name="remove" />
          </button>
        </div>
        <button
          aria-label="Fit all stops"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface shadow-md transition-colors hover:bg-surface-container"
          onClick={() => setZoom(1)}
          title="Fit all stops"
          type="button"
        >
          <MaterialIcon className="text-xl" name="explore" />
        </button>
        <button
          aria-label="Recenter Jaipur"
          className="hidden h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface shadow-md transition-colors hover:bg-surface-container sm:flex"
          onClick={() => setZoom(1)}
          title="Recenter Jaipur"
          type="button"
        >
          <MaterialIcon className="text-xl" name="location_on" />
        </button>
        <button
          aria-label="Show points of interest"
          className="hidden h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface shadow-md transition-colors hover:bg-surface-container sm:flex"
          onClick={() =>
            setNotice("The points of interest shown are illustrative.")
          }
          title="Show points of interest"
          type="button"
        >
          <MaterialIcon className="text-xl" name="map" />
        </button>
      </div>

      <div className="absolute bottom-4 left-3 z-20 hidden rounded-xl bg-surface-container-lowest p-3 shadow-md sm:bottom-6 sm:left-4 sm:block lg:left-6">
        <span className="mb-2 block font-label-sm text-[10px] font-bold uppercase tracking-wider text-secondary">
          Map Legend
        </span>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-primary" />
            <span className="font-body-sm text-[12px] text-on-surface">
              Itinerary Route
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
              1
            </span>
            <span className="font-body-sm text-[12px] text-on-surface">
              Scheduled Stops
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-tertiary" />
            <span className="font-body-sm text-[12px] text-on-surface">
              Discovered Points of Interest
            </span>
          </div>
        </div>
      </div>

      {isAssistantOpen ? (
        <section
          aria-labelledby="route-assistant-heading"
          className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl bg-surface-container-lowest p-3 shadow-xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-[min(24rem,calc(100%-2rem))] sm:p-4 lg:bottom-6 lg:right-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary">
              <MaterialIcon className="text-[18px]" name="auto_awesome" />
              <h2
                className="font-label-md text-label-md font-bold text-on-surface"
                id="route-assistant-heading"
              >
                Improve my route
              </h2>
              <span className="rounded bg-primary-fixed px-1.5 py-0.5 font-label-sm text-[10px] font-bold text-primary">
                AI
              </span>
            </div>
            <button
              aria-label="Close route assistant"
              className="text-secondary transition-colors hover:text-on-surface"
              onClick={() => setIsAssistantOpen(false)}
              type="button"
            >
              <MaterialIcon className="text-[16px]" name="close" />
            </button>
          </div>
          <p className="mb-3 font-body-sm text-body-sm text-secondary">
            Stop 2 (City Palace) and Stop 3 (Jantar Mantar) are adjacent. Would
            you like to optimize timing or add a scenic viewpoint?
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {[
              "⚡ Avoid afternoon heat",
              "☕ Add best masala chai stop",
              "⏳ Reduce walk by 400m",
            ].map((suggestion) => (
              <button
                className="flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-[11px] font-medium text-on-surface transition-colors hover:bg-surface-container-high"
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form className="relative flex items-center" onSubmit={submitPrompt}>
            <label className="sr-only" htmlFor="route-assistant-prompt">
              Ask Roamly to adjust your route
            </label>
            <input
              className="h-10 w-full rounded-xl bg-surface-container-low pl-3 pr-10 font-body-sm text-body-sm text-on-surface placeholder:text-secondary focus:bg-surface-container-lowest focus:outline-none"
              id="route-assistant-prompt"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask Roamly to adjust this route..."
              value={prompt}
            />
            <button
              aria-label="Submit route adjustment request"
              className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-container"
              type="submit"
            >
              <MaterialIcon className="text-[16px]" name="arrow_forward" />
            </button>
          </form>
          <p className="mt-2 font-body-sm text-[11px] text-secondary">
            Route suggestions are a preview; AI changes are not connected.
          </p>
        </section>
      ) : null}

      {notice ? (
        <p
          aria-live="polite"
          className="absolute bottom-3 left-3 right-3 z-40 rounded-lg border border-surface-container-highest bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface shadow-md sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-20 sm:-translate-x-1/2"
          role="status"
        >
          {notice}
        </p>
      ) : null}
    </section>
  );
}
