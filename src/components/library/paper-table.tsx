import { ArrowDown, ArrowDownUp, ArrowUp, CalendarDays, FileText, Microscope, Quote } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DatePreset, Paper } from "@/lib/types";

type SortKey = "paperTitle" | "firstAuthorName" | "researchDomain" | "readingStage" | "citationCount" | "dateAdded";
type SortDirection = "asc" | "desc";

const sortableColumns: Array<{ label: string; key: SortKey; align?: "left" | "right" }> = [
  { label: "Paper", key: "paperTitle" },
  { label: "Domain", key: "researchDomain" },
  { label: "Stage", key: "readingStage" },
  { label: "Citations", key: "citationCount", align: "right" },
  { label: "Date Added", key: "dateAdded" }
];

export function PaperTable({
  papers,
  dateRangePreset
}: {
  papers: Paper[];
  dateRangePreset: DatePreset;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("dateAdded");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedPapers = [...papers].sort((left, right) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortKey === "citationCount") {
      return (left.citationCount - right.citationCount) * direction;
    }

    if (sortKey === "dateAdded") {
      return (new Date(left.dateAdded).getTime() - new Date(right.dateAdded).getTime()) * direction;
    }

    return left[sortKey].localeCompare(right[sortKey]) * direction;
  });

  function handleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "dateAdded" || nextKey === "citationCount" ? "desc" : "asc");
  }

  return (
    <Card className="flex min-h-0 flex-col overflow-hidden p-0 lg:h-full">
      <div className="border-b border-border bg-[linear-gradient(180deg,#fbfcfb,#f3f7f6)] px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Library Overview</p>
            <div className="mt-2 flex flex-wrap items-end gap-4">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">{papers.length}</p>
              <p className="pb-1 text-sm text-muted-foreground">paper{papers.length === 1 ? "" : "s"} in view</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <InfoPill label="Date Range" value={dateRangePreset} />
            <InfoPill label="Sorting" value="Click headers" />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 xl:block hidden overflow-y-auto app-scrollbar">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[17%]" />
            <col className="w-[19%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border bg-[#f6f8f5]">
              {sortableColumns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left first:pl-6 last:pr-6">
                  <SortableHeader
                    label={column.label}
                    active={sortKey === column.key}
                    direction={sortDirection}
                    align={column.align}
                    onClick={() => handleSort(column.key)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPapers.map((paper) => (
              <tr key={paper.id} className="border-b border-border/90 align-top transition hover:bg-[#fafbf8] last:border-b-0">
                <td className="px-6 py-5">
                  <div className="space-y-3">
                    <div>
                      <p className="truncate text-[1.05rem] font-semibold tracking-[-0.03em] text-foreground">
                        {paper.paperTitle}
                      </p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{paper.firstAuthorName}</p>
                    </div>
                    <ImpactBadge impactScore={paper.impactScore} />
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-muted-foreground">{paper.researchDomain}</td>
                <td className="px-6 py-5 text-sm text-muted-foreground">{paper.readingStage}</td>
                <td className="px-6 py-5 text-right text-sm font-semibold text-foreground">{paper.citationCount}</td>
                <td className="px-6 py-5 text-sm text-muted-foreground">{paper.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="app-scrollbar grid flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 xl:hidden">
        {sortedPapers.map((paper) => (
          <Card key={paper.id} className="space-y-5 border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,245,0.94))] p-5 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold tracking-[-0.03em] text-foreground">{paper.paperTitle}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{paper.firstAuthorName}</p>
                </div>
                <ImpactBadge impactScore={paper.impactScore} />
              </div>
            </div>

            <div className="grid gap-3">
              <MetaRow icon={Microscope} label="Research Domain" value={paper.researchDomain} />
              <MetaRow icon={FileText} label="Reading Stage" value={paper.readingStage} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatTile icon={Quote} label="Citations" value={String(paper.citationCount)} />
              <StatTile icon={CalendarDays} label="Date Added" value={paper.dateAdded} />
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}

function SortableHeader({
  label,
  active,
  direction,
  align = "left",
  onClick
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  align?: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <span>{label}</span>
      {active ? (
        direction === "asc" ? <ArrowUp className="h-3.5 w-3.5 shrink-0" /> : <ArrowDown className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <ArrowDownUp className="h-3.5 w-3.5 shrink-0 opacity-60" />
      )}
    </button>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[#dce4e7] bg-white/88 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function ImpactBadge({ impactScore }: { impactScore: Paper["impactScore"] }) {
  const tone =
    impactScore === "High Impact"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : impactScore === "Medium Impact"
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : impactScore === "Low Impact"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-50 text-slate-700";

  return <Badge className={tone}>{impactScore}</Badge>;
}

function MetaRow({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Microscope;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-[#e6ecef] bg-white/78 px-4 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#eef4f2] text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Quote;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e6ecef] bg-[#f8fbfa] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
