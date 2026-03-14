import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strips markdown formatting from AI responses for plain-text display.
 * Removes headers (# ## ###), bold (**), italic (*), and other markdown syntax.
 */
export function formatAiMessage(text: string): string {
  if (!text || typeof text !== "string") return text
  return text
    .replace(/^#{1,6}\s+/gm, "") // Remove markdown headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/__(.+?)__/g, "$1") // Remove bold (underscore)
    .replace(/_(.+?)_/g, "$1") // Remove italic (underscore)
    .replace(/`(.+?)`/g, "$1") // Remove inline code
    .replace(/^[-*]\s+/gm, "") // Remove list bullets at line start
    .replace(/^\d+\.\s+/gm, "") // Remove numbered list markers
    .replace(/\n{3,}/g, "\n\n") // Collapse excessive newlines
    .trim()
}
