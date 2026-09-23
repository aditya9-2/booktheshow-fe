import axios from "axios";
import type { ChatHistoryResponse, CreateBookingPayload, CreateBookingResponse, CreateEventPayload, CreateEventResponse, EventItem, MyBookingsResponse } from "./types";
import { getToken } from "./auth";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
})

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

const createEventFormData = (payload: CreateEventPayload) => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("date", payload.date);
    formData.append("sections", JSON.stringify(payload.sections));

    if (payload.poster) {
        formData.append("posters", payload.poster);
    }

    return formData;
}

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

export const createBooking = (payload: CreateBookingPayload) => {
    return api.post<CreateBookingResponse>("bookings/create-booking", payload);
}

export const getMyBookings = () => api.get<MyBookingsResponse>("bookings/your-booking");

export const createEvent = (payload: CreateEventPayload) => {
    const formData = createEventFormData(payload);

    return api.post<CreateEventResponse>("/admin/create-event", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updateEvent = (id: string, payload: CreateEventPayload) => {
    const formData = createEventFormData(payload);

    return api.put<{ message: string; event: EventItem }>(
        `/admin/update-event/${id}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
};

export const deleteEvent = (id: string) => {
    return api.delete<{ message: string }>(`/admin/delete-event/${id}`);
}

export const getChatHistory = () => api.get<ChatHistoryResponse>("/ai/history")

/*
    * NOTE: POST /ai/chat is intentionally NOT called through this axios `api`
    instance. That endpoint streams a Server-Sent Events (SSE) response, and
    axios has no built-in support for reading a streamed response body —
    it buffers the whole response and resolves once, which defeats the
    word-by-word streaming UX entirely.

    * The actual request (same base URL, same auth token) is made with raw
    `fetch` (`streamAIChat`), which manually
    reads the response body as a stream via `res.body.getReader()`.

    * all these because i am using stream!
*/