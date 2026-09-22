import { create } from "zustand"
import { getToken, getStoredEmail, setSession, clearSession, decodeToken, isAdminRole } from "@/lib/auth"

type AuthState = {
    email: string | null
    isAdmin: boolean
    isAuthenticated: boolean
    login: (token: string, email: string) => void
    logout: () => void
}

const getInitialAuthState = (): Pick<AuthState, "email" | "isAdmin" | "isAuthenticated"> => {
    const token = getToken()
    const storedEmail = getStoredEmail()

    // console.log("hydrate check →", { token, storedEmail }) 

    if (token && storedEmail) {
        const payload = decodeToken(token)
        // console.log("decoded payload →", payload)
        if (payload) {
            return {
                email: storedEmail,
                isAdmin: isAdminRole(payload.roleId),
                isAuthenticated: true,
            }
        }
    }

    return { email: null, isAdmin: false, isAuthenticated: false }
}

export const useAuthStore = create<AuthState>((set) => ({
    ...getInitialAuthState(),

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
}))