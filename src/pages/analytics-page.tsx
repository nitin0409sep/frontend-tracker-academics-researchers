import { AnalyticsCharts } from "@/components/analytics/charts";
import { StatCard } from "@/components/analytics/stat-card";
import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analytics";

export function AnalyticsPage() {
  const { analytics, loading, error } = useAnalytics();

  if (error) {
    return <Card className="text-sm text-rose-700">{error}</Card>;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="h-40 animate-pulse bg-white/60" />
        <Card className="h-80 animate-pulse bg-white/60" />
      </div>
    );
  }

  if (!analytics || analytics.summary.totalPapers === 0) {
    return (
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Analytics"
          title="Reading analytics that surface momentum"
          description="Once you add papers, this dashboard will show stage progress, citation patterns, and domain coverage."
        />
        <EmptyState
          title="No analytics yet"
          description="Add a few papers first, then return here to see funnel progress, citation clusters, and completion rate."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(184,222,214,0.9),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(239,217,176,0.55),transparent_26%),linear-gradient(135deg,#f7f6f1_0%,#edf4f3_100%)]">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionHeading
            eyebrow="Analytics"
            title="Reading analytics that surface momentum"
            description="Track completion trends, compare research domains, and see which high-impact papers still need deeper reading."
          />
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[26px] border border-white/80 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Signal</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Stage velocity</p>
            </div>
            <div className="rounded-[26px] border border-white/80 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Focus</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Impact clusters</p>
            </div>
            <div className="rounded-[26px] border border-white/80 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Coverage</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Domain balance</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Papers"
          value={String(analytics.summary.totalPapers)}
          hint="All papers currently stored in your reading database."
          tone="default"
        />
        <StatCard
          label="Completion Rate"
          value={`${analytics.summary.completionRate}%`}
          hint="Calculated as Fully Read divided by total papers."
          tone="cool"
        />
        <StatCard
          label="Fully Read"
          value={String(analytics.summary.fullyRead)}
          hint="Papers that have reached the fully read milestone."
          tone="warm"
        />
      </div>

      <AnalyticsCharts analytics={analytics} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em]">Papers by reading stage</h3>
            <p className="mt-1 text-sm text-muted-foreground">A direct summary of how your reading workload is distributed.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {analytics.summary.papersByStage.map((item) => (
              <div key={item.stage} className="rounded-3xl border border-white/80 bg-accent/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.stage}</p>
                <p className="mt-2 text-2xl font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em]">Average citations per domain</h3>
            <p className="mt-1 text-sm text-muted-foreground">Useful for spotting where your reading list leans most influential.</p>
          </div>
          <div className="space-y-3">
            {analytics.summary.averageCitationsPerDomain.map((item) => (
              <div
                key={item.domain}
                className="flex items-center justify-between rounded-3xl border border-border bg-white/70 px-4 py-3"
              >
                <p className="font-medium text-foreground">{item.domain}</p>
                <p className="text-sm font-semibold text-primary">{item.averageCitations}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
