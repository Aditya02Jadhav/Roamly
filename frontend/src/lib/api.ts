import type { TripPreferencesValues } from "@/features/trip-preferences/lib/preferences-query";
import type { ItineraryOption } from "@/features/itinerary-selection/components/itinerary-options";

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    if (process.env.INTERNAL_API_URL) {
      return process.env.INTERNAL_API_URL;
    }
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicUrl && !publicUrl.includes("devtunnels.ms")) {
      return publicUrl;
    }
    return "http://127.0.0.1:8000/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type PersistedStop = {
  id: string;
  stop_id: string;
  day_id: string;
  title: string;
  time: string;
  duration: string;
  category: string;
  description: string;
  order_index: number;
};

export type PersistedDay = {
  id: string;
  day_id: string;
  trip_id: string;
  day_number: number;
  date: string;
  title: string;
  stops: PersistedStop[];
};

export type ItineraryResponse = {
  trip_id: string;
  selected_plan?: string | null;
  days: PersistedDay[];
};

export type TripStats = {
  total_days: number;
  total_stops: number;
  categories_breakdown: Record<string, number>;
};

export type TripSummaryResponse = {
  tripId: string;
  status: string;
  destination: string;
  preferences: TripPreferencesValues;
  selectedPlan?: string | null;
  selectedOption?: ItineraryOption | null;
  days: PersistedDay[];
  stats: TripStats;
  createdAt: string;
  updatedAt: string;
};

export type TripListItem = {
  id: string;
  destination: string;
  status: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  adults: number;
  children: number;
  budget: string;
  pace: string;
  selectedPlan?: string | null;
  totalStops: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTripResponse = {
  id: string;
  status: string;
  preferences: TripPreferencesValues;
  createdAt: string;
  updatedAt: string;
  options: ItineraryOption[];
};

export async function createTrip(
  preferences: TripPreferencesValues,
): Promise<CreateTripResponse> {
  const payload = {
    destination: preferences.destination,
    startDate: preferences.startDate,
    endDate: preferences.endDate,
    flexibleDates: preferences.flexibleDates,
    adults: preferences.adults,
    children: preferences.children,
    budget: preferences.budget,
    totalBudget: preferences.totalBudget,
    interests: preferences.interests,
    pace: preferences.pace,
    transport: preferences.transport,
  };
  const token = getStoredToken();

  const response = await fetch(`${getApiBaseUrl()}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = "Failed to create trip";
    try {
      const err = await response.json();
      if (err.detail) {
        errorDetail =
          typeof err.detail === "string"
            ? err.detail
            : JSON.stringify(err.detail);
      }
    } catch {
      // Keep default error message
    }
    throw new ApiError(errorDetail, response.status);
  }

  return response.json();
}

export const createDraftTrip = createTrip;

export async function getTripById(
  id: string,
): Promise<CreateTripResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let errorDetail = "Failed to fetch trip";
    try {
      const err = await response.json();
      if (err.detail) {
        errorDetail =
          typeof err.detail === "string"
            ? err.detail
            : JSON.stringify(err.detail);
      }
    } catch {
      // Keep default error message
    }
    throw new ApiError(errorDetail, response.status);
  }

  return response.json();
}

export async function selectTripPlan(
  tripId: string,
  plan: string,
): Promise<ItineraryResponse> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}/select-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plan }),
  });

  if (!response.ok) {
    throw new ApiError("Failed to select trip plan", response.status);
  }

  return response.json();
}

export async function getTripItinerary(
  tripId: string,
): Promise<ItineraryResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}/itinerary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError("Failed to fetch itinerary", response.status);
  }

  return response.json();
}

export async function getTripSummary(
  tripId: string,
): Promise<TripSummaryResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError("Failed to fetch trip summary", response.status);
  }

  return response.json();
}

export async function addTripStop(
  tripId: string,
  dayNumber: number,
  stop: {
    title: string;
    time?: string;
    duration?: string;
    category?: string;
    description?: string;
  },
): Promise<PersistedStop> {
  const response = await fetch(
    `${getApiBaseUrl()}/trips/${tripId}/days/${dayNumber}/stops`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stop),
    },
  );

  if (!response.ok) {
    throw new ApiError("Failed to add stop", response.status);
  }

  return response.json();
}

export async function updateTripStop(
  tripId: string,
  stopId: string,
  updates: Partial<{
    title: string;
    time: string;
    duration: string;
    category: string;
    description: string;
  }>,
): Promise<PersistedStop> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}/stops/${stopId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new ApiError("Failed to update stop", response.status);
  }

  return response.json();
}

export async function deleteTripStop(
  tripId: string,
  stopId: string,
): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}/stops/${stopId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 204) {
    throw new ApiError("Failed to delete stop", response.status);
  }
}

export async function reorderTripStops(
  tripId: string,
  dayNumber: number,
  stopIds: string[],
): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/trips/${tripId}/days/${dayNumber}/reorder`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stop_ids: stopIds }),
    },
  );

  if (!response.ok) {
    throw new ApiError("Failed to reorder stops", response.status);
  }
}

export async function listTrips(limit: number = 50, offset: number = 0): Promise<TripListItem[]> {
  const token = getStoredToken();
  const response = await fetch(`${getApiBaseUrl()}/trips?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError("Failed to list trips", response.status);
  }

  return response.json();
}

export async function deleteTrip(tripId: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 204 && response.status !== 404) {
    let errorDetail = "Failed to delete trip";
    try {
      const err = await response.json();
      if (err.detail) errorDetail = err.detail;
    } catch {}
    throw new ApiError(errorDetail, response.status);
  }
}

export async function cloneTrip(tripId: string): Promise<CreateTripResponse> {
  const response = await fetch(`${getApiBaseUrl()}/trips/${tripId}/clone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError("Failed to clone trip", response.status);
  }

  return response.json();
}

export async function adjustDayItinerary(
  tripId: string,
  dayNumber: number,
  prompt: string,
): Promise<PersistedDay> {
  const response = await fetch(
    `${getApiBaseUrl()}/trips/${tripId}/days/${dayNumber}/adjust`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    },
  );

  if (!response.ok) {
    throw new ApiError("Failed to adjust day itinerary", response.status);
  }

  return response.json();
}

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  ai_credits: number;
  created_at: string;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("roamly_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("roamly_token", token);
  } else {
    localStorage.removeItem("roamly_token");
  }
}

export async function registerUser(email: string, password: string, fullName: string = ""): Promise<AuthTokenResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name: fullName }),
  });

  if (!response.ok) {
    let msg = "Registration failed";
    try {
      const err = await response.json();
      if (err.detail) msg = err.detail;
    } catch {}
    throw new ApiError(msg, response.status);
  }

  const data: AuthTokenResponse = await response.json();
  setStoredToken(data.access_token);
  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthTokenResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let msg = "Invalid email or password";
    try {
      const err = await response.json();
      if (err.detail) msg = err.detail;
    } catch {}
    throw new ApiError(msg, response.status);
  }

  const data: AuthTokenResponse = await response.json();
  setStoredToken(data.access_token);
  return data;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setStoredToken(null);
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function claimTrip(tripId: string): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await fetch(`${getApiBaseUrl()}/trips/${tripId}/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
