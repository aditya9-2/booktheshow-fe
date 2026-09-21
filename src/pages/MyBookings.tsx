import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowLeft, Ticket, Download } from "lucide-react"
import { getMyBookings } from "@/lib/api"
import type { MyBooking } from "@/lib/types"
import { generateTicketPDF } from "@/lib/generateTicket"
import { PageHeading, Panel, SkeletonCard, EmptyState, Button } from "@/components/ui-kit"
import { useAuthStore } from "@/store/authStore"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"

const BOOKINGS_SHAPES = [
    {
        type: "circle" as const,
        size: 100,
        top: "5%",
        right: "6%",
        delay: 0,
        duration: 9
    },
]

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })

const MyBookings = () => {
    const navigate = useNavigate();

    const email = useAuthStore((s) => s.email)

    const [bookings, setBookings] = useState<MyBooking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchBookings = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await getMyBookings()
                if (!cancelled) setBookings(res.data.bookings)
            } catch (err) {
                if (!cancelled) {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message ?? "Couldn't load your bookings."
                        : "Couldn't load your bookings."
                    setError(message)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchBookings()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section className="relative overflow-hidden px-6 py-16">
            <AmbientGlow />
            <BackgroundShapes shapes={BOOKINGS_SHAPES} />

            <div className="relative mx-auto max-w-4xl">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
                    <ArrowLeft className="size-4" />
                    Back
                </Button>
                <PageHeading
                    eyebrow="Your account"
                    title="My bookings"
                    subtitle="Every upcoming show you've booked, in one place."
                />

                <div className="mt-8">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : error ? (
                        <EmptyState title="Can't reach the box office" hint={error} />
                    ) : bookings.length === 0 ? (
                        <>
                            <EmptyState title="No bookings yet" hint="Once you book a show, it'll show up here." />
                            <div className="mt-6 flex justify-center">
                                <Link to="/events">
                                    <Button variant="primary">Browse events</Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {bookings.map((booking, i) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}
                                >
                                    <Panel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <Ticket size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{booking.eventName}</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {formatDate(booking.eventDate)} · {booking.sectionName} ×{" "}
                                                    {booking.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                                            <p className="whitespace-nowrap text-lg font-semibold text-foreground">
                                                ₹{booking.priceAtBooking * booking.quantity}
                                            </p>
                                            <button
                                                onClick={() => generateTicketPDF(booking, email ?? "—")}
                                                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                                            >
                                                <Download size={13} />
                                                Download
                                            </button>
                                        </div>
                                    </Panel>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default MyBookings