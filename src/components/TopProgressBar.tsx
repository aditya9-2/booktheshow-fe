import { motion, AnimatePresence } from "framer-motion"

const TopProgressBar = ({ loading }: { loading: boolean }) => {
    return (
        <AnimatePresence>
            {loading && (
                <div className="fixed inset-x-0 top-0 z-100 h-1 overflow-hidden bg-border">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: ["-100%", "10%", "60%"] }}
                        exit={{ x: "100%", transition: { duration: 0.3 } }}
                        transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity, repeatType: "loop" }}
                        className="relative h-full w-full bg-primary shadow-[0_0_10px_2px_var(--color-primary)]"
                    >
                        
                        <div className="absolute right-0 top-0 h-full w-8 bg-linear-to-r from-transparent to-white/80 blur-[2px]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default TopProgressBar