import { motion } from "framer-motion"

// Subtle floating shapes for section backgrounds — decorative only, non-interactive
type Shape = {
    type: "circle" | "square"
    size: number
    top?: string
    bottom?: string
    left?: string
    right?: string
    delay: number
    duration: number
}

const DEFAULT_SHAPES: Shape[] = [
    { type: "circle", size: 80, top: "10%", left: "5%", delay: 0, duration: 8 },
    { type: "square", size: 48, top: "60%", left: "12%", delay: 1.5, duration: 10 },
    { type: "circle", size: 120, top: "20%", right: "8%", delay: 0.8, duration: 9 },
    { type: "square", size: 36, bottom: "15%", right: "15%", delay: 2, duration: 7 },
    { type: "circle", size: 56, bottom: "25%", left: "40%", delay: 1.2, duration: 11 },
]

const BackgroundShapes = ({ shapes = DEFAULT_SHAPES }: { shapes?: Shape[] }) => {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className={`absolute border border-primary/20 bg-primary/5 ${shape.type === "circle" ? "rounded-full" : "rounded-xl"
                        }`}
                    style={{
                        width: shape.size,
                        height: shape.size,
                        top: shape.top,
                        bottom: shape.bottom,
                        left: shape.left,
                        right: shape.right,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: shape.type === "square" ? [0, 8, 0] : 0,
                    }}
                    transition={{
                        duration: shape.duration,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

export default BackgroundShapes