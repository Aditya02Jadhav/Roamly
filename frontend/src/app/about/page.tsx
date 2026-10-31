import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MaterialIcon } from "@/components/ui/material-icon";

const planningSteps = [
  {
    icon: "location_on",
    title: "Start with the trip you have in mind",
    description:
      "Choose a destination, dates, who’s travelling, and the budget and pace that suit you.",
  },
  {
    icon: "tune",
    title: "Pick a direction",
    description:
      "Compare a few itinerary styles, then choose the one that feels right for your trip.",
  },
  {
    icon: "map",
    title: "Make the days your own",
    description:
      "Review the day-by-day plan, move or edit stops, and see the selected day on a map.",
  },
] as const;

const tripDetails = [
  { icon: "calendar_today", label: "A few days, at your pace" },
  { icon: "account_balance_wallet", label: "A budget that fits your group" },
  { icon: "explore", label: "Stops you can still make your own" },
] as const;

export default function AboutPage() {
  return (
    <>
      <Navbar activeItem="about" />
      <main className="min-h-screen bg-surface pt-16">
        <section className="overflow-hidden border-b border-surface-container-highest bg-surface-container-low">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-gutter-mobile py-16 sm:px-gutter sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div>
              <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.18em] text-primary-container">
                About Roamly
              </p>
              <h1 className="mt-4 max-w-2xl font-display-hero text-display-hero tracking-tight text-on-surface">
                More of the trip.
                <br />
                Less of the planning.
              </h1>
              <p className="mt-5 max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                Roamly helps turn a destination and a few travel preferences
                into a day-by-day itinerary you can shape around your own trip.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary-container px-5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                  href="/preferences"
                >
                  Plan a trip
                  <MaterialIcon className="text-[18px]" name="arrow_forward" />
                </Link>
                <Link
                  className="inline-flex h-12 items-center rounded-xl border border-surface-container-highest bg-surface-container-lowest px-5 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                  href="/explore"
                >
                  Explore places
                </Link>
              </div>
            </div>

            <div
              aria-label="An example of a trip taking shape in Roamly"
              className="relative mx-auto w-full max-w-[510px] px-3 py-5 sm:px-7"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rotate-[-3deg] rounded-[2rem] bg-primary-container"
              />
              <div className="relative rounded-[1.7rem] border border-surface-container-highest bg-surface-container-lowest p-5 shadow-xl sm:p-7">
                <div className="flex items-start justify-between gap-3 border-b border-surface-container-highest pb-5">
                  <div>
                    <p className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
                      A trip taking shape
                    </p>
                    <h2 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">
                      Kyoto, your way
                    </h2>
                  </div>
                  <span className="rounded-full bg-secondary-container px-3 py-1 font-label-sm text-label-sm font-semibold text-primary-container">
                    Draft plan
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl bg-surface-container-low p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-primary-container">
                    <MaterialIcon className="text-[20px]" name="calendar_today" />
                  </span>
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-secondary">
                      Your dates, your pace
                    </p>
                    <p className="font-label-md text-label-md font-semibold text-on-surface">
                      A plan shaped around your days
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
                    Day at a glance
                  </p>
                  <div className="mt-4 space-y-0">
                    {[
                      ["Morning", "A temple or neighborhood to explore"],
                      ["Afternoon", "Time for food and a slower pace"],
                      ["Anytime", "Room to change the plan"],
                    ].map(([time, activity], index) => (
                      <div className="flex gap-3" key={time}>
                        <div className="flex w-5 shrink-0 flex-col items-center">
                          <span
                            className={`mt-1.5 h-3 w-3 rounded-full ${
                              index === 0
                                ? "bg-primary-container ring-4 ring-secondary-container"
                                : "border-2 border-outline-variant bg-surface-container-lowest"
                            }`}
                          />
                          {index < 2 ? (
                            <span className="my-1 min-h-8 w-px flex-1 border-l border-dashed border-outline-variant" />
                          ) : null}
                        </div>
                        <div className="pb-4">
                          <p className="font-label-sm text-label-sm font-semibold text-primary-container">
                            {time}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface">
                            {activity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-1 flex flex-wrap gap-2">
                  {tripDetails.map((detail) => (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-surface-container-highest px-3 py-1.5 font-label-sm text-label-sm text-secondary"
                      key={detail.label}
                    >
                      <MaterialIcon
                        className="text-[15px] text-primary-container"
                        name={detail.icon}
                      />
                      {detail.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="planning-heading"
          className="mx-auto max-w-[1200px] px-gutter-mobile py-16 sm:px-gutter sm:py-20"
        >
          <div className="max-w-2xl">
            <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.18em] text-primary-container">
              From idea to itinerary
            </p>
            <h2
              className="mt-3 font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface"
              id="planning-heading"
            >
              A plan you can work with, not work around.
            </h2>
            <p className="mt-3 font-body-md text-body-md leading-relaxed text-secondary">
              Get the important pieces in place, then keep the freedom to adjust
              the details as your trip comes together.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {planningSteps.map((step, index) => (
              <article
                className="rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-6"
                key={step.title}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-container text-primary-container">
                    <MaterialIcon className="text-[22px]" name={step.icon} />
                  </span>
                  <span
                    aria-label={`Step ${index + 1}`}
                    className="font-label-sm text-label-sm font-semibold text-secondary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">
                  {step.title}
                </h3>
                <p className="mt-2 font-body-md text-body-md leading-relaxed text-secondary">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-gutter-mobile py-14 sm:px-gutter sm:py-16 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.18em] text-primary-container">
                Your trip is still yours
              </p>
              <h2 className="mt-3 font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
                Start with a plan. Leave room for the unexpected.
              </h2>
              <p className="mt-3 font-body-md text-body-md leading-relaxed text-secondary">
                Roamly gives you a useful first draft—then you decide what stays,
                what moves, and what you discover along the way.
              </p>
            </div>
            <Link
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-primary-container px-5 font-label-md text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 md:self-center"
              href="/preferences"
            >
              Build your itinerary
              <MaterialIcon className="text-[18px]" name="arrow_forward" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
