import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  tone = "default"
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "warm" | "cool";
}) {
  const toneClasses = {
    default: "from-white to-[#f3f6f4]",
    warm: "from-[#fff7ec] to-[#f2ede4]",
    cool: "from-[#eef7f6] to-[#edf2f8]"
  };

  return (
    <Card className={`space-y-4 bg-gradient-to-br ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </Card>
  );
}
