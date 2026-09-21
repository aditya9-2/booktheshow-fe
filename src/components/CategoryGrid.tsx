import { Link } from "react-router-dom"
import { Music, Mic2, Drama, MessageSquare } from "lucide-react"

// TODO: NEW API NEEDED
const CATEGORIES = [
    { label: "Music", slug: "music", icon: Music, count: 42 },
    { label: "Comedy", slug: "comedy", icon: Mic2, count: 31 },
    { label: "Theatre", slug: "theatre", icon: Drama, count: 18 },
    { label: "Talks", slug: "talks", icon: MessageSquare, count: 12 },
]

const CategoryGrid = () => {
    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                (c) — Browse by mood
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CATEGORIES.map(({ label, slug, icon: Icon, count }) => (
                    <Link
                        key={slug}
                        to={`/events?category=${slug}`}
                        className="group flex flex-col justify-between rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-primary/40"
                    >
                        <Icon
                            size={28}
                            className="text-primary transition group-hover:scale-110"
                        />
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold">{label}</h3>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">{count} shows</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default CategoryGrid