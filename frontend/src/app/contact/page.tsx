import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MaterialIcon } from "@/components/ui/material-icon";

const nextSteps = [
  {
    icon: "explore",
    title: "Looking for ideas?",
    description:
      "Browse destinations and find a place that fits the kind of trip you want.",
    label: "Explore places",
    href: "/explore",
  },
  {
    icon: "map",
    title: "Ready to plan?",
    description:
      "Choose your destination, travel dates, group, and budget to get started.",
    label: "Plan a trip",
    href: "/preferences",
  },
  {
    icon: "info",
    title: "New to Roamly?",
    description:
      "See how Roamly turns your travel preferences into a flexible itinerary.",
    label: "About Roamly",
    href: "/about",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <Navbar activeItem="contact" />
      <main className="min-h-screen bg-surface pt-16">
        <section className="border-b border-surface-container-highest bg-surface-container-low">
          <div className="mx-auto grid max-w-[1200px] items-center gap-1 px-gutter-mobile py-16 sm:px-gutter sm:py-20 lg:grid-cols-[1fr_auto] lg:gap-16 lg:py-24">
            <div
              aria-label="Travel inspiration from Jaipur, Kyoto, and Goa"
              className="contact-shuffle relative mx-auto h-[280px] w-[230px] sm:h-[320px] sm:w-[270px] ml-20"
            >
              {[
                {
                  image: "/images/hawa-mahal.jpg",
                  destination: "Jaipur, India",
                  alt: "Hawa Mahal in Jaipur",
                },
                {
                  image: "/images/kyoto-balanced.jpg",
                  destination: "Kyoto, Japan",
                  alt: "A Kyoto travel scene",
                },
                {
                  image: "/images/goa-coast.jpg",
                  destination: "Goa, India",
                  alt: "The coast of Goa",
                },
              ].map((card) => (
                <article
                  className="contact-shuffle-card absolute inset-0 overflow-hidden rounded-[1.8rem] border border-surface-container-highest bg-surface-container-lowest p-2.5 shadow-xl"
                  key={card.destination}
                >
                  <div className="relative h-full overflow-hidden rounded-[1.35rem]">
                    <Image
                      alt={card.alt}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 640px) 230px, 270px"
                      src={card.image}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-4 pt-12">
                      <p className="font-label-sm text-label-sm font-semibold text-white">
                        {card.destination}
                      </p>
                      <p className="mt-1 font-body-sm text-body-sm text-white/85">
                        Find your next somewhere
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="max-w-2xl">
              <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.18em] text-primary-container">
                Contact Roamly
              </p>
              <h1 className="mt-4 font-display-hero text-display-hero tracking-tight text-on-surface">
                What can we help you find?
              </h1>
              <p className="mt-5 max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                Whether you’re choosing a destination or shaping your days,
                take the next step toward a trip that feels like yours.
              </p>
            </div>            
          </div>
        </section>

        <section
          aria-labelledby="next-step-heading"
          className="mx-auto max-w-[1200px] px-gutter-mobile py-16 sm:px-gutter sm:py-20"
        >
          <div className="max-w-2xl">
            <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.18em] text-primary-container">
              Find your way
            </p>
            <h2
              className="mt-3 font-headline-lg text-headline-lg font-bold text-on-surface"
              id="next-step-heading"
            >
              Start with what you need
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {nextSteps.map((step) => (
              <article
                className="flex flex-col rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-6"
                key={step.title}
              >
                <MaterialIcon
                  className="text-2xl text-primary-container"
                  name={step.icon}
                />
                <h3 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
                <Link
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg font-label-md text-label-md font-semibold text-primary-container transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                  href={step.href}
                >
                  {step.label}
                  <MaterialIcon
                    className="text-[18px]"
                    name="arrow_forward"
                  />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
