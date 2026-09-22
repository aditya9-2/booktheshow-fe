import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { ArrowLeft, Trash2, Edit, Calendar, AlertTriangle } from "lucide-react"
import type { EventItem, CreateEventSection } from "@/lib/types"
import { getAllEvents, deleteEvent, updateEvent } from "@/lib/api"
import { Button, Panel, PageHeading } from "@/components/ui-kit"
import { useToast } from "@/components/Toast"
import TopProgressBar from "@/components/TopProgressBar"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { ADMIN_SHAPES, CREATE_SHAPES } from "@/constants/backgroundShapes"
import EventForm from "@/components/EventForm"

// Import Shadcn AlertDialog components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ManageEvents = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [events, setEvents] = useState<EventItem[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
    const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await getAllEvents()
                setEvents(res.data.events || [])
            } catch (err) {
                showToast("Failed to fetch events.", "error")
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [showToast])

    const handleDelete = async () => {
        if (!eventToDelete?._id) return

        setSubmitting(true)
        try {
            await deleteEvent(eventToDelete._id)
            showToast("Event deleted successfully", "success")
            setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id))
            if (editingEvent?._id === eventToDelete._id) setEditingEvent(null)
            setEventToDelete(null)
        } catch (err) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : "Failed to delete event."
            showToast(message || "Failed to delete event.", "error")
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdate = async (data: { name: string; date: string; sections: CreateEventSection[]; poster: File | null }) => {
        if (!editingEvent?._id) return

        setError(null)
        setSubmitting(true)
        try {
            const payload = {
                ...data,
                poster: data.poster ?? undefined,
            }

            const res = await updateEvent(editingEvent._id, payload)
            showToast(res.data.message ?? "Event updated successfully", "success")
            setEvents((prev) => prev.map(ev => ev._id === editingEvent._id ? res.data.event : ev))
            setEditingEvent(null)
        } catch (err) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : "Couldn't update event."
            setError(message || "Couldn't update event.")
            showToast(message || "Couldn't update event.", "error")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <TopProgressBar loading={loading || submitting} />

            {/* Shadcn Delete Confirmation Modal */}
            <AlertDialog open={!!eventToDelete} onOpenChange={(isOpen) => !isOpen && setEventToDelete(null)}>
                <AlertDialogContent className="border-border bg-background/95 backdrop-blur-md sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 font-display text-xl">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle size={20} />
                            </div>
                            Delete Event
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground mt-4 leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-foreground">{eventToDelete?.name}</span>? This action cannot be undone and will remove it from the catalog permanently.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel disabled={submitting} className="border-border hover:bg-surface/50 cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={submitting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                        >
                            {submitting ? "Deleting..." : "Yes, delete event"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <section className="relative overflow-hidden px-6 py-16 min-h-[85vh]">
                <AmbientGlow />
                <BackgroundShapes shapes={editingEvent ? CREATE_SHAPES : ADMIN_SHAPES} />

                <div className={`relative mx-auto ${editingEvent ? "max-w-3xl" : "max-w-5xl"}`}>
                    <AnimatePresence mode="wait">
                        {!editingEvent ? (
                            <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate("/admin")}
                                    className="mb-6 gap-2"
                                >
                                    <ArrowLeft className="size-4" />
                                    Back
                                </Button>

                                <PageHeading eyebrow="Inventory" title="Manage events" subtitle="Edit or remove existing shows from your catalog." />

                                {loading ? (
                                    <p className="mt-8 text-muted-foreground">Loading events...</p>
                                ) : events.length === 0 ? (
                                    <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
                                        <p className="text-muted-foreground">No events found.</p>
                                        <Link to="/admin/create-event" className="mt-4 inline-block text-primary hover:underline">
                                            Create one now
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="mt-10 grid gap-4">
                                        {events.map((event) => (
                                            <Panel key={event._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:border-primary/40">
                                                <div className="flex items-center gap-5">
                                                    {event.posterUrl ? (
                                                        <img src={event.posterUrl} alt={event.name} className="h-16 w-16 rounded-lg object-cover bg-surface/50" />
                                                    ) : (
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                                                            <Calendar className="text-primary/50" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">{event.name}</h3>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button variant="dark" size="sm" onClick={() => { setEditingEvent(event); setError(null) }} className="gap-2">
                                                        <Edit size={14} /> Edit
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => setEventToDelete(event)} className="gap-2">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </Panel>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="edit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Update</p>
                                <h1 className="mt-3 font-display text-4xl tracking-wide">Edit event</h1>

                                <EventForm
                                    initialData={editingEvent}
                                    onSubmit={handleUpdate}
                                    onCancel={() => setEditingEvent(null)}
                                    submitting={submitting}
                                    error={error}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </>
    )
}

export default ManageEvents