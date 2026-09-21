import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
})

export type SignupPayload = { 
    name: string; 
    email: string; 
    password: string 
}
export type SigninPayload = { 
    email: string; 
    password: string 
}
export type SigninResponse = { 
    token: string 
}

export const signup = (payload: SignupPayload) => api.post("/auth/signup", payload)
export const signin = (payload: SigninPayload) => api.post<SigninResponse>("/auth/signin", payload)