import { getToken } from "./auth"
import type { ChatToolResult } from "./types"

type StreamHandlers = {
    onToken: (token: string) => void
    onToolResults: (results: ChatToolResult[]) => void
    onDone: () => void
    onError: (message: string) => void
}

// Streams the AI chat response via SSE using fetch (EventSource can't send auth headers)
export const streamAIChat = async (message: string, handlers: StreamHandlers) => {
    const token = getToken()

    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ message }),
        })

        if (!res.ok || !res.body) {
            handlers.onError("Couldn't reach the concierge. Try again.")
            return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const events = buffer.split("\n\n")
            buffer = events.pop() ?? "" // keep the last, possibly incomplete chunk

            for (const rawEvent of events) {
                const lines = rawEvent.split("\n")
                const eventLine = lines.find((l) => l.startsWith("event: "))
                const dataLine = lines.find((l) => l.startsWith("data: "))
                if (!eventLine || !dataLine) continue

                const eventName = eventLine.replace("event: ", "").trim()
                const data = JSON.parse(dataLine.replace("data: ", ""))

                if (eventName === "token") handlers.onToken(data.token)
                else if (eventName === "toolResults") handlers.onToolResults(data.toolResults)
                else if (eventName === "done") handlers.onDone()
                else if (eventName === "error") handlers.onError(data.message ?? "Something went wrong.")
            }
        }
    } catch {
        handlers.onError("Connection lost. Try again.")
    }
}