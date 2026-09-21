import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/" className="font-sans text-lg tracking-wide">
                    BOOKTHESHOW<span className="text-primary">.</span>
                </Link>
                <p className="font-mono text-xs text-muted-foreground">
                    &copy; 2026 BookTheShow · Live tickets, booked fast
                </p>
            </div>
        </footer>
    )
}

export default Footer