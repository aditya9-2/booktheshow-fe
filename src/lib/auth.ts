import { jwtDecode } from "jwt-decode"

export type JwtPayload = { id: string; roleId: number; iat: number }

const TOKEN_KEY = "token"
const EMAIL_KEY = "user_email"

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getStoredEmail = () => localStorage.getItem(EMAIL_KEY)

export const setSession = (token: string, email: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(EMAIL_KEY, email)
}

export const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
}

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token)
    } catch {
        return null
    }
}

// roleId 1 = admin, per your backend's convention
export const isAdminRole = (roleId: number) => roleId === 1