import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button, Panel } from "@/components/ui-kit"
import BackgroundShapes from "@/components/BackgroundShapes"

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
}

const bubbleVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const } },
}

// Custom shapes for this section — kept out of the text column (left, top area),
// scaled up since this section has more open space than FeaturedEvents
const CONCIERGE_SHAPES = [
    { type: "circle" as const, size: 140, top: "-5%", right: "18%", delay: 0, duration: 10 },
    { type: "square" as const, size: 64, bottom: "8%", left: "2%", delay: 1, duration: 9 },
    { type: "circle" as const, size: 90, bottom: "-8%", right: "4%", delay: 1.8, duration: 11 },
    { type: "square" as const, size: 48, top: "35%", left: "30%", delay: 0.6, duration: 8 },
]

const Concierge = () => {
    return (
        <section className="relative mx-auto max-w-6xl px-6 pb-24">
            <BackgroundShapes shapes={CONCIERGE_SHAPES} />

            <div className="relative grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">(b) — Concierge</p>
                    <h2 className="mt-3 text-balance font-display text-5xl leading-[0.9] tracking-wide">
                        Don't browse. Just ask.
                    </h2>
                    <p className="mt-4 max-w-xs text-pretty text-muted-foreground">
                        Tell the assistant what mood you're in and it pulls the right shows, then books straight from
                        the thread.
                    </p>
                    <Link to="/ask-ai" className="mt-6 inline-flex">
                        <Button variant="primary">Open the concierge</Button>
                    </Link>
                </div>

                <div className="lg:col-span-8">
                    <motion.div
                        whileHover={{ y: -8, boxShadow: "0 20px 40px -12px var(--color-primary)" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        style={{ boxShadow: "0 0 0 0 transparent" }}
                    >
                        <Panel className="relative p-5 sm:p-6">
                            <motion.div
                                className="flex flex-col gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                            >
                                <motion.div
                                    variants={bubbleVariants}
                                    className="max-w-[80%] self-start text-pretty rounded-2xl rounded-tl-sm bg-foreground/5 px-4 py-3 text-sm"
                                >
                                    Hi! I'm the BookTheShow concierge. What are you in the mood for this weekend?
                                </motion.div>

                                <motion.div
                                    variants={bubbleVariants}
                                    className="max-w-[80%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                                >
                                    Something low-key and live, ideally under &#8377;699.
                                </motion.div>

                                <motion.div
                                    variants={bubbleVariants}
                                    className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-foreground/5 px-4 py-3"
                                >
                                    <p className="text-pretty text-sm">
                                        I'll find the matching shows and book the tickets for you in the same
                                        conversation.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </Panel>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Concierge