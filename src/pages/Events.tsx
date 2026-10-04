import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { X } from "lucide-react"
import { getAllEvents } from "@/lib/api"
import type { EventItem } from "@/lib/types"
import { EventCategory } from "@/lib/types"
import EventCard from "@/components/EventCard"
import { PageHeading, SkeletonCard, EmptyState } from "@/components/ui-kit"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"

const EVENTS_SHAPES = [
    { type: "circle" as const, size: 110, top: "5%", right: "6%", delay: 0, duration: 10 },
    { type: "square" as const, size: 48, bottom: "10%", left: "4%", delay: 1, duration: 9 },
]

const CATEGORY_LABELS: Record<string, string> = {
    [EventCategory.Music]: "Music",
    [EventCategory.Comedy]: "Comedy",
    [EventCategory.Theatre]: "Theatre",
    [EventCategory.Talks]: "Talks",
    [EventCategory.Sports]: "Sports",
    [EventCategory.Other]: "Other",
}

const Events = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get("category") ?? undefined

    const [events, setEvents] = useState<EventItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchEvents = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await getAllEvents(category)
                if (!cancelled) setEvents(res.data.events)
            } catch (err) {
                if (!cancelled) {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message ?? "Couldn't load events. Try again."
                        : "Couldn't load events. Try again."
                    setError(message)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchEvents()
        return () => {
            cancelled = true
        }
    }, [category])

    const clearFilter = () => setSearchParams({})

    return (
        <section className="relative overflow-hidden px-6 py-16">
            <AmbientGlow />
            <BackgroundShapes shapes={EVENTS_SHAPES} />

            <div className="relative mx-auto max-w-6xl">
                <PageHeading
                    eyebrow="Browse"
                    title="All events"
                    subtitle="Every show, talk, and stage night — in one place."
                />

                {category && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                            {CATEGORY_LABELS[category] ?? category}
                            <button
                                type="button"
                                onClick={clearFilter}
                                className="cursor-pointer text-primary/70 hover:text-primary"
                                aria-label="Clear filter"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    </div>
                )}

                <div className="mt-8">
                    {loading ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : error ? (
                        <EmptyState title="Can't reach the box office" hint={error} />
                    ) : events.length === 0 ? (
                        <EmptyState
                            title="No shows yet"
                            hint={category ? "No events in this category right now." : "New events will appear here as soon as they're listed."}
                        />
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Events