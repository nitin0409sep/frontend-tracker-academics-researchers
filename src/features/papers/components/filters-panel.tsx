import {
  datePresets,
  impactScores,
  readingStages,
  researchDomains,
  type DatePreset
} from "@/shared/lib/constants"
import type { PaperFilters } from "@/shared/lib/types"
import { FilterChip } from "@/shared/components/filter-chip"
import { Button } from "@/shared/components/ui/button"

function toggleValue<T extends string>(current: T[], value: T) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
}

const emptyFilters: PaperFilters = {
  readingStage: [],
  researchDomain: [],
  impactScore: [],
  dateRangePreset: "All Time"
}

export function getActiveFilterCount(filters: PaperFilters) {
  return (
    filters.readingStage.length +
    filters.researchDomain.length +
    filters.impactScore.length +
    (filters.dateRangePreset === "All Time" ? 0 : 1)
  )
}

export function FiltersPanel({
  filters,
  onChange,
  onClose
}: {
  filters: PaperFilters
  onChange: (filters: PaperFilters) => void
  onClose: () => void
}) {
  const activeCount = getActiveFilterCount(filters)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Filter Library
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Choose filters
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Narrow the paper list by stage, domain, impact, and time window.
          </p>
        </div>
        <div className="rounded-full border border-[#d6e0e4] bg-white/85 px-4 py-2 text-sm text-slate-600">
          {activeCount} active
        </div>
      </div>

      <div className="grid gap-4">
        <FilterRow
          label="Reading Stage"
          items={readingStages}
          activeItems={filters.readingStage}
          onToggle={(value) =>
            onChange({ ...filters, readingStage: toggleValue(filters.readingStage, value) })
          }
        />
        <FilterRow
          label="Research Domain"
          items={researchDomains}
          activeItems={filters.researchDomain}
          onToggle={(value) =>
            onChange({ ...filters, researchDomain: toggleValue(filters.researchDomain, value) })
          }
        />
        <FilterRow
          label="Impact Score"
          items={impactScores}
          activeItems={filters.impactScore}
          onToggle={(value) =>
            onChange({ ...filters, impactScore: toggleValue(filters.impactScore, value) })
          }
        />
        <div className="space-y-3 rounded-[24px] border border-white/80 bg-white/78 p-4">
          <p className="text-sm font-semibold text-foreground">Date Added</p>
          <div className="flex flex-wrap gap-2">
            {datePresets.map((preset) => (
              <FilterChip
                key={preset}
                active={filters.dateRangePreset === preset}
                onClick={() => onChange({ ...filters, dateRangePreset: preset as DatePreset })}
              >
                {preset}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#e3eaed] pt-4">
        <Button variant="outline" size="sm" onClick={() => onChange(emptyFilters)}>
          Clear all
        </Button>
        <Button size="sm" onClick={onClose}>
          Apply filters
        </Button>
      </div>
    </div>
  )
}

function FilterRow<T extends string>({
  label,
  items,
  activeItems,
  onToggle
}: {
  label: string
  items: readonly T[]
  activeItems: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-white/80 bg-white/78 p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <FilterChip key={item} active={activeItems.includes(item)} onClick={() => onToggle(item)}>
            {item}
          </FilterChip>
        ))}
      </div>
    </div>
  )
}
