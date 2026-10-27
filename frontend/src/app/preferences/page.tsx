import TripPreferences from "@/features/trip-preferences/components/tripPreferences";
import {
  parseTripPreferences,
  type TripPreferencesSearchParams,
} from "@/features/trip-preferences/lib/preferences-query";

type TripPreferencesPageProps = {
  searchParams: Promise<TripPreferencesSearchParams>;
};

export default async function TripPreferencesPage({
  searchParams,
}: TripPreferencesPageProps) {
  const initialPreferences = parseTripPreferences(await searchParams);

  return <TripPreferences initialPreferences={initialPreferences} />;
}
