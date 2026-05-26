import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FilterChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
        active
          ? "border-[#24495a] bg-[#24495a] text-white shadow-soft"
          : "border-[#d5dee3] bg-white/90 text-slate-700 hover:border-[#b8c7cf] hover:bg-[#f6faf9]"
      )}
    >
      {children}
    </button>
  );
}
