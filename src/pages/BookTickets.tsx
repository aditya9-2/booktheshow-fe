import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { Minus, Plus, Ticket } from "lucide-react"
import { getEventById, createBooking } from "@/lib/api"
import type { EventItem, EventSection } from "@/lib/types"
import { Button, Panel, EmptyState } from "@/components/ui-kit"
import { useToast } from "@/components/Toast"
import TopProgressBar from "@/components/TopProgressBar"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"

const BOOK_SHAPES = [
    { type: "circle" as const, size: 100, top: "6%", right: "8%", delay: 0, duration: 9 },
]

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

const MAX_TICKETS_PER_BOOKING = 10

const BookTickets = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [event, setEvent] = useState<EventItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedSection, setSelectedSection] = useState<EventSection | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [quantityError, setQuantityError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!id) return
        let cancelled = false

        const fetchEvent = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await getEventById(id)
                if (!cancelled) {
                    setEvent(res.data.event)
                    // Default to the first section with availability
                    const firstAvailable = res.data.event.sections.find((s) => s.remaining > 0)
                    setSelectedSection(firstAvailable ?? res.data.event.sections[0] ?? null)
                }
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

    const maxAllowed = selectedSection
        ? Math.min(selectedSection.remaining, MAX_TICKETS_PER_BOOKING)
        : MAX_TICKETS_PER_BOOKING


    const validateQuantity = (value: number): string | null => {
        if (!Number.isInteger(value)) return "Enter a whole number."
        if (value < 1) return "You need at least 1 ticket."
        if (selectedSection && value > selectedSection.remaining) {
            return `Only ${selectedSection.remaining} left in this section.`
        }
        if (value > MAX_TICKETS_PER_BOOKING) {
            return `Max ${MAX_TICKETS_PER_BOOKING} tickets per booking.`
        }
        return null
    }

    const handleQuantityChange = (raw: string) => {
        const value = Number(raw)
        if (raw === "") {
            setQuantity(1)
            setQuantityError(null)
            return
        }
        setQuantity(value)
        setQuantityError(validateQuantity(value))
    }

    const adjustQuantity = (delta: number) => {
        const next = quantity + delta
        setQuantity(next)
        setQuantityError(validateQuantity(next))
    }

    const handleSectionSelect = (section: EventSection) => {
        setSelectedSection(section)
        // Re-validate current quantity against the newly selected section's stock
        setQuantityError(validateQuantity(quantity))
    }

    const totalPrice = selectedSection ? selectedSection.price * quantity : 0

    const handleBook = async () => {
        if (!event || !selectedSection) return

        const validation = validateQuantity(quantity)
        if (validation) {
            setQuantityError(validation)
            return
        }

        setSubmitting(true)
        try {
            // fresh idempotency key per booking attempt
            const idempotencyKey = crypto.randomUUID()

            const res = await createBooking({
                eventId: event._id,
                sectionId: selectedSection._id,
                quantity,
                idempotencyKey,
            })

            showToast(res.data.message ?? "Booking confirmed!", "success")
            navigate("/bookings")
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Booking failed. Try again."
                : "Booking failed. Try again."
            showToast(message, "error")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <section className="mx-auto max-w-3xl px-6 py-16">
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
        <>
            <TopProgressBar loading={submitting} />

            <section className="relative overflow-hidden px-6 py-16">
                <AmbientGlow />
                <BackgroundShapes shapes={BOOK_SHAPES} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mx-auto max-w-2xl"
                >
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Book tickets</p>
                    <h1 className="mt-3 font-display text-4xl tracking-wide">{event.name}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{formatDate(event.date)}</p>

                    {/* Section picker */}
                    <div className="mt-8">
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                            Choose a section
                        </p>
                        <div className="mt-3 flex flex-col gap-3">
                            {event.sections.map((section) => {
                                const isSelected = selectedSection?._id === section._id
                                const isSoldOut = section.remaining === 0

                                return (
                                    <button
                                        key={section._id}
                                        type="button"
                                        disabled={isSoldOut}
                                        onClick={() => handleSectionSelect(section)}
                                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-surface/50 hover:border-primary/40"
                                            }`}
                                    >
                                        <div>
                                            <p className="font-semibold text-foreground">{section.name}</p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {isSoldOut ? "Sold out" : `${section.remaining} of ${section.capacity} left`}
                                            </p>
                                        </div>
                                        <p className="text-lg font-semibold text-foreground">₹{section.price}</p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quantity stepper */}
                    <div className="mt-8">
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                            Quantity
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => adjustQuantity(-1)}
                                disabled={quantity <= 1}
                                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface/50 transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={16} />
                            </button>

                            <input
                                type="number"
                                inputMode="numeric"
                                value={quantity}
                                min={1}
                                max={maxAllowed}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                                className="w-20 rounded-xl border border-border bg-surface/80 px-3 py-2.5 text-center text-lg font-semibold text-foreground outline-none focus:border-primary/50"
                            />

                            <button
                                type="button"
                                onClick={() => adjustQuantity(1)}
                                disabled={quantity >= maxAllowed}
                                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface/50 transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Increase quantity"
                            >
                                <Plus size={16} />
                            </button>

                            <p className="text-xs text-muted-foreground">Max {maxAllowed} per booking</p>
                        </div>
                        {quantityError && <p className="mt-2 text-sm text-destructive">{quantityError}</p>}
                    </div>

                    {/* Summary + confirm */}
                    <Panel className="mt-8 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {quantity} × {selectedSection?.name ?? "—"}
                            </p>
                            <p className="text-2xl font-semibold text-foreground">₹{totalPrice}</p>
                        </div>

                        <Button
                            variant="primary"
                            className="mt-5 w-full"
                            disabled={submitting || !!quantityError || !selectedSection}
                            onClick={handleBook}
                        >
                            <Ticket size={16} className="mr-2" />
                            {submitting ? "Booking…" : "Confirm booking"}
                        </Button>

                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            No payment required right now — tickets are confirmed instantly.
                        </p>
                    </Panel>

                    {/* TODO: integrate a payment gateway */}
                </motion.div>
            </section>
        </>
    )
}

export default BookTickets