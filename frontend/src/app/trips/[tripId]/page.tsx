import { ItinerarySelection } from "@/features/itinerary-selection/components/itinerary-selection";
import { itineraryOptions } from "@/features/itinerary-selection/components/itinerary-options";
import {
  parseTripPreferences,
  type TripPreferencesSearchParams,
} from "@/features/trip-preferences/lib/preferences-query";

type ItinerarySelectionPageProps = {
  searchParams: Promise<TripPreferencesSearchParams>;
};

export default async function ItinerarySelectionPage({
  searchParams,
}: ItinerarySelectionPageProps) {
  const params = await searchParams;
  const preferences = parseTripPreferences(params);
  const requestedPlan = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const initialSelectedPlan = itineraryOptions.some(
    (option) => option.id === requestedPlan,
  )
    ? requestedPlan
    : "balanced";

  return (
    <ItinerarySelection
      initialSelectedPlan={initialSelectedPlan}
      preferences={preferences}
    />
  );
}
