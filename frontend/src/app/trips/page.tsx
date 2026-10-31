import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MyTripsClient } from "@/features/my-trips/components/my-trips-client";

export default function MyTripsPage() {
  return (
    <>
      <Navbar activeItem="my-trips" />
      <main className="min-h-screen w-full flex-1 bg-surface-container-lowest pt-16">
        <MyTripsClient />
      </main>
      <Footer />
    </>
  );
}
