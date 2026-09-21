import axios from "axios";
import type { EventItem } from "./types";

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

export type AllEventsResponse = {
    count: number;
    events: EventItem[];
    message?: string
}

export type SingleEventResponse = {
    event: EventItem
}

export const signup = (payload: SignupPayload) => api.post("/auth/signup", payload);
export const signin = (payload: SigninPayload) => api.post<SigninResponse>("/auth/signin", payload);

export const getAllEvents = () => api.get<AllEventsResponse>("/event/all");
export const getEventById = (id: string) => api.get<SingleEventResponse>(`event/${id}`);