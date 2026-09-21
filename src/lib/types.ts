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