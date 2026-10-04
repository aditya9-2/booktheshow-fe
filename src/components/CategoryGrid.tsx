import { Link } from "react-router-dom"
import { Music, Trophy, Laugh, Clapperboard } from "lucide-react"
import { EventCategory } from "@/lib/types"

const CATEGORIES = [
    { label: "Music", slug: EventCategory.Music, icon: Music },
    { label: "Sports", slug: EventCategory.Sports, icon: Trophy },
    { label: "Comedy", slug: EventCategory.Comedy, icon: Laugh },
    { label: "Movies", slug: EventCategory.Movies, icon: Clapperboard },
]

const CategoryGrid = () => {
    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                (c) — Browse by mood
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CATEGORIES.map(({ label, slug, icon: Icon }) => (
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
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default CategoryGrid

