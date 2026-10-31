"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ChoiceIndicator } from "@/components/ui/choice-indicator";
import { MaterialIcon } from "@/components/ui/material-icon";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { AuthModal } from "@/components/shared/auth-modal";
import { TripStepProgress } from "@/components/shared/trip-step-progress";
import {
  defaultTripPreferences,
  type TripPreferencesValues,
} from "@/features/trip-preferences/lib/preferences-query";
import {
  ApiError,
  createDraftTrip,
  getStoredToken,
  setStoredToken,
} from "@/lib/api";


const popularDestinations = [
  { name: "Goa", value: "Goa, India" },
  { name: "Kyoto", value: "Kyoto, Japan" },
  { name: "Amalfi Coast", value: "Amalfi Coast, Italy" },
  { name: "Manali", value: "Manali, India" },
] as const;

const budgetOptions = [
  {
    id: "budget-friendly",
    title: "Budget-friendly",
    icon: "account_balance_wallet",
    minDaily: 1500,
    maxDaily: 3000,
    midpointDaily: 2250,
    price: "₹1,500 – ₹3,000",
    description: "Hostels, street eats, local buses",
  },
  {
    id: "moderate",
    title: "Moderate",
    icon: "coffee",
    minDaily: 3000,
    maxDaily: 7000,
    midpointDaily: 5000,
    price: "₹3,000 – ₹7,000",
    description: "Boutique stays, nice cafés, cabs",
  },
  {
    id: "comfort",
    title: "Comfort",
    icon: "recommend",
    minDaily: 7000,
    maxDaily: 15000,
    midpointDaily: 11000,
    price: "₹7,000 – ₹15,000",
    description: "4-star hotels, private drivers, tours",
  },
  {
    id: "premium",
    title: "Premium",
    icon: "auto_awesome",
    minDaily: 15000,
    maxDaily: 25000,
    midpointDaily: 20000,
    price: "₹15,000+",
    description: "Luxury resorts, fine dining, VIP pass",
  },
] as const;

const interests = [
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
] as const;

const paceOptions = [
  {
    id: "relaxed",
    title: "Relaxed",
    icon: "coffee",
    description:
      "Fewer stops, more time to soak in each place at an easy, leisurely tempo.",
    activities: "1–2 activities / day",
  },
  {
    id: "balanced",
    title: "Balanced",
    icon: "explore",
    description:
      "A comfortable mix of iconic sightseeing, hidden gems, and restorative downtime.",
    activities: "3–4 activities / day",
  },
  {
    id: "packed",
    title: "Packed",
    icon: "bolt",
    description:
      "See as much as possible throughout the day with an energetic, active schedule.",
    activities: "5+ activities / day",
  },
] as const;

const transportOptions = [
  {
    id: "public-transit",
    title: "Public transit",
    icon: "directions_subway",
    description: "Metro, buses, local trains",
  },
  {
    id: "walking",
    title: "Walking",
    icon: "directions_walk",
    description: "Pedestrian-centric paths",
  },
  {
    id: "car-or-taxi",
    title: "Car or taxi",
    icon: "local_taxi",
    description: "Cabs, rentals & drivers",
  },
  {
    id: "mixed-transit",
    title: "Mixed transit",
    icon: "shuffle",
    description: "Smart route-optimized",
  },
] as const;

const selectionCardClasses =
  "rounded-2xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 hover:shadow-sm";
const selectionCardSelectedClasses =
  "border-2 border-primary-container bg-surface-selected shadow-sm";
const selectionCardUnselectedClasses =
  "border-surface-container-highest bg-surface-container-lowest hover:border-outline hover:bg-surface/50";
const selectionChipClasses =
  "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 font-label-md text-label-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 active:scale-95";
const selectionChipSelectedClasses =
  "border-primary-container bg-surface-selected font-semibold text-primary shadow-xs";
const selectionChipUnselectedClasses =
  "border-surface-container-highest bg-surface-container-lowest font-medium text-secondary hover:border-on-surface hover:text-on-surface hover:bg-surface/50";
const selectionCardLayoutClasses =
  `grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3.5 gap-y-3.5 ${selectionCardClasses} p-4 sm:p-5`;

function SectionIntro({
  title,
  description,
  id,
}: {
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div>
      <h2
        className="font-label-lg text-label-lg font-semibold text-on-surface"
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-0.5 font-body-sm text-body-sm text-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function getTripDuration(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return "Select your travel dates";
  }

  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  const nights = Math.round((end - start) / 86_400_000);

  if (nights < 0) {
    return "Choose an end date after your start date";
  }

  return `${nights + 1} days, ${nights} nights`;
}

function getTripDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return 1;
  }

  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  const days = Math.round((end - start) / 86_400_000) + 1;
  return Number.isFinite(days) ? Math.max(1, days) : 1;
}

function getBudgetTier(totalBudget: number, days: number, travellers: number) {
  const dailyPerPerson = totalBudget / (days * travellers);
  return (
    budgetOptions.find((option) => dailyPerPerson <= option.maxDaily)?.id ??
    "premium"
  );
}

function formatRupees(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

type TripPreferencesProps = {
  initialPreferences: TripPreferencesValues;
};

export default function TripPreferences({
  initialPreferences,
}: TripPreferencesProps) {
  const router = useRouter();
  const [destination, setDestination] = useState(
    initialPreferences.destination || defaultTripPreferences.destination,
  );
  const [startDate, setStartDate] = useState(initialPreferences.startDate);
  const [endDate, setEndDate] = useState(initialPreferences.endDate);
  const [flexibleDates, setFlexibleDates] = useState(
    initialPreferences.flexibleDates,
  );
  const [adults, setAdults] = useState(initialPreferences.adults);
  const [children, setChildren] = useState(initialPreferences.children);
  const initialTripDays = getTripDays(
    initialPreferences.startDate,
    initialPreferences.endDate,
  );
  const initialTravellerCount =
    initialPreferences.adults + initialPreferences.children;
  const initialBudgetOption =
    budgetOptions.find((option) => option.id === initialPreferences.budget) ??
    budgetOptions[1];
  const [totalBudget, setTotalBudget] = useState(
    initialPreferences.totalBudget ??
      initialBudgetOption.midpointDaily *
        initialTripDays *
        initialTravellerCount,
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialPreferences.interests,
  );
  const [pace, setPace] = useState(initialPreferences.pace);
  const [transport, setTransport] = useState(initialPreferences.transport);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const tripDays = getTripDays(startDate, endDate);
  const travellerCount = adults + children;
  const minimumTotalBudget =
    budgetOptions[0].minDaily * tripDays * travellerCount;
  const maximumTotalBudget =
    budgetOptions[budgetOptions.length - 1].maxDaily *
    tripDays *
    travellerCount;
  const step = 250 * tripDays * travellerCount;
  const selectedTotalBudget = Math.max(
    minimumTotalBudget,
    Math.min(
      maximumTotalBudget,
      minimumTotalBudget +
        Math.round((totalBudget - minimumTotalBudget) / step) * step,
    ),
  );
  const budget = getBudgetTier(
    selectedTotalBudget,
    tripDays,
    travellerCount,
  );

  async function handleSubmit() {
    if (!destination.trim()) {
      setErrorMessage("Please enter a destination.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setRequiresLogin(false);

    try {
      const trip = await createDraftTrip({
        destination: destination.trim(),
        startDate,
        endDate,
        flexibleDates,
        adults,
        children,
        budget,
        totalBudget: selectedTotalBudget,
        interests: selectedInterests,
        pace,
        transport,
      });

      router.push(`/trips/${trip.id}`);
    } catch (err: unknown) {
      const isFetchFailure = err instanceof TypeError;
      const needsLogin =
        !getStoredToken() ||
        isFetchFailure ||
        (err instanceof ApiError && err.status === 401);
      if (isFetchFailure || (err instanceof ApiError && err.status === 401)) {
        setStoredToken(null);
      }
      setRequiresLogin(needsLogin);
      setErrorMessage(
        needsLogin
          ? "Login required to continue. Your trip preferences will be kept."
          : err instanceof Error
            ? err.message
            : "Could not create your trip. Please try again.",
      );
      setIsSubmitting(false);
    }
  }


  function toggleInterest(interest: string) {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  return (
    <>
      <Navbar activeItem="preferences" />

      <main className="min-h-screen w-full bg-surface pt-16">
        <TripStepProgress currentStep={1} />
        <div className="w-full bg-surface-container-low py-8 md:py-12">
          <div className="mx-auto max-w-5xl xl:max-w-6xl px-gutter-mobile sm:px-gutter">
            <header className="mx-auto mb-8 max-w-3xl text-center">
              <h1 className="mb-2 text-[32px] font-bold leading-[1.2] tracking-tight text-on-surface sm:text-[36px] md:text-display-hero">
                Let’s plan your next adventure
              </h1>
              <p className="font-body-lg text-body-lg text-secondary">
                Tell us a little about your trip. We’ll help you create an
                itinerary that fits your interests, budget, and pace.
              </p>
            </header>

            <div className="space-y-8 rounded-3xl border border-surface-container-highest/80 bg-surface-container-lowest p-6 shadow-xl shadow-black/[0.03] sm:space-y-10 sm:p-8 md:p-12">
              <section aria-labelledby="destination-heading" className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <label
                    className="flex items-center gap-1.5 font-label-lg text-label-lg text-on-surface"
                    htmlFor="destination-input"
                    id="destination-heading"
                  >
                    Where do you want to go?
                    <span aria-hidden="true" className="text-primary">
                      *
                    </span>
                    <span className="sr-only"> required</span>
                  </label>
                  <span className="font-body-sm text-body-sm text-secondary">
                    City, region, or country
                  </span>
                </div>
                <div className="relative flex items-center">
                  <MaterialIcon
                    className="pointer-events-none absolute left-4 text-[22px] text-primary"
                    name="location_on"
                  />
                  <input
                    autoComplete="off"
                    className={`h-[56px] w-full rounded-2xl border border-surface-container-highest bg-surface-container-lowest pl-12 ${
                      destination.trim() ? "pr-12" : "pr-4"
                    } font-body-lg text-body-lg text-on-surface transition-all placeholder:text-secondary focus:border-on-surface focus:outline-none focus:ring-1 focus:ring-on-surface`}
                    id="destination-input"
                    onChange={(event) => setDestination(event.target.value)}
                    placeholder="Search a city, region, or country..."
                    required
                    type="text"
                    value={destination}
                  />
                  <div className="absolute right-3.5 flex items-center gap-2">
                    {destination.trim() ? (
                      <button
                        aria-label="Clear destination"
                        className="rounded-md p-1 text-secondary transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                        onClick={() => setDestination("")}
                        type="button"
                      >
                        <MaterialIcon className="text-[18px]" name="close" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="mr-1 font-body-sm text-body-sm text-secondary">
                    Popular:
                  </span>
                  {popularDestinations.map((place) => {
                    const selected =
                      destination
                        .split(",")[0]
                        .trim()
                        .toLowerCase() === place.name.toLowerCase();
                    return (
                      <button
                        aria-pressed={selected}
                        className={`${selectionChipClasses} ${
                          selected
                            ? "border-primary-container bg-surface-selected font-semibold text-primary"
                            : "border-surface-container-highest bg-surface-container-lowest font-medium text-secondary hover:border-on-surface hover:text-on-surface"
                        }`}
                        key={place.name}
                        onClick={() => setDestination(place.value)}
                        type="button"
                      >
                        {place.name}
                      </button>
                    );
                  })}
                </div>
              </section>

              <div aria-hidden="true" className="h-px w-full bg-surface-container-highest" />

              <section
                aria-label="Travel dates and travellers"
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                <div className="space-y-3">
                  <SectionIntro title="When are you travelling?" />
                  <div className="flex min-h-[76px] items-center rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-4 transition-all hover:border-outline hover:shadow-xs">
                    <div className="min-w-0 flex-1">
                      <div className="grid grid-cols-1 items-center gap-y-1 min-[420px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[420px]:gap-y-0">
                        <span className="font-label-sm text-label-sm text-secondary min-[420px]:hidden">
                          From
                        </span>
                        <label className="sr-only" htmlFor="start-date">
                          Start date
                        </label>
                        <input
                          className="w-full min-w-0 bg-transparent font-label-md text-label-md text-on-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                          id="start-date"
                          max={endDate || undefined}
                          onChange={(event) => setStartDate(event.target.value)}
                          type="date"
                          value={startDate}
                        />
                        <span
                          aria-hidden="true"
                          className="hidden text-secondary min-[420px]:inline"
                        >
                          —
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary min-[420px]:hidden">
                          To
                        </span>
                        <label className="sr-only" htmlFor="end-date">
                          End date
                        </label>
                        <input
                          className="w-full min-w-0 bg-transparent font-label-md text-label-md text-on-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                          id="end-date"
                          min={startDate || undefined}
                          onChange={(event) => setEndDate(event.target.value)}
                          type="date"
                          value={endDate}
                        />
                      </div>
                      <p
                        aria-live="polite"
                        className="mt-1 font-body-sm text-body-sm text-secondary"
                      >
                        {getTripDuration(startDate, endDate)}
                      </p>
                    </div>
                  </div>
                  <label className="flex cursor-pointer select-none items-center gap-2.5 pt-0.5">
                    <input
                      checked={flexibleDates}
                      className="h-4 w-4 cursor-pointer rounded border-surface-container-highest accent-primary-container focus:ring-0"
                      onChange={(event) =>
                        setFlexibleDates(event.target.checked)
                      }
                      type="checkbox"
                    />
                    <span className="font-body-md text-body-md text-secondary transition-colors hover:text-on-surface">
                      My dates are flexible (±3 days)
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <SectionIntro title="Who’s travelling?" />
                  <div className="space-y-3 rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-4 transition-all hover:border-outline hover:shadow-xs">
                    <QuantityStepper
                      description="Ages 13 or above"
                      label="Adults"
                      min={1}
                      onChange={setAdults}
                      value={adults}
                    />
                    <div
                      aria-hidden="true"
                      className="h-px bg-surface-container"
                    />
                    <QuantityStepper
                      description="Ages 2 to 12"
                      label="Children"
                      min={0}
                      onChange={setChildren}
                      value={children}
                    />
                  </div>
                </div>
              </section>

              <div aria-hidden="true" className="h-px w-full bg-surface-container-highest" />

              <section aria-labelledby="budget-heading" className="space-y-3.5">
                <SectionIntro
                  description="Set a total trip budget for everyone, excluding airfare. The tiers below also guide your daily travel style."
                  id="budget-heading"
                  title="What’s your budget?"
                />
                <div className="space-y-3 rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-5 transition-all hover:border-outline hover:shadow-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <label
                      className="font-label-md text-label-md font-semibold text-on-surface"
                      htmlFor="total-trip-budget"
                    >
                      Total trip budget
                    </label>
                    <output
                      className="font-headline-sm text-headline-sm font-bold text-primary-container"
                      htmlFor="total-trip-budget"
                      id="total-trip-budget-value"
                    >
                      {formatRupees(selectedTotalBudget)}
                    </output>
                  </div>
                  <input
                    aria-label="Total trip budget in rupees"
                    aria-valuetext={`${formatRupees(selectedTotalBudget)} total trip budget`}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full accent-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-4"
                    id="total-trip-budget"
                    max={maximumTotalBudget}
                    min={minimumTotalBudget}
                    onChange={(event) => {
                      const amount = Number(event.target.value);
                      setTotalBudget(amount);
                    }}
                    step={step}
                    style={{
                      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
                        ((selectedTotalBudget - minimumTotalBudget) /
                          (maximumTotalBudget - minimumTotalBudget)) *
                        100
                      }%, var(--color-border) ${
                        ((selectedTotalBudget - minimumTotalBudget) /
                          (maximumTotalBudget - minimumTotalBudget)) *
                        100
                      }%, var(--color-border) 100%)`,
                    }}
                    type="range"
                    value={selectedTotalBudget}
                  />
                  <div className="flex justify-between font-label-sm text-label-sm text-secondary">
                    <span>{formatRupees(minimumTotalBudget)}</span>
                    <span>{formatRupees(maximumTotalBudget)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">
                    {tripDays} {tripDays === 1 ? "day" : "days"} ·{" "}
                    {travellerCount}{" "}
                    {travellerCount === 1 ? "traveller" : "travellers"}
                  </p>
                </div>
                <div
                  aria-label="Choose a daily budget"
                  className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
                  role="group"
                >
                  {budgetOptions.map((option) => {
                    const selected = budget === option.id;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`${selectionCardLayoutClasses} ${
                          selected ? selectionCardSelectedClasses : selectionCardUnselectedClasses
                        }`}
                        key={option.id}
                        onClick={() => {
                          setTotalBudget(
                            option.midpointDaily * tripDays * travellerCount,
                          );
                        }}
                        type="button"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-primary-fixed text-primary"
                              : "bg-surface-container text-on-surface"
                          }`}
                        >
                          <MaterialIcon className="text-[20px]" name={option.icon} />
                        </span>
                        <ChoiceIndicator selected={selected} />
                        <span className="col-span-2 space-y-1">
                          <span
                            className={`block font-label-md text-label-md font-semibold ${
                              selected ? "text-primary" : "text-on-surface"
                            }`}
                          >
                            {option.title}
                          </span>
                          <span
                            className={`block font-label-lg text-label-lg font-bold ${
                              selected ? "text-primary" : "text-on-surface"
                            }`}
                          >
                            {option.price} / person / day
                          </span>
                          <span className="block font-body-sm text-body-sm text-secondary">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div aria-hidden="true" className="h-px w-full bg-surface-container-highest" />

              <section aria-labelledby="interests-heading" className="space-y-3.5">
                <div className="flex flex-col items-start gap-1">
                  <SectionIntro
                    description={`Choose a few things you’d love to experience in ${
                      destination.split(",")[0] || "your destination"
                    }.`}
                    id="interests-heading"
                    title="What do you enjoy?"
                  />
                  <span
                    aria-live="polite"
                    className="font-body-sm text-body-sm text-secondary"
                  >
                    {selectedInterests.length} selected
                  </span>
                </div>
                <div aria-label="Choose your interests" className="flex flex-wrap gap-2.5" role="group">
                  {interests.map((interest) => {
                    const selected = selectedInterests.includes(interest);
                    return (
                      <button
                        aria-pressed={selected}
                        className={`${selectionChipClasses} ${
                          selected ? selectionChipSelectedClasses : selectionChipUnselectedClasses
                        }`}
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        type="button"
                      >
                        <span>{interest}</span>
                        {selected ? (
                          <MaterialIcon
                            className="text-[16px]"
                            name="check"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </section>

              <div aria-hidden="true" className="h-px w-full bg-surface-container-highest" />

              <section aria-labelledby="pace-heading" className="space-y-3.5">
                <SectionIntro
                  description="Determines how many activities are scheduled per day"
                  id="pace-heading"
                  title="What’s your travel style?"
                />
                <div
                  aria-label="Choose your travel pace"
                  className="grid grid-cols-1 gap-3.5 md:grid-cols-3"
                  role="group"
                >
                  {paceOptions.map((option) => {
                    const selected = pace === option.id;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`${selectionCardLayoutClasses} ${
                          selected ? selectionCardSelectedClasses : selectionCardUnselectedClasses
                        }`}
                        key={option.id}
                        onClick={() => setPace(option.id)}
                        type="button"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-primary-fixed text-primary"
                              : "bg-surface-container text-on-surface"
                          }`}
                        >
                          <MaterialIcon className="text-[20px]" name={option.icon} />
                        </span>
                        <ChoiceIndicator selected={selected} />
                        <span className="col-span-2">
                          <span
                            className={`mb-1 block font-label-lg text-label-lg font-semibold ${
                              selected ? "font-bold text-primary" : "text-on-surface"
                            }`}
                          >
                            {option.title}
                          </span>
                          <span className="block font-body-sm text-body-sm text-secondary">
                            {option.description}
                          </span>
                          <span
                            className={`mt-3 block font-body-sm text-body-sm ${
                              selected
                                ? "font-semibold text-primary"
                                : "text-secondary"
                            }`}
                          >
                            {option.activities}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div aria-hidden="true" className="h-px w-full bg-surface-container-highest" />

              <section aria-labelledby="transport-heading" className="space-y-3.5">
                <SectionIntro
                  description="We will sequence stops based on your chosen mode of transport"
                  id="transport-heading"
                  title="How would you like to get around?"
                />
                <div
                  aria-label="Choose a mode of transport"
                  className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
                  role="group"
                >
                  {transportOptions.map((option) => {
                    const selected = transport === option.id;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`${selectionCardLayoutClasses} ${
                          selected ? selectionCardSelectedClasses : selectionCardUnselectedClasses
                        }`}
                        key={option.id}
                        onClick={() => setTransport(option.id)}
                        type="button"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-primary-fixed text-primary"
                              : "bg-surface-container text-on-surface"
                          }`}
                        >
                          <MaterialIcon className="text-[20px]" name={option.icon} />
                        </span>
                        <ChoiceIndicator selected={selected} />
                        <span className="col-span-2">
                          <span
                            className={`block font-label-md text-label-md font-semibold ${
                              selected ? "font-bold text-primary" : "text-on-surface"
                            }`}
                          >
                            {option.title}
                          </span>
                          <span className="block font-body-sm text-body-sm text-secondary">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-status-error/20 bg-status-error/10 p-4 text-status-error"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <MaterialIcon
                      className="shrink-0 text-[20px]"
                      name="info"
                    />
                    <span className="font-body-sm text-body-sm font-medium">
                      {errorMessage}
                    </span>
                  </span>
                  {requiresLogin ? (
                    <button
                      className="shrink-0 rounded-lg bg-primary-container px-4 py-2 font-label-sm text-label-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                      onClick={() => setIsLoginModalOpen(true)}
                      type="button"
                    >
                      Log in
                    </button>
                  ) : null}
                </div>
              )}

              <div className="flex flex-col items-stretch justify-between gap-5 border-t border-surface-container-highest/80 pt-8 md:flex-row md:items-center">
                <div className="flex max-w-md items-center gap-2.5">
                  <MaterialIcon
                    className="shrink-0 text-[20px] text-secondary"
                    name="info"
                  />
                  <p className="font-body-sm text-body-sm text-secondary">
                    Your preferences help us personalize your trip. You can
                    fine-tune every stop later on the interactive map.
                  </p>
                </div>
                <Button
                  className="h-12 w-full shrink-0 gap-2 rounded-xl px-8 shadow-sm active:scale-[0.99] md:w-auto"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Generating options...</span>
                    </>
                  ) : (
                    <>
                      <span>Create my itinerary</span>
                      <MaterialIcon className="text-[18px]" name="arrow_forward" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-body-sm text-body-sm text-secondary">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  className="text-[18px] text-status-success"
                  name="check_circle"
                />
                <span>100% free itinerary generator</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon
                  className="text-[18px] text-status-success"
                  name="tune"
                />
                <span>Fully customizable at any step</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon
                  className="text-[18px] text-status-success"
                  name="offline_pin"
                />
                <span>Save &amp; export for offline use</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          void handleSubmit();
        }}
      />
    </>
  );
}
