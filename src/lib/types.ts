export type EventSection = {
    _id: string
    name: string
    price: number
    capacity: number
    remaining: number
}

export type EventItem = {
    _id: string
    name: string
    date: string
    posterUrl?: string
    sections: EventSection[]
}

// the fuckin culprit - "erasableSyntaxOnly": true, cannot use enums!
export const BookingStatus = {
    Booked: "booked",
    Cancelled: "cancelled",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export type Booking = {
    _id: string
    userId: string
    eventId: string
    sectionId: string
    quantity: number
    priceAtBooking: number
    status: BookingStatus
    idempotencyKey: string
    createdAt: string
}

export type MyBooking = {
    _id: string
    eventName: string
    eventDate: string
    sectionName: string
    quantity: number
    priceAtBooking: number
    createdAt: string
}

export type CreateBookingPayload = {
    eventId: string
    sectionId: string
    quantity: number
    idempotencyKey: string
}

export type CreateBookingResponse = {
    message: string; booking: Booking
}

export type MyBookingsResponse = {
    bookings: MyBooking[]
}

export type CreateEventSection = {
    name: string
    price: number
    capacity: number
    remaining: number
}

export type CreateEventPayload = {
    name: string
    date: string
    sections: CreateEventSection[]
    poster?: File
}

export type CreateEventResponse = {
    message: string;
    event: EventItem
}

export type ChatRole = "user" | "assistant"

export type ChatToolResult = {
    name: "searchEvents" | "getEventDetails"
    result: EventItem[] | EventItem | { error: string }
}

export type ChatMessage = {
    id: string
    role: ChatRole
    content: string
    toolResults?: ChatToolResult[]
}

export type AskAIPayload = { message: string }
export type AskAIResponse = { reply: string; toolResults: ChatToolResult[] }

export type RawHistoryMessage = { role: "user" | "assistant"; content: string }
export type ChatHistoryResponse = { history: RawHistoryMessage[] }