import { Link } from "react-router-dom"
import { Button } from "@/components/ui-kit"
import { AuroraBackground } from "@/components/ui/aurora-background"
import heroImage from "@/assets/hero.png"

const Hero = () => {
    return (
        <AuroraBackground className="relative">
            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
                <div className="lg:col-span-7">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                        Now booking · Spring 2026
                    </p>
                    <h1 className="mt-5 text-balance font-display text-[3.5rem] leading-[0.95] tracking-wide sm:text-[5.5rem]">
                        The stage is yours.
                    </h1>
                    <p className="mt-6 max-w-md text-pretty text-lg text-muted-foreground">
                        Book live shows, talks and stage nights in seconds — or just ask the concierge what to catch
                        this weekend.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link to="/events">
                            <Button variant="primary">Browse events</Button>
                        </Link>
                        <Link to="/ask-ai">
                            <Button variant="ghost">Ask the concierge</Button>
                        </Link>
                    </div>

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
        </AuroraBackground>
    )
}

export default Hero