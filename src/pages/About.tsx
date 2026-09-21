import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Music, Ticket, Sparkles, ShieldCheck, MessageCircle, Search } from "lucide-react"
import { Button, Panel } from "@/components/ui-kit"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"

const VALUES = [
    {
        icon: Ticket,
        title: "Book in seconds",
        desc: "Browse events or let the AI concierge find and book the right show for you, straight from a conversation.",
    },
    {
        icon: Music,
        title: "Every kind of stage",
        desc: "Music, comedy, theatre, talks — if it's happening live, it's listed on BookTheShow.",
    },
    {
        icon: ShieldCheck,
        title: "Verified venues",
        desc: "Every event is tied to a real venue and seat map, so what you book is what you get.",
    },
    {
        icon: Sparkles,
        title: "Built for discovery",
        desc: "No more scrolling ten tabs to find what's on this weekend — one place, curated and searchable.",
    },
]

const AI_CAPABILITIES = [
    { icon: Search, label: "Searches events for you" },
    { icon: MessageCircle, label: "Answers questions on venues, pricing, availability" },
    { icon: Ticket, label: "Books tickets — only after you confirm" },
]

const ABOUT_SHAPES = [
    { type: "circle" as const, size: 120, top: "5%", right: "10%", delay: 0, duration: 10 },
    { type: "square" as const, size: 52, bottom: "20%", left: "6%", delay: 1, duration: 9 },
]

const About = () => {
    return (
        <section className="relative overflow-hidden px-6 py-20">
            <AmbientGlow />
            <BackgroundShapes shapes={ABOUT_SHAPES} />

            <div className="relative mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">About us</p>
                    <h1 className="mt-4 text-balance font-display text-5xl leading-[0.95] tracking-wide sm:text-6xl">
                        Live shows, booked without the hassle.
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
                        BookTheShow started with one idea: finding and booking a live show shouldn't take longer than
                        the show itself. So we built a place where you can browse, ask, and book — all in one thread.
                    </p>
                </motion.div>
            </div>

            <div className="relative mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2">
                {VALUES.map(({ icon: Icon, title, desc }, i) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                        whileHover={{ y: -6, boxShadow: "0 16px 32px -12px var(--color-primary)" }}
                        style={{ boxShadow: "0 0 0 0 transparent" }}
                        className="h-full"
                    >
                        <Panel className="h-full p-6 transition-colors hover:border-primary/40">
                            <Icon size={26} className="text-primary" />
                            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                        </Panel>
                    </motion.div>
                ))}
            </div>

            {/* AI concierge deep-dive */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px -12px var(--color-primary)" }}
                style={{ boxShadow: "0 0 0 0 transparent" }}
                className="relative mx-auto mt-8 max-w-5xl"
            >
                <Panel className="p-6 transition-colors hover:border-primary/40 sm:p-8">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                        Meet the concierge
                    </p>
                    <h2 className="mt-3 font-display text-3xl tracking-wide sm:text-4xl">
                        Not a chatbot. An agent that actually books.
                    </h2>
                    <p className="mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                        The concierge isn't just answering questions — it's calling real tools against real event
                        data. It can search live inventory, check seat availability, pull up your past bookings, and
                        place a booking on your behalf. It always asks before it books anything, and every action it
                        takes still goes through the same transaction-safe, idempotent booking flow as booking
                        manually — so a conversation can never oversell a seat or double-book you by mistake.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {AI_CAPABILITIES.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 transition hover:border-primary/30"
                            >
                                <Icon size={18} className="shrink-0 text-primary" />
                                <p className="text-sm text-foreground">{label}</p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </motion.div>

            <div className="relative mx-auto mt-16 flex max-w-4xl flex-col items-center gap-4 text-center">
                <h2 className="font-display text-3xl tracking-wide">Ready to catch a show?</h2>
                <Link to="/events">
                    <Button variant="primary" className="cursor-pointer">Browse events</Button>
                </Link>
            </div>
        </section>
    )
}

export default About