import { useState, useEffect, type FormEvent } from "react"
import { ImagePlus, Plus, Trash2, X } from "lucide-react"
import type { CreateEventSection, EventItem } from "@/lib/types"
import { Button, Panel } from "@/components/ui-kit"
import AuthField from "@/components/AuthField"

interface EventFormProps {
    initialData?: EventItem | null
    onSubmit: (data: { name: string; date: string; sections: CreateEventSection[]; poster: File | null }) => void
    onCancel?: () => void
    submitting: boolean
    error?: string | null
}

const emptySection = (): CreateEventSection => ({
    name: "",
    price: "" as unknown as number,
    capacity: "" as unknown as number,
    remaining: "" as unknown as number,
})

const EventForm = ({ initialData, onSubmit, onCancel, submitting, error: externalError }: EventFormProps) => {
    const isUpdate = !!initialData

    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [sections, setSections] = useState<CreateEventSection[]>([emptySection()])
    const [poster, setPoster] = useState<File | null>(null)
    const [posterPreview, setPosterPreview] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    // Populate data if we are editing
    useEffect(() => {
        if (initialData) {
            setName(initialData.name)
            setDate(new Date(initialData.date).toISOString().split("T")[0])
            setSections(initialData.sections)
            setPosterPreview(initialData.posterUrl || null)
        }
    }, [initialData])

    const handlePosterFile = (file: File | undefined) => {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            setLocalError("Poster must be an image file.")
            return
        }
        setLocalError(null)
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
        if (!isUpdate && !poster) return "Event poster is mandatory. Please upload an image."
        if (!name.trim()) return "Event name is mandatory."
        if (!date) return "Event date is mandatory."

        // Only check past date if they are changing it to a new past date
        if (new Date(date) < new Date(new Date().toDateString())) {
            if (!isUpdate || date !== new Date(initialData!.date).toISOString().split("T")[0]) {
                return "Event date cannot be in the past."
            }
        }

        if (sections.length === 0) return "Add at least one section."

        for (let idx = 0; idx < sections.length; idx++) {
            const s = sections[idx]
            const row = idx + 1
            const trimmedName = s.name.trim()

            if (!trimmedName) return `Section #${row}: Name is mandatory.`

            const rawPrice = String(s.price).trim()
            if (rawPrice === "" || s.price === null || isNaN(Number(s.price))) return `Section #${row}: Price is mandatory.`
            if (Number(s.price) < 10) return `Section #${row}: Price cannot be 0 or a single digit (minimum is ₹10).`

            const rawCap = String(s.capacity).trim()
            if (rawCap === "" || s.capacity === null || isNaN(Number(s.capacity))) return `Section #${row}: Capacity is mandatory.`
            const capNum = Number(s.capacity)
            if (!Number.isInteger(capNum) || capNum < 1) return `Section #${row}: Capacity must be a whole number of at least 1.`
        }
        return null
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const validationError = validate()
        if (validationError) {
            setLocalError(validationError)
            return
        }

        setLocalError(null)
        onSubmit({
            name: name.trim(),
            date,
            sections: sections.map((s) => ({
                name: s.name.trim(),
                price: Number(s.price),
                capacity: Number(s.capacity),
                remaining: isUpdate ? Number(s.remaining) : Number(s.capacity)
            })),
            poster
        })
    }

    const displayError = localError || externalError

    return (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
            <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    Poster <span className="text-destructive">{!isUpdate && "*"}</span>
                    {isUpdate && <span className="text-muted-foreground lowercase tracking-normal ml-1">(Optional on update)</span>}
                </p>
                <label
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handlePosterFile(e.dataTransfer.files?.[0]) }}
                    className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${dragActive ? "border-primary bg-primary/5" : "border-border bg-surface/50 hover:border-primary/40"}`}
                >
                    {posterPreview ? (
                        <div className="relative w-full max-w-xs">
                            <img src={posterPreview} alt="Poster preview" className="aspect-4/5 w-full rounded-xl object-cover" />
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setPoster(null); setPosterPreview(null) }}
                                className="absolute -right-2 -top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <ImagePlus size={28} className="text-primary" />
                            <p className="text-sm text-foreground">Drag & drop a poster, or click to browse</p>
                            <p className="text-xs text-muted-foreground">PNG or JPG, up to 5MB</p>
                        </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePosterFile(e.target.files?.[0])} />
                </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <AuthField id="name" label="Event name *" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                <AuthField id="date" label="Event date *" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Sections <span className="text-destructive">*</span></p>
                    <button type="button" onClick={addSection} className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                        <Plus size={14} /> Add section
                    </button>
                </div>

                <div className="mt-3 flex flex-col gap-3">
                    {sections.map((section, i) => (
                        <Panel key={i} className="p-4">
                            <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Section name *</span>
                                    <input type="text" required value={section.name} onChange={(e) => handleSectionChange(i, "name", e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Price (₹) *</span>
                                    <input type="number" required min={10} value={section.price ?? ""} onFocus={(e) => e.target.select()} onChange={(e) => handleSectionChange(i, "price", e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Capacity *</span>
                                    <input type="number" required min={1} value={section.capacity ?? ""} onFocus={(e) => e.target.select()} onChange={(e) => handleSectionChange(i, "capacity", e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50" />
                                </div>
                                <button type="button" onClick={() => removeSection(i)} disabled={sections.length === 1} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-destructive hover:bg-destructive/10 disabled:opacity-30 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </Panel>
                    ))}
                </div>
            </div>

            {displayError && <p className="text-sm text-destructive">{displayError}</p>}

            <div className="flex gap-4">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting} className="w-full">
                        Cancel
                    </Button>
                )}
                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                    {submitting ? (isUpdate ? "Saving changes…" : "Creating event…") : (isUpdate ? "Save changes" : "Create event")}
                </Button>
            </div>
        </form>
    )
}

export default EventForm