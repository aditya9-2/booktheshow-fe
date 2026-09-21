import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

type ProtectedRouteProps = {
    children: React.ReactNode
    requireAdmin?: boolean
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isAdmin = useAuthStore((s) => s.isAdmin)

    if (!isAuthenticated) return <Navigate to="/signin" replace />
    if (requireAdmin && !isAdmin) return <Navigate to="/404" replace />

    return <>{children}</>
}

export default ProtectedRoute