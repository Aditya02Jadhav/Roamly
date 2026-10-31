import { ItineraryEditor } from "@/features/itinerary-editor/components/itinerary-editor";
import { itineraryOptions } from "@/features/itinerary-selection/components/itinerary-options";
import { getTripById, getTripItinerary } from "@/lib/api";
import {
  parseTripPreferences,
  type TripPreferencesSearchParams,
} from "@/features/trip-preferences/lib/preferences-query";

type ExploreMapPageProps = {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<TripPreferencesSearchParams>;
};

export default async function ExploreMapPage({
  params,
  searchParams,
}: ExploreMapPageProps) {
  const { tripId } = await params;
  const searchParamsResolved = await searchParams;

  let preferences = null;
  let options = itineraryOptions;
  let initialItinerary = null;

  if (tripId && tripId !== "new") {
    try {
      const trip = await getTripById(tripId);
      if (trip) {
        preferences = trip.preferences;
        if (trip.options && trip.options.length > 0) {
          options = trip.options;
        }
      }
      initialItinerary = await getTripItinerary(tripId);
    } catch (error) {
      console.error(`Error loading trip ${tripId} in explore:`, error);
    }
  }

  if (!preferences) {
    preferences = parseTripPreferences(searchParamsResolved);
  }

  const requestedPlan = Array.isArray(searchParamsResolved.plan)
    ? searchParamsResolved.plan[0]
    : searchParamsResolved.plan;

  const selectedPlan =
    options.find((option) => option.id === requestedPlan) ??
    options[0];

  return (
    <ItineraryEditor
      key={`${selectedPlan.id}-${preferences.destination}-${preferences.startDate}-${preferences.endDate}`}
      option={selectedPlan}
      preferences={preferences}
      tripId={tripId !== "new" ? tripId : undefined}
      initialItinerary={initialItinerary}
    />
  );
}
