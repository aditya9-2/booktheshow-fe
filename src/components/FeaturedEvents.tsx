import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { getAllEvents } from "@/lib/api"
import type { EventItem } from "@/lib/types"
import EventCard from "@/components/EventCard"
import { EmptyState, SkeletonCard } from "@/components/ui-kit"

const FeaturedEvents = () => {
    const [events, setEvents] = useState<EventItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchEvents = async () => {
            setLoading(true)
            setError(null)

            try {
                const res = await getAllEvents()

                if (!cancelled) {
                    setEvents(res.data.events)
                }
            } catch (err) {
                if (!cancelled) {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message ??
                          "Couldn't load featured events."
                        : "Couldn't load featured events."

                    setError(message)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchEvents()

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    (a) — Featured events
                </p>

                <Link
                    to="/events"
                    className="font-mono text-xs uppercase tracking-[0.2em] text-primary"
                >
                    View all →
                </Link>
            </div>

            <div className="mt-8">
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : error ? (
                    <EmptyState
                        title="Couldn't load featured events"
                        hint={error}
                    />
                ) : events.length === 0 ? (
                    <EmptyState
                        title="No featured events"
                        hint="New events will appear here as soon as they're listed."
                    />
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {events.slice(0, 3).map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default FeaturedEvents
