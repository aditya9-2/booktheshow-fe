import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui-kit"

const NAV_LINKS = [
    { label: "Events", href: "/events" },
    { label: "Ask AI", href: "/ask-ai" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
]

const Navbar = () => {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
               
                <Link to="/" className="font-sans text-2xl tracking-wide" onClick={() => setOpen(false)}>
                    BOOKTHESHOW<span className="text-primary">.</span>
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.label} to={link.href} className="hover:text-foreground">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop */}
                <div className="hidden items-center gap-4 md:flex">
                    <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground">
                        Sign in
                    </Link>
                    <Link to="/signup">
                        <Button variant="dark" size="sm" className="hover:cursor-pointer">Get tickets</Button>
                    </Link>
                </div>

                {/* Hamburger toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="relative text-foreground md:hidden hover:cursor-pointer"
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

            {/* Mobile menu panel */}
            <div
                className={`overflow-hidden border-t border-border transition-all duration-300 ease-in-out md:hidden ${open ? "max-h-64 border-t opacity-100" : "max-h-0 border-t-0 opacity-0"
                    }`}
            >
                <div className="px-6 py-4">
                    <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className="hover:text-foreground">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    {/* Sign in only */}
                    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                        <Link to="/signin" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                            Sign in
                        </Link>
                        {/* <Link to="/signup" onClick={() => setOpen(false)}>
                            <Button variant="dark" className="w-full">Get tickets</Button>
                        </Link> */}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar