import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

const EventDetailsPage = ({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) => {
  // Extract slug synchronously without await
  const slugPromise = params.then(p => p.slug);

  return (
    <main>
      <Suspense fallback={<div>Loading event details...</div>}>
        <EventDetails params={slugPromise} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;