import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getTripSummary } from "@/lib/api";
import { TripOverviewClient } from "@/features/trip-overview/components/trip-overview-client";

type TripOverviewPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function TripOverviewPage({
  params,
}: TripOverviewPageProps) {
  const { tripId } = await params;

  if (!tripId || tripId === "new") {
    notFound();
  }

  let summary = null;
  try {
    summary = await getTripSummary(tripId);
  } catch (error) {
    console.error(`Error loading summary for trip ${tripId}:`, error);
  }

  if (!summary) {
    notFound();
  }

  return (
    <>
      <Navbar activeItem="my-trips" />
      <main className="min-h-screen w-full flex-1 bg-surface-container-lowest pt-16">
        <TripOverviewClient summary={summary} />
      </main>
      <Footer />
    </>
  );
}
