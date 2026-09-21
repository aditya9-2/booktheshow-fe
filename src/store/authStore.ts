import { create } from "zustand"
import { getToken, getStoredEmail, setSession, clearSession, decodeToken, isAdminRole } from "@/lib/auth"

type AuthState = {
    email: string | null
    isAdmin: boolean
    isAuthenticated: boolean
    login: (token: string, email: string) => void
    logout: () => void
    hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    email: null,
    isAdmin: false,
    isAuthenticated: false,

    login: (token, userEmail) => {
        setSession(token, userEmail)
        const payload = decodeToken(token)
        set({
            email: userEmail,
            isAdmin: payload ? isAdminRole(payload.roleId) : false,
            isAuthenticated: true,
        })
    },

    logout: () => {
        clearSession()
        set({ email: null, isAdmin: false, isAuthenticated: false })
    },

    // Rehydrates auth state from localStorage — call once on app boot
    hydrate: () => {
        const token = getToken()
        const storedEmail = getStoredEmail()
        if (token && storedEmail) {
            const payload = decodeToken(token)
            if (payload) {
                set({
                    email: storedEmail,
                    isAdmin: isAdminRole(payload.roleId),
                    isAuthenticated: true,
                })
                return
            }
        }
        set({ email: null, isAdmin: false, isAuthenticated: false })
    },
}))