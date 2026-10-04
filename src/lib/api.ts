import axios from "axios";
import type {
    ChatHistoryResponse,
    CreateBookingPayload,
    CreateBookingResponse,
    CreateEventPayload,
    CreateEventResponse,
    CreateWalletOrderPayload,
    CreateWalletOrderResponse,
    EventItem,
    MyBookingsResponse,
    VerifyWalletPaymentPayload,
    VerifyWalletPaymentResponse,
    Wallet
} from "./types";
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
    formData.append("category", payload.category);
    formData.append("venue", payload.venue);
    formData.append("location", payload.location);
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

export const getAllEvents = (category?: string) => {
    return api.get<AllEventsResponse>("/event/all", { params: category ? { category } : undefined });
}

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


export type CreateOrderPayload = { eventId: string; sectionId: string; quantity: number }
export type CreateOrderResponse = { orderId: string; amount: number; currency: string; keyId: string }
export type VerifyPaymentPayload = {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    eventId: string
    sectionId: string
    quantity: number
}

export const createOrder = (payload: CreateOrderPayload) => {
    return api.post<CreateOrderResponse>("/payments/create-order", payload)
}


export const verifyPayment = (payload: VerifyPaymentPayload) => {
    return api.post<CreateBookingResponse>("/payments/verify", payload)
}


export const getWallet = () => api.get<Wallet>("/wallet");

export const createWalletOrder = (payload: CreateWalletOrderPayload) => {
    return api.post<CreateWalletOrderResponse>("/wallet/create-order", payload)
}
export const verifyWalletPayment = (payload: VerifyWalletPaymentPayload) => {
    return api.post<VerifyWalletPaymentResponse>("/wallet/verify", payload)
}
