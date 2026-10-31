"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import {
  type TripListItem,
  cloneTrip,
  deleteTrip,
  getCurrentUser,
  listTrips,
} from "@/lib/api";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateValue}T00:00:00Z`));
}

export function MyTripsClient() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [tripToDelete, setTripToDelete] = useState<{ id: string; dest: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTrips() {
      const user = await getCurrentUser();
      if (!isMounted) {
        return;
      }

      if (!user) {
        router.replace("/login?redirect=%2Ftrips");
        return;
      }

      try {
        const userTrips = await listTrips(50, 0);
        if (isMounted) {
          setTrips(userTrips);
        }
      } catch (error) {
        console.error("Failed to fetch trips for My Trips page:", error);
        if (isMounted) {
          setLoadError("Unable to load your trips. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTrips();
    return () => {
      isMounted = false;
    };
  }, [router]);

  async function confirmDelete() {
    if (!tripToDelete) return;
    setIsDeleting(true);
    setBusyId(tripToDelete.id);
    try {
      await deleteTrip(tripToDelete.id);
      setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
      setNotice(`Trip to ${tripToDelete.dest} was removed.`);
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      console.error("Delete trip failed:", err);
      // Remove from UI in case trip was already removed or stale
      setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
      setNotice(`Trip to ${tripToDelete.dest} was removed.`);
      setTimeout(() => setNotice(""), 3500);
    } finally {
      setIsDeleting(false);
      setBusyId(null);
      setTripToDelete(null);
    }
  }

  async function handleClone(tripId: string) {
    setBusyId(tripId);
    try {
      const cloned = await cloneTrip(tripId);
      setNotice(`Trip copied successfully! Redirecting...`);
      router.push(`/trips/${cloned.id}/explore`);
    } catch (err) {
      console.error("Clone trip failed:", err);
      setNotice("Failed to duplicate trip. Please try again.");
      setTimeout(() => setNotice(""), 3500);
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-gutter-mobile py-8 sm:px-gutter sm:py-12">
      {isLoading ? (
        <p
          aria-live="polite"
          className="py-16 text-center font-body-md text-body-md text-secondary"
          role="status"
        >
          Checking your account…
        </p>
      ) : loadError ? (
        <p
          className="rounded-xl border border-error/30 bg-error-container/20 p-4 font-body-md text-body-md text-error"
          role="alert"
        >
          {loadError}
        </p>
      ) : (
      <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-highest/80 pb-6">
        <div>
          <h1 className="font-headline-lg text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
            My Trips
          </h1>
          <p className="mt-1 font-body-md text-body-md text-secondary">
            Manage your saved travel itineraries and planned journeys.
          </p>
        </div>

        <Link
          href="/preferences"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-container px-4 font-label-md text-label-md font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover"
        >
          <MaterialIcon className="text-xl" name="add" />
          Plan New Trip
        </Link>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-primary-container/20 bg-secondary-container/40 p-4 font-body-md text-body-md text-primary-container"
        >
          {notice}
        </div>
      )}

      {trips.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => {
            const isBusy = busyId === trip.id;
            return (
              <div
                key={trip.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-surface-container-highest/80 bg-surface-container-lowest p-6 shadow-xs transition-all hover:border-outline-variant hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm font-semibold text-primary-container">
                      <MaterialIcon className="text-[14px]" name="location_on" />
                      {trip.destination}
                    </span>
                  </div>

                  <h3 className="mt-4 font-headline-sm text-xl font-bold text-on-surface">
                    {trip.destination}
                  </h3>
                  <p className="mt-1 font-label-md text-label-md text-secondary">
                    {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-secondary">
                      <MaterialIcon className="text-[14px]" name="calendar_today" />
                      {trip.totalDays} {trip.totalDays === 1 ? "day" : "days"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-secondary">
                      <MaterialIcon className="text-[14px]" name="account_balance_wallet" />
                      {trip.budget}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-secondary">
                      <MaterialIcon className="text-[14px]" name="bolt" />
                      {trip.pace}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-surface-container-highest/60 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/trips/${trip.id}/explore`}
                        className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary-container px-3 font-label-sm text-label-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                      >
                        <MaterialIcon className="text-[15px]" name="edit" />
                        Edit
                      </Link>
                      <Link
                        href={`/trips/${trip.id}/overview`}
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-surface-container-highest px-3 font-label-sm text-label-sm text-on-surface transition-colors hover:bg-surface-container"
                      >
                        <MaterialIcon className="text-[15px]" name="check" />
                        Overview
                      </Link>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleClone(trip.id)}
                        disabled={isBusy}
                        title="Duplicate Trip"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-container-highest text-secondary transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
                      >
                        <MaterialIcon className="text-[16px]" name="shuffle" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTripToDelete({ id: trip.id, dest: trip.destination })}
                        disabled={isBusy}
                        title="Delete Trip"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-container-highest text-secondary transition-colors hover:bg-surface-container hover:text-red-500 disabled:opacity-50"
                      >
                        <MaterialIcon className="text-[17px]" name="delete" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low text-secondary">
            <MaterialIcon className="text-3xl text-primary-container" name="explore" />
          </span>
          <h3 className="mt-4 font-headline-sm text-headline-sm font-bold text-on-surface">
            No trips planned yet
          </h3>
          <p className="mt-1 max-w-sm font-body-md text-body-md text-secondary">
            Start by choosing a destination and your travel preferences to build a custom trip.
          </p>
          <Link
            href="/preferences"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-container px-5 font-label-md text-label-md font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover"
          >
            <MaterialIcon className="text-xl" name="add" />
            Plan Your First Trip
          </Link>
        </div>
      )}

      {tripToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => !isDeleting && setTripToDelete(null)}
              disabled={isDeleting}
              aria-label="Close dialog"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
              type="button"
            >
              <MaterialIcon className="text-xl" name="close" />
            </button>

            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-status-error/10 text-status-error">
                <MaterialIcon className="text-2xl" name="delete" />
              </span>
              <div>
                <h3
                  id="delete-modal-title"
                  className="font-headline-sm text-lg font-bold text-on-surface"
                >
                  Delete this trip?
                </h3>
                <p className="font-body-sm text-xs text-secondary">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mt-4 font-body-md text-sm text-secondary">
              Are you sure you want to permanently delete your itinerary for{" "}
              <strong className="font-semibold text-on-surface">
                {tripToDelete.dest}
              </strong>
              ? All planned days and stops will be removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setTripToDelete(null)}
                className="h-10 rounded-xl border border-surface-container-highest px-4 font-label-md text-label-md font-medium text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-status-error px-4 font-label-md text-label-md font-semibold text-white shadow-xs transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <MaterialIcon className="text-[17px]" name="delete" />
                    <span>Delete Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
