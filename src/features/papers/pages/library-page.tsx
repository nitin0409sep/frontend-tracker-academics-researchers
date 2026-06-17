import { SlidersHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { EmptyState } from "@/shared/components/empty-state"
import { FiltersPanel, getActiveFilterCount } from "@/features/papers/components/filters-panel"
import { PaperTable } from "@/features/papers/components/paper-table"
import { SectionHeading } from "@/shared/components/section-heading"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { datePresets } from "@/shared/lib/constants"
import type { PaperFilters } from "@/shared/lib/types"
import { usePapers } from "@/features/papers/hooks/use-papers"

const initialFilters: PaperFilters = {
  readingStage: [],
  researchDomain: [],
  impactScore: [],
  dateRangePreset: datePresets[3]
}

export function LibraryPage() {
  const [filters, setFilters] = useState<PaperFilters>(initialFilters)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const { papers, loading, error } = usePapers(filters)
  const activeFilterCount = getActiveFilterCount(filters)

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFilterSheetOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  useEffect(() => {
    document.body.classList.toggle("sheet-open", isFilterSheetOpen)
    return () => document.body.classList.remove("sheet-open")
  }, [isFilterSheetOpen])

  return (
    <>
      <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-6">
        <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(182,219,212,0.85),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(234,214,180,0.55),transparent_24%),linear-gradient(135deg,#f7f5ef_0%,#eef5f3_100%)]">
          <SectionHeading
            eyebrow="Paper Library"
            title="Your reading library, structured for retrieval"
            description="Browse every saved paper, combine multiple filters, and quickly see what deserves your next session."
          />
        </Card>

        <Card className="overflow-hidden bg-[linear-gradient(180deg,#fbfcfb,#f5f8f7)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Filter Controls
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Open the filter sheet to refine the library without taking permanent page space.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[#dce4e7] bg-white/90 px-4 py-2 text-sm text-slate-600">
                {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
              </div>
              <Button onClick={() => setIsFilterSheetOpen(true)} className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </Card>

        <div className="min-w-0 lg:flex-1 lg:min-h-0">
          {error ? (
            <Card className="text-sm text-rose-700">{error}</Card>
          ) : loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : papers.length === 0 ? (
            <EmptyState
              title="No papers match these filters"
              description="Try broadening the filter set or start by saving a few papers from your current reading queue."
              actionLabel="Add a paper"
            />
          ) : (
            <PaperTable papers={papers} dateRangePreset={filters.dateRangePreset} />
          )}
        </div>
      </div>

      {isFilterSheetOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-[2px]"
              onClick={() => setIsFilterSheetOpen(false)}
            >
              <div className="absolute inset-x-0 bottom-0 flex justify-center px-2 pb-2 sm:px-4 sm:pb-4">
                <div
                  className="flex h-[82dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(250,251,250,0.98),rgba(243,247,246,0.98))] shadow-[0_-20px_60px_rgba(16,37,46,0.18)] sm:h-[76dvh] sm:rounded-[32px]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="shrink-0 px-5 pb-4 pt-3 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300" />
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                        Library Filters
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsFilterSheetOpen(false)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce4e7] bg-white/90 text-slate-600 transition hover:bg-slate-50 hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                    <FiltersPanel
                      filters={filters}
                      onChange={setFilters}
                      onClose={() => setIsFilterSheetOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
