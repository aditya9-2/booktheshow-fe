import { Link } from "react-router-dom"
import type { EventItem } from "@/lib/types"

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

const priceRange = (sections?: EventItem["sections"]) => {
    if (!sections?.length) return "TBA"

    const prices = sections.map((s) => s.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    return min === max ? `₹${min}` : `₹${min} – ₹${max}`
}

const EventCard = ({ event }: { event: EventItem }) => {
    return (
        <Link
            to={`/events/${event._id}`}
            className="group overflow-hidden rounded-2xl border border-border bg-surface/50 transition hover:border-primary/40"
        >
            <div className="aspect-4/3 w-full overflow-hidden bg-muted">
                {event.posterUrl ? (
                    <img
                        src={event.posterUrl}
                        alt={event.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        No poster
                    </div>
                )}
            </div>

            <div className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-wide text-primary">
                    {formatDate(event.date)}
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                    {event.name}
                </h3>

                <p className="mt-3 text-sm font-semibold text-foreground">
                    {priceRange(event.sections)}
                </p>
            </div>
        </Link>
    )
}

export default EventCard
