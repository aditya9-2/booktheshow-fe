"use client"
import { cn } from "@/lib/utils"
import React, { type ReactNode } from "react"

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode
    showRadialGradient?: boolean
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <div className={cn("relative overflow-hidden", className)} {...props}>
            <div
                className={cn(
                    `pointer-events-none absolute inset-0 [background-image:var(--white-gradient),var(--aurora)] bg-size-[300%,200%] bg-position-[50%_50%,50%_50%] opacity-55 blur-[30px] will-change-transform animate-aurora`,
                    "[--aurora:repeating-linear-gradient(100deg,var(--color-primary)_10%,var(--color-accent)_15%,var(--color-primary)_20%,var(--color-secondary)_25%,var(--color-primary)_30%)]",
                    "[--white-gradient:repeating-linear-gradient(100deg,var(--color-background)_0%,var(--color-background)_7%,transparent_10%,transparent_12%,var(--color-background)_16%)]",
                    showRadialGradient &&
                        "mask-[radial-gradient(ellipse_at_50%_0%,black_15%,transparent_72%)]",
                )}
            />
            {children}
        </div>
    )
}