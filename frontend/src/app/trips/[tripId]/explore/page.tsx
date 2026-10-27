import { ItineraryEditor } from "@/features/itinerary-editor/components/itinerary-editor";
import { itineraryOptions } from "@/features/itinerary-selection/components/itinerary-options";
import {
  parseTripPreferences,
  type TripPreferencesSearchParams,
} from "@/features/trip-preferences/lib/preferences-query";

type ExploreMapPageProps = {
  searchParams: Promise<TripPreferencesSearchParams>;
};

export default async function ExploreMapPage({
  searchParams,
}: ExploreMapPageProps) {
  const params = await searchParams;
  const preferences = parseTripPreferences(params);
  const requestedPlan = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const selectedPlan =
    itineraryOptions.find((option) => option.id === requestedPlan) ??
    itineraryOptions[0];

  return (
    <ItineraryEditor
      key={`${selectedPlan.id}-${preferences.destination}-${preferences.startDate}-${preferences.endDate}`}
      option={selectedPlan}
      preferences={preferences}
    />
  );
}
