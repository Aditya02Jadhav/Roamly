"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ButtonLink } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

const destinations = [
  {
    name: "Goa",
    description: "Beaches & slow days",
    alt: "Sunlit tropical coastline of Palolem Beach in Goa with golden sand, anchored rustic wooden fishing outrigger boats, towering lush coconut palms, and gentle turquoise waves under clear sky.",
    image: "/images/goa-coast.jpg",
  },
  {
    name: "Kyoto",
    description: "Culture & discovery",
    alt: "A traditional Kyoto temple garden viewed through dark wooden architecture, with a carefully raked stone garden and lush green trees.",
    image: "/images/kyoto-balanced.jpg",
  },
  {
    name: "Amalfi Coast",
    description: "Cliffside walks & sunsets",
    alt: "Sweeping view of Positano on the Amalfi Coast with colorful pastel cliffside villas cascading down to deep azure Mediterranean sea, speckled with sun umbrellas and small yachts.",
    image: "/images/amalfi-coast-clean.jpg",
  },
  {
    name: "Varanasi",
    description: "Heritage & river ghats",
    alt: "Atmospheric early morning sunrise at Varanasi river ghats over the sacred Ganges river, with historic stone temples, wooden rowing boats gliding on misted golden water, and warm radiant morning sunlight.",
    image: "/images/varanasi.jpg",
  },
];

const popularDestinations = ["Goa", "Kyoto", "Amalfi Coast", "Varanasi", "Bali"];

export default function Home() {
  const [destination, setDestination] = useState("");

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-surface pt-16">
        <div className="flex w-full flex-col">
          <div className="mx-auto w-full max-w-[1200px] px-gutter py-space-xl">
            <section className="mx-auto flex max-w-4xl flex-col items-center pt-6 pb-2 text-center">
              <h1 className="font-display-hero text-display-hero tracking-tight text-on-surface">
                Less planning. More discovering.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                Tell us where you want to go. Get a personalized itinerary,
                discover places worth visiting, and see your trip come together
                on a map.
              </p>

              <div className="mt-8 w-full max-w-3xl rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-3 shadow-sm transition-all">
                <div
                  className="flex w-full flex-col items-center gap-3 md:flex-row"
                >
                  <label className="flex min-h-14 w-full flex-1 items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low px-3 py-2 text-left transition-colors hover:bg-surface-container focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container">
                    <MaterialIcon
                      className="select-none text-[22px] text-secondary"
                      name="location_on"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                        Destination
                      </span>
                      <input
                        className="h-6 w-full bg-transparent font-body-lg text-body-lg font-medium leading-6 text-on-surface placeholder:text-secondary focus:outline-none"
                        onChange={(event) => setDestination(event.target.value)}
                        placeholder="Where do you want to go?"
                        type="text"
                        value={destination}
                      />
                    </span>
                  </label>

                  <div className="hidden h-10 w-px bg-surface-container-highest md:block" />

                  <label className="flex min-h-14 w-full flex-1 cursor-text items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low px-3 py-2 text-left transition-colors hover:bg-surface-container focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container">
                    <MaterialIcon
                      className="select-none text-[22px] text-secondary"
                      name="calendar_month"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                        Travel dates
                      </span>
                      <input
                        className="h-6 w-full cursor-text bg-transparent font-body-lg text-body-lg leading-6 text-on-surface placeholder:text-secondary focus:outline-none"
                        id="dates-trigger"
                        placeholder="Add your dates"
                        type="text"
                      />
                    </span>
                  </label>

                  <ButtonLink
                    className="w-full whitespace-nowrap md:w-auto"
                    href="/preferences"
                  >
                    <span>Plan a trip</span>
                    <MaterialIcon
                      className="text-[18px]"
                      name="arrow_forward"
                    />
                  </ButtonLink>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                <span className="mr-1 font-body-sm text-body-sm text-secondary">
                  Popular:
                </span>
                {popularDestinations.map((popularDestination) => (
                  <button
                    className="h-9 rounded-full border border-outline-variant bg-surface-container-lowest px-4 font-label-sm text-label-sm text-on-surface transition-colors hover:border-primary-container hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                    key={popularDestination}
                    onClick={() => setDestination(popularDestination)}
                    type="button"
                  >
                    {popularDestination}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-20">
              <div className="mb-8 flex flex-col items-center text-center">
                <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
                  Find inspiration for your next trip
                </h2>
                <p className="mt-1 font-body-md text-body-md text-secondary">
                  Curated starting points with handpicked stops, pacing, and map
                  routes.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {destinations.map((place) => (
                  <Link
                    aria-label={`Choose ${place.name} as your destination`}
                    className="group flex cursor-pointer flex-col text-left"
                    href={{
                      pathname: "/preferences",
                      query: { destination: place.name },
                    }}
                    key={place.name}
                  >
                    <span className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container">
                      <Image
                        alt={place.alt}
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        fill
                        loading="eager"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        src={place.image}
                      />
                    </span>
                    <span className="mt-3 font-headline-sm text-headline-sm text-on-surface transition-colors group-hover:text-primary-container">
                      {place.name}
                    </span>
                    <span className="mt-0.5 font-body-md text-body-md text-secondary">
                      {place.description}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-24 rounded-2xl border border-surface-container-highest/60 bg-surface-container-low px-8 py-16 md:px-12">
              <div className="mx-auto max-w-xl text-center">
                <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
                  How Roamly works
                </h2>
                <p className="mt-2 font-label-lg text-label-lg text-secondary">
                  From initial idea to a day-by-day map route in minutes
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                <article className="flex flex-col items-start rounded-xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-container-highest bg-surface-container-lowest text-primary-container shadow-sm">
                    <MaterialIcon className="text-[24px]" name="tune" />
                  </div>
                  <h3 className="mt-4 font-headline-sm text-headline-sm text-on-surface">
                    1. Tell us what you love
                  </h3>
                  <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Choose your destination, dates, budget and interests. We
                    prioritize what matters most to your travel style.
                  </p>
                </article>

                <article className="flex flex-col items-start rounded-xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-container-highest bg-surface-container-lowest text-primary-container shadow-sm">
                    <MaterialIcon
                      className="text-[24px]"
                      name="auto_awesome"
                    />
                  </div>
                  <h3 className="mt-4 font-headline-sm text-headline-sm text-on-surface">
                    2. Get your personalized plan
                  </h3>
                  <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    AI helps organize relevant places into a practical
                    itinerary, scheduling stops with realistic travel times.
                  </p>
                </article>

                <article className="flex flex-col items-start rounded-xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-container-highest bg-surface-container-lowest text-primary-container shadow-sm">
                    <MaterialIcon className="text-[24px]" name="map" />
                  </div>
                  <h3 className="mt-4 font-headline-sm text-headline-sm text-on-surface">
                    3. Explore your trip on a map
                  </h3>
                  <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Edit stops, rearrange your days and view routes seamlessly
                    on an interactive map anytime during your trip.
                  </p>
                </article>
              </div>
            </section>

            <section className="mt-20 mb-16 rounded-2xl border border-surface-container-highest bg-surface-container-lowest px-6 py-14 text-center">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Your next adventure starts here.
              </h2>
              <p className="mx-auto mt-3 max-w-lg font-body-lg text-body-lg text-secondary">
                Create a trip that fits your interests, budget and pace.
              </p>
              <div className="mt-6 flex flex-col items-center">
                <ButtonLink
                  href="/preferences"
                >
                  <span>Plan a trip</span>
                  <MaterialIcon className="text-[18px]" name="arrow_forward" />
                </ButtonLink>
                <p className="mt-4 font-label-md text-label-md text-secondary">
                  Simple day-by-day itineraries • Interactive map export • Only
                  ₹99 per trip
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
