import { useRef, useEffect, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { streamAIChat } from "@/lib/chatStream"
import { getChatHistory } from "@/lib/api"
import type { EventItem } from "@/lib/types"
import { useChatStore } from "@/store/chatStore"
import EventResultCard from "@/components/EventResultCard"
import ChatMarkdown from "@/components/ChatMarkdown"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { ASK_AI_SHAPES } from "@/constants/backgroundShapes"

const AskAI = () => {
    const { messages, addMessage, updateMessage, hydrateFromHistory, hydrated } = useChatStore()
    const [input, setInput] = useState("")
    const [sending, setSending] = useState(false)
    const [typingId, setTypingId] = useState<string | null>(null)
    const [loadingHistory, setLoadingHistory] = useState(!hydrated)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Rehydrate from the server's Redis-backed history once, on first mount
    useEffect(() => {
        if (hydrated) {
            setLoadingHistory(false)
            return
        }

        let cancelled = false
        const fetchHistory = async () => {
            try {
                const res = await getChatHistory()
                if (!cancelled) hydrateFromHistory(res.data.history)
            } catch {
                if (!cancelled) hydrateFromHistory([])
            } finally {
                if (!cancelled) setLoadingHistory(false)
            }
        }

        fetchHistory()
        return () => {
            cancelled = true
        }
    }, [hydrated, hydrateFromHistory])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (!loadingHistory) inputRef.current?.focus()
    }, [loadingHistory])

    const sendPrompt = async (prompt: string) => {
        const trimmed = prompt.trim()
        if (!trimmed || sending) return

        addMessage({ id: crypto.randomUUID(), role: "user", content: trimmed })
        setInput("")
        setSending(true)

        const assistantId = crypto.randomUUID()
        addMessage({ id: assistantId, role: "assistant", content: "" })
        setTypingId(assistantId)

        await streamAIChat(trimmed, {
            onToken: (token) => {
                updateMessage(assistantId, (m) => ({ ...m, content: m.content + token }))
            },
            onToolResults: (results) => {
                const events: EventItem[] = results.flatMap((tr) => {
                    if (!tr.result || "error" in tr.result) return []
                    return Array.isArray(tr.result) ? tr.result : [tr.result]
                })
                if (events.length) {
                    updateMessage(assistantId, (m) => ({
                        ...m,
                        toolResults: [{ name: "searchEvents", result: events }],
                    }))
                }
            },
            onDone: () => {
                setTypingId(null)
                setSending(false)
            },
            onError: (message) => {
                updateMessage(assistantId, (m) => ({ ...m, content: message }))
                setTypingId(null)
                setSending(false)
            },
        })
    }

    const handleSend = (e: FormEvent) => {
        e.preventDefault()
        sendPrompt(input)
    }

    return (
        <section className="relative flex min-h-[calc(100vh-64px)] flex-col overflow-hidden">
            <AmbientGlow />
            <BackgroundShapes shapes={ASK_AI_SHAPES} />

            <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Concierge</p>
                </div>
                <h1 className="mt-3 font-display text-3xl tracking-wide">Ask the concierge</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                    Chat history is kept for 48 hours, then clears automatically.
                </p>

                <div className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
                    {loadingHistory ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                                    className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user"
                                                ? "rounded-tr-sm bg-primary text-primary-foreground"
                                                : "rounded-tl-sm bg-foreground/5 text-foreground"
                                            }`}
                                    >
                                        {msg.content ? (
                                            <>
                                                <ChatMarkdown content={msg.content} />
                                                {msg.id === typingId && (
                                                    <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-current align-middle" />
                                                )}
                                            </>
                                        ) : (
                                            <Loader2 size={14} className="animate-spin text-muted-foreground" />
                                        )}
                                    </div>

                                    {msg.toolResults?.[0]?.result && Array.isArray(msg.toolResults[0].result) && (
                                        <div className="flex w-full max-w-[85%] flex-col gap-2">
                                            {(msg.toolResults[0].result as EventItem[]).map((ev) => (
                                                <EventResultCard key={ev._id} event={ev} onAsk={sendPrompt} />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                    <div ref={scrollRef} />
                </div>

                <form
                    onSubmit={handleSend}
                    className="mt-4 flex items-center gap-3 rounded-full border border-border bg-surface/80 p-2 pl-5 backdrop-blur-xl"
                >
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a show, or say what you're in the mood for…"
                        disabled={sending || loadingHistory}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={sending || loadingHistory || !input.trim()}
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Send"
                    >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AskAI