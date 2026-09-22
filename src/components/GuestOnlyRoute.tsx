import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

type GuestOnlyRouteProps = {
    children: React.ReactNode
}

// Redirects an already-authenticated user away from auth pages
const GuestOnlyRoute = ({ children }: GuestOnlyRouteProps) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    if (isAuthenticated) return <Navigate to="/" replace />

    return <>{children}</>
}

export default GuestOnlyRoute