import { useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { ArrowLeft, ImagePlus, Plus, Trash2, X } from "lucide-react"
import { createEvent } from "@/lib/api"
import type { CreateEventSection } from "@/lib/types"
import { Button, Panel } from "@/components/ui-kit"
import AuthField from "@/components/AuthField"
import { useToast } from "@/components/Toast"
import TopProgressBar from "@/components/TopProgressBar"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { CREATE_SHAPES } from "@/constants/backgroundShapes"

const emptySection = (): CreateEventSection => ({
    name: "",
    price: "" as unknown as number,
    capacity: "" as unknown as number,
    remaining: "" as unknown as number,
})

const CreateEvent = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [sections, setSections] = useState<CreateEventSection[]>([emptySection()])
    const [poster, setPoster] = useState<File | null>(null)
    const [posterPreview, setPosterPreview] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePosterFile = (file: File | undefined) => {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            setError("Poster must be an image file.")
            return
        }
        setError(null)
        setPoster(file)
        setPosterPreview(URL.createObjectURL(file))
    }

    const handleSectionChange = (index: number, field: keyof CreateEventSection, value: string) => {
        setSections((prev) =>
            prev.map((s, i) => {
                if (i !== index) return s
                if (field === "name") return { ...s, name: value }

                const parsed = value === "" ? ("" as unknown as number) : Number(value)

                if (field === "capacity") {
                    return { ...s, capacity: parsed, remaining: parsed }
                }
                return { ...s, [field]: parsed }
            })
        )
    }

    const addSection = () => setSections((prev) => [...prev, emptySection()])
    const removeSection = (index: number) => setSections((prev) => prev.filter((_, i) => i !== index))

    const validate = (): string | null => {
        // Mandatory poster check
        if (!poster) {
            return "Event poster is mandatory. Please upload an image."
        }

        // Mandatory event name check
        if (!name.trim()) {
            return "Event name is mandatory."
        }

        // Mandatory date check
        if (!date) {
            return "Event date is mandatory."
        }
        if (new Date(date) < new Date(new Date().toDateString())) {
            return "Event date cannot be in the past."
        }

        // Mandatory sections check
        if (sections.length === 0) {
            return "Add at least one section."
        }

        // Section name alphanumeric and space regex
        const alphanumericWithSpaces = /^[a-zA-Z0-9 ]+$/

        for (let idx = 0; idx < sections.length; idx++) {
            const s = sections[idx]
            const row = idx + 1
            const trimmedName = s.name.trim()

            // Section name validation
            if (!trimmedName) {
                return `Section #${row}: Name is mandatory.`
            }
            if (!alphanumericWithSpaces.test(trimmedName)) {
                return `Section #${row}: Name must contain only letters, numbers, and spaces (no special characters).`
            }

            // Price validation (not empty, not single-digit, minimum 10)
            const rawPrice = String(s.price).trim()
            if (rawPrice === "" || s.price === null || isNaN(Number(s.price))) {
                return `Section #${row}: Price is mandatory.`
            }
            const priceNum = Number(s.price)
            if (priceNum < 10) {
                return `Section #${row}: Price cannot be 0 or a single digit (minimum is ₹10).`
            }

            // Capacity validation
            const rawCap = String(s.capacity).trim()
            if (rawCap === "" || s.capacity === null || isNaN(Number(s.capacity))) {
                return `Section #${row}: Capacity is mandatory.`
            }
            const capNum = Number(s.capacity)
            if (!Number.isInteger(capNum) || capNum < 1) {
                return `Section #${row}: Capacity must be a whole number of at least 1.`
            }
        }

        return null
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setError(null)
        setSubmitting(true)
        try {
            const formattedSections = sections.map((s) => ({
                name: s.name.trim(),
                price: Number(s.price),
                capacity: Number(s.capacity),
                remaining: Number(s.capacity),
            }))

            const res = await createEvent({
                name: name.trim(),
                date,
                sections: formattedSections,
                poster: poster ?? undefined,
            })
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

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
                        {/* Poster upload (Mandatory) */}
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                                Poster <span className="text-destructive">*</span>
                            </p>
                            <label
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setDragActive(true)
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    setDragActive(false)
                                    handlePosterFile(e.dataTransfer.files?.[0])
                                }}
                                className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${dragActive ? "border-primary bg-primary/5" : "border-border bg-surface/50 hover:border-primary/40"
                                    }`}
                            >
                                {posterPreview ? (
                                    <div className="relative w-full max-w-xs">
                                        <img
                                            src={posterPreview}
                                            alt="Poster preview"
                                            className="aspect-4/5 w-full rounded-xl object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPoster(null)
                                                setPosterPreview(null)
                                            }}
                                            className="absolute -right-2 -top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg"
                                            aria-label="Remove poster"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <ImagePlus size={28} className="text-primary" />
                                        <p className="text-sm text-foreground">
                                            Drag & drop a poster, or click to browse
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG or JPG, up to 5MB (Required)</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handlePosterFile(e.target.files?.[0])}
                                />
                            </label>
                        </div>

                        {/* Basic details (Mandatory) */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <AuthField
                                id="name"
                                label="Event name *"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ICC Champions Trophy 2026 India vs Australia Final"
                            />
                            <AuthField
                                id="date"
                                label="Event date *"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Sections (Mandatory) */}
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                                    Sections <span className="text-destructive">*</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                                >
                                    <Plus size={14} />
                                    Add section
                                </button>
                            </div>

                            <div className="mt-3 flex flex-col gap-3">
                                {sections.map((section, i) => (
                                    <Panel key={i} className="p-4">
                                        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    Section name <span className="text-destructive">*</span>
                                                </span>
                                                <input
                                                    type="text"
                                                    required
                                                    value={section.name}
                                                    onChange={(e) => handleSectionChange(i, "name", e.target.value)}
                                                    placeholder="North Pavilion Box VIP"
                                                    className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    Price (₹) <span className="text-destructive">*</span>
                                                </span>
                                                <input
                                                    type="number"
                                                    required
                                                    min={10}
                                                    value={section.price ?? ""}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleSectionChange(i, "price", e.target.value)}
                                                    placeholder="Min ₹10"
                                                    className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    Capacity <span className="text-destructive">*</span>
                                                </span>
                                                <input
                                                    type="number"
                                                    required
                                                    min={1}
                                                    value={section.capacity ?? ""}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleSectionChange(i, "capacity", e.target.value)}
                                                    placeholder="Min 1"
                                                    className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSection(i)}
                                                disabled={sections.length === 1}
                                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-30"
                                                aria-label="Remove section"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </Panel>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                            {submitting ? "Creating event…" : "Create event"}
                        </Button>
                    </form>
                </motion.div>
            </section>
        </>
    )
}

export default CreateEvent