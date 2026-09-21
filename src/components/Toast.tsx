import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

type ToastType = "success" | "error"
type ToastItem = { id: number; message: string; type: ToastType }

type ToastContextValue = {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used within ToastProvider")
    return ctx
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 2400)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed bottom-6 right-6 z-60 flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 24, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                            className={`flex min-w-[320px] max-w-sm items-start gap-3 rounded-2xl border-l-4 bg-surface px-5 py-4 shadow-2xl backdrop-blur-xl sm:min-w-[360px] ${
                                toast.type === "success" ? "border-l-primary" : "border-l-destructive"
                            }`}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle2 size={26} className="mt-0.5 shrink-0 text-primary" />
                            ) : (
                                <XCircle size={26} className="mt-0.5 shrink-0 text-destructive" />
                            )}
                            <p className="text-base font-semibold leading-snug text-foreground">{toast.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}