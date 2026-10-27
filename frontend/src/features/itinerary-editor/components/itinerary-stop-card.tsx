"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ItineraryStop = {
  id: string;
  title: string;
  time: string;
  duration: string;
  category: string;
  description: string;
};

type ItineraryStopCardProps = {
  index: number;
  canMoveDown: boolean;
  stop: ItineraryStop;
  active: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onRename: (title: string) => void;
};

export function ItineraryStopCard({
  index,
  canMoveDown,
  stop,
  active,
  onMoveUp,
  onMoveDown,
  onRemove,
  onRename,
}: ItineraryStopCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(stop.title);

  function saveTitle() {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onRename(trimmedTitle);
    } else {
      setTitle(stop.title);
    }
    setIsEditing(false);
  }

  return (
    <article
      className={`group rounded-xl border bg-surface-container-lowest p-space-md transition-colors ${
        active
          ? "border-2 border-primary-container shadow-sm"
          : "border-surface-container-highest hover:border-outline-variant"
      }`}
    >
      <div className="flex items-start gap-space-md">
        <span
          aria-label={`Stop ${index + 1}`}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-label-md text-label-md font-bold ${
            active
              ? "bg-primary-container text-on-primary ring-4 ring-secondary-container"
              : "bg-inverse-surface text-inverse-on-surface"
          }`}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`font-label-md text-label-md font-semibold ${
                active ? "text-primary-container" : "text-on-surface"
              }`}
            >
              {stop.time}
            </span>
            <span aria-hidden="true" className="text-outline-variant">
              ·
            </span>
            <span className="font-body-sm text-body-sm text-secondary">
              {stop.duration}
            </span>
            <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-wide text-secondary">
              {stop.category}
            </span>
          </div>
          {isEditing ? (
            <input
              aria-label="Edit stop name"
              autoFocus
              className="mt-1 w-full rounded border border-surface-variant px-2 py-1 font-headline-sm text-headline-sm text-on-surface focus:border-primary focus:outline-none"
              onBlur={saveTitle}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveTitle();
                } else if (event.key === "Escape") {
                  setTitle(stop.title);
                  setIsEditing(false);
                }
              }}
              value={title}
            />
          ) : (
            <h3 className="mt-0.5 truncate font-headline-sm text-headline-sm font-bold text-on-surface transition-colors group-hover:text-primary-container">
              {stop.title}
            </h3>
          )}
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {stop.description}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary-container sm:h-16 sm:w-16"
        >
          <MaterialIcon className="text-2xl" name="location_on" />
        </div>
      </div>

      <div className="mt-space-sm flex items-center justify-between border-t border-surface-container-highest/60 pt-space-xs text-secondary">
        <div className="flex items-center gap-1">
          <button
            aria-label={`Move ${stop.title} up`}
            className="rounded p-1 transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
            disabled={index === 0}
            onClick={onMoveUp}
            type="button"
          >
            <span aria-hidden="true">↑</span>
          </button>
          <button
            aria-label={`Move ${stop.title} down`}
            className="rounded p-1 transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            type="button"
          >
            <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 rounded px-2 py-1 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-secondary-container hover:text-primary-container"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <MaterialIcon className="text-[15px]" name="edit" />
            Edit
          </button>
          <button
            aria-label={`Remove ${stop.title}`}
            className="rounded p-1 transition-colors hover:bg-error-container/40 hover:text-error"
            onClick={onRemove}
            type="button"
          >
            <MaterialIcon className="text-[18px]" name="close" />
          </button>
        </div>
      </div>
    </article>
  );
}
