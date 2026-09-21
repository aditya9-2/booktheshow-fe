import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Ghost } from "lucide-react"
import { Button, Panel } from "@/components/ui-kit"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"

const NOT_FOUND_SHAPES = [
    { type: "circle" as const, size: 110, top: "10%", left: "10%", delay: 0, duration: 9 },
    { type: "square" as const, size: 44, bottom: "15%", right: "12%", delay: 1, duration: 8 },
]

const NotFound = () => {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
            <AmbientGlow />
            <BackgroundShapes shapes={NOT_FOUND_SHAPES} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md"
            >
                <Panel className="flex flex-col items-center p-10 text-center">
                    <Ghost size={40} className="text-primary" />
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-primary">404</p>
                    <h1 className="mt-2 font-display text-4xl tracking-wide">Nothing on this stage.</h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        The page you're looking for doesn't exist, or you don't have access to it.
                    </p>

                    <Link to="/" className="mt-8 w-full">
                        <Button variant="primary" className="w-full">
                            Back to home
                        </Button>
                    </Link>
                </Panel>
            </motion.div>
        </section>
    )
}

export default NotFound