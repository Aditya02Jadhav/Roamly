export type TripPreferencesValues = {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  budget: string;
  totalBudget?: number | null;
  interests: string[];
  pace: string;
  transport: string;
  flexibleDates: boolean;
};

export type TripPreferencesSearchParams = Record<
  string,
  string | string[] | undefined
>;

export const defaultTripPreferences: TripPreferencesValues = {
  destination: "Goa, India",
  startDate: "2026-11-14",
  endDate: "2026-11-20",
  adults: 2,
  children: 0,
  budget: "moderate",
  totalBudget: 70000,
  interests: ["Beaches", "Food and cafés", "Culture", "Hidden gems"],
  pace: "balanced",
  transport: "car-or-taxi",
  flexibleDates: true,
};

const allowedInterests = [
  "Beaches",
  "Food and cafés",
  "Culture",
  "Hidden gems",
  "Nature",
  "History",
  "Adventure",
  "Shopping",
  "Nightlife",
  "Photography",
];

const allowedBudgets = [
  "budget-friendly",
  "moderate",
  "comfort",
  "premium",
];

const allowedPaces = ["relaxed", "balanced", "packed"];
const allowedTransport = [
  "public-transit",
  "walking",
  "car-or-taxi",
  "mixed-transit",
];
const dailyBudgetMidpoints: Record<string, number> = {
  "budget-friendly": 2250,
  moderate: 5000,
  comfort: 11000,
  premium: 20000,
};

function getString(
  params: TripPreferencesSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function getDate(value: string | undefined, fallback: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fallback;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? fallback
    : value;
}

function getCount(
  value: string | undefined,
  fallback: number,
  minimum: number,
): number {
  if (!value || !/^\d+$/.test(value)) {
    return fallback;
  }

  const count = Number(value);
  return count >= minimum && count <= 20 ? count : fallback;
}

export function parseTripPreferences(
  params: TripPreferencesSearchParams,
): TripPreferencesValues {
  const startDate = getDate(
    getString(params, "startDate"),
    defaultTripPreferences.startDate,
  );
  const requestedEndDate = getDate(
    getString(params, "endDate"),
    defaultTripPreferences.endDate,
  );
  const endDate =
    requestedEndDate < startDate
      ? startDate
      : requestedEndDate;
  const requestedBudget = getString(params, "budget");
  const requestedPace = getString(params, "pace");
  const requestedTransport = getString(params, "transport");
  const requestedFlexibleDates = getString(params, "flexibleDates");
  const requestedInterests = getString(params, "interests");
  const destination = getString(params, "destination")?.trim();
  const budget =
    requestedBudget && allowedBudgets.includes(requestedBudget)
      ? requestedBudget
      : defaultTripPreferences.budget;
  const tripDays = Math.max(
    1,
    Math.round(
      (new Date(`${endDate}T00:00:00Z`).getTime() -
        new Date(`${startDate}T00:00:00Z`).getTime()) /
        86_400_000,
    ) + 1,
  );
  const adults = getCount(
    getString(params, "adults"),
    defaultTripPreferences.adults,
    1,
  );
  const children = getCount(
    getString(params, "children"),
    defaultTripPreferences.children,
    0,
  );
  const requestedTotalBudget = Number(getString(params, "totalBudget"));
  const totalBudget =
    Number.isSafeInteger(requestedTotalBudget) &&
    requestedTotalBudget > 0 &&
    requestedTotalBudget <= 60_000_000
      ? requestedTotalBudget
      : (dailyBudgetMidpoints[budget] ?? 5000) *
        tripDays *
        (adults + children);

  return {
    destination: destination
      ? destination.slice(0, 120)
      : defaultTripPreferences.destination,
    startDate,
    endDate,
    adults,
    children,
    budget,
    totalBudget,
    interests: requestedInterests
      ? [...new Set(requestedInterests.split("|"))].filter((interest) =>
          allowedInterests.includes(interest),
        )
      : defaultTripPreferences.interests,
    pace:
      requestedPace && allowedPaces.includes(requestedPace)
        ? requestedPace
        : defaultTripPreferences.pace,
    transport:
      requestedTransport && allowedTransport.includes(requestedTransport)
        ? requestedTransport
        : defaultTripPreferences.transport,
    flexibleDates:
      requestedFlexibleDates === "true"
        ? true
        : requestedFlexibleDates === "false"
          ? false
          : defaultTripPreferences.flexibleDates,
  };
}

export function serializeTripPreferences(
  preferences: TripPreferencesValues,
): string {
  const params = new URLSearchParams();
  params.set("destination", preferences.destination);
  params.set("startDate", preferences.startDate);
  params.set("endDate", preferences.endDate);
  params.set("adults", String(preferences.adults));
  params.set("children", String(preferences.children));
  params.set("budget", preferences.budget);
  if (preferences.totalBudget) {
    params.set("totalBudget", String(preferences.totalBudget));
  }
  params.set("interests", preferences.interests.join("|"));
  params.set("pace", preferences.pace);
  params.set("transport", preferences.transport);
  params.set("flexibleDates", String(preferences.flexibleDates));
  return params.toString();
}
