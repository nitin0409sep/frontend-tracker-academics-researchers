import { BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function EmptyState({
  title,
  description,
  actionLabel = "Add your first paper"
}: {
  title: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf8] via-white to-[#eef6f6]">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Build your reading habit
          </div>
          <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <Button asChild>
          <Link to="/add">{actionLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
