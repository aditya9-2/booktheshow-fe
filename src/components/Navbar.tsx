import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
    { label: "Events", href: "#" },
    { label: "Ask AI", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
]

const Navbar = () => {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <div className="font-sans text-2xl tracking-wide ">
                    BOOKTHESHOW<span className="text-primary">.</span>
                </div>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
                    {NAV_LINKS.map((link) => (
                        <a key={link.label} href={link.href} className="hover:text-foreground">
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-4 md:flex">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Sign in
                    </a>
                    <Button className="bg-black p-5 rounded-full hover:cursor-pointer hover:bg-gray-800">Get tickets</Button>
                </div>

                {/* Hamburger */}
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
                            <a key={link.label} href={link.href} className="hover:text-foreground">
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                            Sign in
                        </a>
                        <Button className="w-full bg-black hover:cursor-pointer hover:bg-gray-800 rounded-full">Get tickets</Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar