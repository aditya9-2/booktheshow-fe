import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

let hasPlayedThisSession = false

const PageLoader = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(!hasPlayedThisSession)

    useEffect(() => {
        if (hasPlayedThisSession) return

        const timer = setTimeout(() => {
            setLoading(false)
            hasPlayedThisSession = true
        }, 1800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <div className="fixed inset-0 z-50">
                        <motion.div
                            key="top"
                            initial={{ y: 0 }}
                            exit={{ y: "-100%" }}
                            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-x-0 top-0 h-1/2 bg-foreground"
                        />
                        <motion.div
                            key="bottom"
                            initial={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-x-0 bottom-0 h-1/2 bg-foreground"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                        >
                            <motion.div
                                initial={{ letterSpacing: "0.4em", opacity: 0 }}
                                animate={{ letterSpacing: "0.15em", opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="font-sans text-xl text-background"
                            >
                                BOOKTHESHOW<span className="text-primary">.</span>
                            </motion.div>
                            <div className="relative h-px w-32 overflow-hidden bg-background/20">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-y-0 w-1/2 bg-primary"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
                animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: loading ? 0 : 0.3 }}
            >
                {children}
            </motion.div>
        </>
    )
}

export default PageLoader