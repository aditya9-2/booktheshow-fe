import { create } from "zustand"
import { getToken, getStoredEmail, setSession, clearSession, decodeToken, isAdminRole } from "@/lib/auth"
import { useChatStore } from "@/store/chatStore"

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

    if (token && storedEmail) {
        const payload = decodeToken(token)
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
        
        useChatStore.getState().reset()

        setSession(token, userEmail)
        const payload = decodeToken(token)
        set({
            email: userEmail,
            isAdmin: payload ? isAdminRole(payload.roleId) : false,
            isAuthenticated: true,
        })
    },

    logout: () => {
        useChatStore.getState().reset()

        clearSession()
        set({ email: null, isAdmin: false, isAuthenticated: false })
    },
}))