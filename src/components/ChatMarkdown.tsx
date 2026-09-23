import ReactMarkdown from "react-markdown"

// Renders the AI's markdown-formatted replies (bold, lists, etc.) using
// the chat bubble's existing typography — no headings/images/tables needed
// for a conversational assistant, so only a minimal set of elements is styled.
const ChatMarkdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                        {children}
                    </a>
                ),
                code: ({ children }) => (
                    <code className="rounded bg-foreground/10 px-1 py-0.5 text-xs">{children}</code>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default ChatMarkdown