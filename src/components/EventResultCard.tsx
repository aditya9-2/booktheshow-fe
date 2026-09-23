import type { EventItem } from "@/lib/types"

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const priceRange = (sections: EventItem["sections"]) => {
    if (!sections?.length) return "TBA"
    const prices = sections.map((s) => s.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `₹${min}` : `₹${min}–₹${max}`
}


const EventResultCard = ({ event, onAsk }: { event: EventItem; onAsk: (prompt: string) => void }) => {
    return (
        <button
            type="button"
            onClick={() => onAsk(`Tell me more about "${event.name}" and its availability.`)}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-left transition hover:border-primary/40"
        >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {event.posterUrl ? (
                    <img
                        src={event.posterUrl}
                        alt={event.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                        No image
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{event.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(event.date)}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-primary">{priceRange(event.sections)}</p>
        </button>
    )
}

export default EventResultCard