import { Link } from "react-router-dom"

// TODO: Need to adjust this according to our API
export type Event = {
    id: string
    title: string
    venue: string
    date: string
    price: string
    image: string
}

const EventCard = ({ event }: { event: Event }) => {
    return (
        <Link
            to={`/events/${event.id}`}
            className="group overflow-hidden rounded-2xl border border-border bg-surface/50 transition hover:border-primary/40"
        >
            <div className="aspect-4/3 w-full overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-wide text-primary">{event.date}</p>
                <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>
                <p className="mt-3 text-sm font-semibold text-foreground">{event.price}</p>
            </div>
        </Link>
    )
}

export default EventCard