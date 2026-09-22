import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { ArrowLeft } from "lucide-react"
import { createEvent } from "@/lib/api"
import { Button } from "@/components/ui-kit"
import { useToast } from "@/components/Toast"
import TopProgressBar from "@/components/TopProgressBar"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { CREATE_SHAPES } from "@/constants/backgroundShapes"
import EventForm from "@/components/EventForm"
import type { CreateEventSection } from "@/lib/types"

const CreateEvent = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreate = async (data: { name: string; date: string; sections: CreateEventSection[]; poster: File | null }) => {
        setError(null)
        setSubmitting(true)
        try {
            const payload = {
                ...data,
                poster: data.poster ?? undefined
            }

            const res = await createEvent(payload)
            showToast(res.data.message ?? "Event created successfully", "success")
            navigate("/admin")
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Couldn't create the event. Try again."
                : "Couldn't create the event. Try again."
            setError(message)
            showToast(message, "error")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <TopProgressBar loading={submitting} />

            <section className="relative overflow-hidden px-6 py-16">
                <AmbientGlow />
                <BackgroundShapes shapes={CREATE_SHAPES} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mx-auto max-w-3xl"
                >
                    <Link to="/admin">
                        <Button variant="ghost" size="sm" className="mb-6 gap-2">
                            <ArrowLeft className="size-4" />
                            Back
                        </Button>
                    </Link>

                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">New event</p>
                    <h1 className="mt-3 font-display text-4xl tracking-wide">Create event</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Add a show, set the date, and define its pricing sections.
                    </p>

                    <EventForm onSubmit={handleCreate} submitting={submitting} error={error} />
                </motion.div>
            </section>
        </>
    )
}

export default CreateEvent