import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Ticket, ShieldCheck } from "lucide-react"

import { useToast } from "@/components/Toast"
import { useAuthStore } from "@/store/authStore"

const UserProfile = () => {
    const { email, isAdmin, logout } = useAuthStore()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Close the dropdown when clicking anywhere outside it
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const initial = email?.charAt(0).toUpperCase() ?? "?"

    const handleLogout = () => {
        logout()
        setOpen(false)
        showToast("Signed out successfully", "success")
        navigate("/signin")
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 cursor-pointer"
                aria-label="Account menu"
            >
                {initial}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-border bg-surface/95 shadow-lg backdrop-blur-xl"
                    >
                        <div className="border-b border-border px-4 py-3">
                            <p className="truncate text-sm font-medium text-foreground">{email}</p>
                        </div>

                        <div className="flex flex-col p-1">
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-foreground/5 cursor-pointer"
                                >
                                    <ShieldCheck size={16} className="text-primary" />
                                    Admin panel
                                </Link>
                            )}

                            <Link
                                to="/bookings"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-foreground/5 cursor-pointer"
                            >
                                <Ticket size={16} className="text-primary" />
                                My bookings
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10 cursor-pointer"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserProfile