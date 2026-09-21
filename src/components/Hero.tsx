import { Link } from "react-router-dom"
import { Button } from "@/components/ui-kit"
import heroImage from "@/assets/hero.png"

const Hero = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Blurred glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-130 w-205 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-95 w-95 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
                <div className="lg:col-span-7">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                        Now booking · Spring 2026
                    </p>
                    <h1 className="mt-5 text-balance font-display text-[5.5rem] leading-[0.82] tracking-wide sm:text-[7.5rem]">
                        The stage is yours.
                    </h1>
                    <p className="mt-6 max-w-md text-pretty text-lg text-muted-foreground">
                        Book live shows, talks and stage nights in seconds — or just ask the concierge what to catch this
                        weekend.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link to="/events">
                            <Button variant="primary">Browse events</Button>
                        </Link>
                        <Link to="/ask-ai">
                            <Button variant="ghost">Ask the concierge</Button>
                        </Link>
                    </div>
                    {/* TODO: need to create a new API to export these real Details */}
                    <div className="mt-10 flex gap-8 font-mono text-xs text-muted-foreground">
                        <div>
                            <span className="block text-xl font-medium text-foreground">128</span>
                            shows listed
                        </div>
                        <div>
                            <span className="block text-xl font-medium text-foreground">41</span>
                            city venues
                        </div>
                        <div>
                            <span className="block text-xl font-medium text-foreground">6.2k</span>
                            tickets sold
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <img
                        src={heroImage}
                        alt="A single spotlight on an empty stage"
                        width={1024}
                        height={1280}
                        className="aspect-4/5 w-full rounded-2xl object-cover"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero