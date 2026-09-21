import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Ticket, ShieldCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui-kit"
import { useAuthStore } from "@/store/authStore"
import { useToast } from "@/components/Toast"
import { useNavigate } from "react-router-dom"
import UserProfile from "./UserProfile"

const NAV_LINKS = [
    { label: "Events", href: "/events" },
    { label: "Ask AI", href: "/ask-ai" },
    { label: "About", href: "/about" },
]

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { isAuthenticated, email, isAdmin, logout } = useAuthStore()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const handleMobileLogout = () => {
        logout()
        setOpen(false)
        showToast("Signed out successfully", "success")
        navigate("/signin")
    }

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link to="/" className="font-sans text-2xl tracking-wide" onClick={() => setOpen(false)}>
                    BOOKTHESHOW<span className="text-primary">.</span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.label} to={link.href} className="hover:text-foreground">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop — dropdown avatar works fine here */}
                <div className="hidden items-center gap-4 md:flex">
                    {isAuthenticated ? (
                        <UserProfile />
                    ) : (
                        <>
                            <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground">
                                Sign in
                            </Link>
                            <Link to="/signup">
                                <Button variant="dark" size="sm" className="cursor-pointer">
                                    Get tickets
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="relative cursor-pointer text-foreground md:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu
                        size={24}
                        className={`transition-all duration-300 ${open ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
                            }`}
                    />
                    <X
                        size={24}
                        className={`absolute inset-0 transition-all duration-300 ${open ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
                            }`}
                    />
                </button>
            </div>

            <div
                className={`overflow-hidden border-t border-border transition-all duration-300 ease-in-out md:hidden ${open ? "max-h-96 border-t opacity-100" : "max-h-0 border-t-0 opacity-0"
                    }`}
            >
                <div className="px-6 py-4">
                    <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                onClick={() => setOpen(false)}
                                className="hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile — direct links instead of a dropdown, avoids the clipped-dropdown bug */}
                    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                        {isAuthenticated ? (
                            <>
                                <p className="truncate text-xs text-muted-foreground">{email}</p>
                                <Link
                                    to={isAdmin ? "/admin" : "/bookings"}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {isAdmin ? (
                                        <ShieldCheck size={16} className="text-primary" />
                                    ) : (
                                        <Ticket size={16} className="text-primary" />
                                    )}
                                    {isAdmin ? "Admin panel" : "My bookings"}
                                </Link>
                                <button
                                    onClick={handleMobileLogout}
                                    className="flex cursor-pointer items-center gap-2 text-left text-sm text-destructive"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/signin"
                                onClick={() => setOpen(false)}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar