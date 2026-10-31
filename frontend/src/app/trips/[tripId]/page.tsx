import { notFound } from "next/navigation";
import { ItinerarySelection } from "@/features/itinerary-selection/components/itinerary-selection";
import { getTripById } from "@/lib/api";
import {
  parseTripPreferences,
  type TripPreferencesSearchParams,
} from "@/features/trip-preferences/lib/preferences-query";

type ItinerarySelectionPageProps = {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<TripPreferencesSearchParams>;
};

export default async function ItinerarySelectionPage({
  params,
  searchParams,
}: ItinerarySelectionPageProps) {
  const { tripId } = await params;
  const searchParamsResolved = await searchParams;

  // Handle fallback or legacy '/trips/new' route
  if (tripId === "new") {
    const preferences = parseTripPreferences(searchParamsResolved);
    const requestedPlan = Array.isArray(searchParamsResolved.plan)
      ? searchParamsResolved.plan[0]
      : searchParamsResolved.plan;

    return (
      <ItinerarySelection
        initialSelectedPlan={requestedPlan || "balanced"}
        preferences={preferences}
      />
    );
  }

  // Fetch real persisted trip from backend by UUID
  let trip = null;
  try {
    trip = await getTripById(tripId);
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
  }

  if (!trip) {
    notFound();
  }

  const requestedPlan = Array.isArray(searchParamsResolved.plan)
    ? searchParamsResolved.plan[0]
    : searchParamsResolved.plan;

  const initialSelectedPlan = trip.options.some((opt) => opt.id === requestedPlan)
    ? requestedPlan
    : trip.options[0]?.id || "balanced";

  return (
    <ItinerarySelection
      tripId={trip.id}
      preferences={trip.preferences}
      options={trip.options}
      initialSelectedPlan={initialSelectedPlan}
    />
  );
}
