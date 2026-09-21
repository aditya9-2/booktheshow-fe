import { Link } from "react-router-dom"
import { Button, Panel } from "@/components/ui-kit"

const Concierge = () => {
    return (
        <section className="mx-auto max-w-6xl px-6 pb-24">
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left: copy + CTA */}
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
                        <Button variant="primary" className="hover:cursor-pointer">Open the concierge</Button>
                    </Link>
                </div>

                {/* Right: mock chat preview */}
                <div className="lg:col-span-8">
                    <Panel className="p-5 sm:p-6">
                        <div className="flex flex-col gap-4">
                            <div className="max-w-[80%] self-start text-pretty rounded-2xl rounded-tl-sm bg-foreground/5 px-4 py-3 text-sm">
                                Hi! I'm the BookTheShow concierge. What are you in the mood for this weekend?
                            </div>
                            <div className="max-w-[80%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                                Something low-key and live, ideally under ₹699.
                            </div>
                            <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-foreground/5 px-4 py-3">
                                <p className="text-pretty text-sm">
                                    I'll find the matching shows and book the tickets for you in the same
                                    conversation.
                                </p>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        </section>
    )
}

export default Concierge