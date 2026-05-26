import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { Card } from "@/shared/components/ui/card"
import { impactScores, readingStages, type ReadingStage } from "@/shared/lib/constants"
import type { AnalyticsResponse } from "@/shared/lib/types"

const impactColors: Record<string, string> = {
  "High Impact": "#0f766e",
  "Medium Impact": "#2563eb",
  "Low Impact": "#ca8a04",
  Unknown: "#64748b"
}

const stageColors: Record<ReadingStage, string> = {
  "Abstract Read": "#0f766e",
  "Introduction Done": "#2563eb",
  "Methodology Done": "#4f46e5",
  "Results Analyzed": "#d97706",
  "Fully Read": "#16a34a",
  "Notes Completed": "#7c3aed"
}

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsResponse }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="space-y-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,245,244,0.9))]">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em]">Reading stage funnel</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            See how many papers are progressing through the reading pipeline.
          </p>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="count" data={analytics.funnel} isAnimationActive>
                {analytics.funnel.map((entry) => (
                  <Cell key={entry.stage} fill={stageColors[entry.stage]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,246,250,0.9))]">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em]">Citation vs. impact</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Papers are grouped by impact score while preserving citation count on the x-axis.
          </p>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d7e0e5" />
              <XAxis
                type="number"
                dataKey="citationCount"
                name="Citation Count"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="yGroup"
                name="Impact Score"
                tick={false}
                tickLine={false}
                axisLine={false}
                domain={[0, 40]}
              />
              <Tooltip cursor={{ strokeDasharray: "4 4" }} />
              {impactScores.map((score) => (
                <Scatter
                  key={score}
                  name={score}
                  data={analytics.scatter.filter((item) => item.impactScore === score)}
                  fill={impactColors[score]}
                />
              ))}
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-6 xl:col-span-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,239,0.9))]">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em]">Domain progression map</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare how reading stages are distributed across research domains.
          </p>
        </div>
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.stackedByDomainAndStage}
              margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d7e0e5" />
              <XAxis dataKey="domain" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              {readingStages.map((stage) => (
                <Bar
                  key={stage}
                  dataKey={stage}
                  stackId="a"
                  fill={stageColors[stage]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
