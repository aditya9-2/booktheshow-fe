import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { getEventById } from "@/lib/api"
import type { EventItem } from "@/lib/types"
import { Button, Panel, EmptyState } from "@/components/ui-kit"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { ArrowLeft } from "lucide-react"
import { DETAIL_SHAPES } from "@/constants/backgroundShapes"



const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    })

const EventDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>()
    const [event, setEvent] = useState<EventItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        let cancelled = false

        const fetchEvent = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await getEventById(id)
                if (!cancelled) setEvent(res.data.event)
            } catch (err) {
                if (!cancelled) {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message ?? "This event couldn't be found."
                        : "This event couldn't be found."
                    setError(message)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchEvent()
        return () => {
            cancelled = true
        }
    }, [id])

    if (loading) {
        return (
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface/50" />
            </section>
        )
    }

    if (error || !event) {
        return (
            <section className="mx-auto max-w-3xl px-6 py-16">
                <EmptyState title="Event not found" hint={error ?? "This show may no longer be listed."} />
                <div className="mt-6 flex justify-center">
                    <Link to="/events">
                        <Button variant="primary">Back to events</Button>
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section className="relative overflow-hidden px-6 py-16">
            <AmbientGlow />
            <BackgroundShapes shapes={DETAIL_SHAPES} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-12"
            >
                <div className="lg:col-span-5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Button>
                    <div className="aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted">
                        {event.posterUrl ? (
                            <img src={event.posterUrl} alt={event.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                No poster
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                        {formatDate(event.date)}
                    </p>
                    <h1 className="mt-3 text-balance font-display text-4xl leading-[0.95] tracking-wide sm:text-5xl">
                        {event.name}
                    </h1>

                    <div className="mt-8 flex flex-col gap-3">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Sections
                        </p>
                        {event.sections.map((section) => (
                            <Panel
                                key={section._id}
                                className="flex items-center justify-between p-4"
                            >
                                <div>
                                    <p className="font-semibold text-foreground">{section.name}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {section.remaining} of {section.capacity} left
                                    </p>
                                </div>
                                <p className="text-lg font-semibold text-foreground">₹{section.price}</p>
                            </Panel>
                        ))}
                    </div>

                    <Link to={`/events/${event._id}/book`} className="mt-8 inline-flex">
                        <Button variant="primary">Book tickets</Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}

export default EventDetail