import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span
            className={cn(
                "rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground",
                className,
            )}
        >
            {children}
        </span>
    )
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-2xl border border-border bg-surface/60 backdrop-blur-xl", className)}>
            {children}
        </div>
    )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "dark" | "ghost" | "danger"
    size?: "sm" | "md"
}

export function Button({ variant = "dark", size = "md", className, ...props }: BtnProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                size === "sm" ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm",
                variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
                variant === "dark" && "bg-foreground text-surface hover:bg-foreground/90",
                variant === "ghost" &&
                "border border-border bg-surface/60 text-foreground backdrop-blur-md hover:border-primary/40",
                variant === "danger" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                className,
            )}
            {...props}
        />
    )
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export function Field({ label, className, ...props }: FieldProps) {
    return (
        <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
            <input
                className={cn(
                    "mt-2 w-full rounded-xl border border-border bg-surface/80 px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50",
                    className,
                )}
                {...props}
            />
        </label>
    )
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }

export function TextareaField({ label, className, ...props }: AreaProps) {
    return (
        <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
            <textarea
                className={cn(
                    "mt-2 w-full rounded-xl border border-border bg-surface/80 px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50",
                    className,
                )}
                {...props}
            />
        </label>
    )
}

export function SkeletonCard() {
    return <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface/50" />
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="font-display text-3xl tracking-wide">{title}</p>
            {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
        </div>
    )
}

export function PageHeading({
    eyebrow,
    title,
    subtitle,
    action,
}: {
    eyebrow: string
    title: string
    subtitle?: string
    action?: ReactNode
}) {
    return (
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
                <h1 className="mt-3 font-display text-5xl leading-[0.9] tracking-wide sm:text-6xl">{title}</h1>
                {subtitle ? <p className="mt-3 max-w-xl text-pretty text-muted-foreground">{subtitle}</p> : null}
            </div>
            {action}
        </div>
    )
}