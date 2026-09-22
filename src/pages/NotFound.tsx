import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Ghost } from "lucide-react"
import { Button, Panel } from "@/components/ui-kit"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { NOT_FOUND_SHAPES } from "@/constants/backgroundShapes"



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