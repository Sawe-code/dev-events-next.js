import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

// Fix URL - add https:// if missing
const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

const BASE_URL = getBaseUrl();

const Page = async () => {
  'use cache'; // Add this back but properly
  
  let events: IEvent[] = [];
  
  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      next: { revalidate: 3600 },
    });
    
    if (response.ok) {
      const data = await response.json();
      events = data.events || [];
    }
  } catch (error) {
    // Use static events as fallback
    const staticEvents = await import('@/lib/constants');
    events = staticEvents.default as IEvent[];
  }

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.slug} className="list-none">
              <EventCard 
                title={event.title}
                image={event.image}
                slug={event.slug}
                location={event.location}
                date={event.date}
                time={event.time}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;