import type { HTMLAttributes } from "react"
import { cn } from "@/shared/lib/utils"

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-2xl bg-slate-200/80", className)}
      {...props}
    />
  )
}
