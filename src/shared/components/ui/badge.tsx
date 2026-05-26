import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}
