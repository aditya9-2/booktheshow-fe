import { create } from "zustand"
import type { ChatMessage, RawHistoryMessage } from "@/lib/types"

type ChatState = {
    messages: ChatMessage[]
    hydrated: boolean
    addMessage: (msg: ChatMessage) => void
    updateMessage: (id: string, updater: (msg: ChatMessage) => ChatMessage) => void
    hydrateFromHistory: (history: RawHistoryMessage[]) => void
    reset: () => void
}

const WELCOME_MESSAGE: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content: "Hi! I'm the BookTheShow concierge. Tell me what you're in the mood for, or ask about a specific show.",
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [WELCOME_MESSAGE],
    hydrated: false,

    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

    updateMessage: (id, updater) =>
        set((state) => ({
            messages: state.messages.map((m) => (m.id === id ? updater(m) : m)),
        })),

    hydrateFromHistory: (history) =>
        set(() => {
            if (history.length === 0) {
                return { messages: [WELCOME_MESSAGE], hydrated: true }
            }
            const restored: ChatMessage[] = history.map((m) => ({
                id: crypto.randomUUID(),
                role: m.role,
                content: m.content,
            }))
            return { messages: restored, hydrated: true }
        }),

    reset: () => set({ messages: [WELCOME_MESSAGE], hydrated: false }),
}))