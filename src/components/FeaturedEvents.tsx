import { Link } from "react-router-dom"
import EventCard, { type Event } from "@/components/EventCard"

// Mock data
// TODO: Replace this with original API call
const FEATURED_EVENTS: Event[] = [
    {
        id: "1",
        title: "Late Night Jazz Sessions",
        venue: "Blue Room, Kolkata",
        date: "Oct 12",
        price: "₹499",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    },
    {
        id: "2",
        title: "Stand-Up: Unfiltered",
        venue: "The Comedy Loft, Mumbai",
        date: "Oct 18",
        price: "₹699",
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
    },
    {
        id: "3",
        title: "Indie Rock Night",
        venue: "Warehouse 9, Bangalore",
        date: "Oct 25",
        price: "₹899",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",
    },
]

const FeaturedEvents = () => {
    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    (a) — Featured events
                </p>
                <Link to="/events" className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    View all →
                </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURED_EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    )
}

export default FeaturedEvents