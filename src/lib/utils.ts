import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const withMinDelay = async <T,>(promise: Promise<T>, ms = 600): Promise<T> => {
    const [result] = await Promise.all([promise, new Promise((r) => setTimeout(r, ms))])
    return result
}