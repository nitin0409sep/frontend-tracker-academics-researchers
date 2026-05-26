import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createPaper } from "@/lib/api";
import { impactScores, readingStages, researchDomains } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  paperTitle: z.string().trim().min(1, "Paper title is required"),
  firstAuthorName: z.string().trim().min(1, "First author name is required"),
  researchDomain: z.enum(researchDomains, { message: "Research domain is required" }),
  readingStage: z.enum(readingStages, { message: "Reading stage is required" }),
  citationCount: z.coerce.number().int().min(0, "Citation count must be 0 or greater"),
  impactScore: z.enum(impactScores, { message: "Impact score is required" }),
  dateAdded: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Date added is required")
});

type FormValues = z.infer<typeof schema>;

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];
const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export function AddPaperPage() {
  const { pushToast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: getDefaultValues()
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createPaper(values);
      pushToast({
        variant: "success",
        title: "Paper saved",
        message: "The paper has been added to your library successfully."
      });
      reset(getDefaultValues());
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Unable to save paper",
        message: error instanceof Error ? error.message : "Something went wrong while saving the paper."
      });
    }
  });

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(188,224,216,0.88),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(238,219,186,0.5),transparent_24%),linear-gradient(135deg,#f7f5ef_0%,#eff5f3_100%)]">
        <SectionHeading
          eyebrow="Add Paper"
          title="Capture the papers worth your time"
          description="Record key metadata, mark how far you have read, and keep every paper ready for later analysis."
        />
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="space-y-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,246,244,0.92))]">
          <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit} noValidate>
            <Field label="Paper Title" error={errors.paperTitle?.message} className="md:col-span-2">
              <Input
                placeholder="Attention Is All You Need"
                aria-invalid={Boolean(errors.paperTitle)}
                className={fieldClassName(Boolean(errors.paperTitle))}
                {...register("paperTitle")}
              />
            </Field>

            <Field label="First Author Name" error={errors.firstAuthorName?.message}>
              <Input
                placeholder="Ashish Vaswani"
                aria-invalid={Boolean(errors.firstAuthorName)}
                className={fieldClassName(Boolean(errors.firstAuthorName))}
                {...register("firstAuthorName")}
              />
            </Field>

            <Field label="Citation Count" error={errors.citationCount?.message}>
              <Input
                type="number"
                min={0}
                placeholder="12456"
                aria-invalid={Boolean(errors.citationCount)}
                className={fieldClassName(Boolean(errors.citationCount))}
                {...register("citationCount")}
              />
            </Field>

            <Field label="Research Domain" error={errors.researchDomain?.message}>
              <Select
                aria-invalid={Boolean(errors.researchDomain)}
                className={fieldClassName(Boolean(errors.researchDomain))}
                {...register("researchDomain")}
              >
                {researchDomains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Reading Stage" error={errors.readingStage?.message}>
              <Select
                aria-invalid={Boolean(errors.readingStage)}
                className={fieldClassName(Boolean(errors.readingStage))}
                {...register("readingStage")}
              >
                {readingStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Impact Score" error={errors.impactScore?.message}>
              <Select
                aria-invalid={Boolean(errors.impactScore)}
                className={fieldClassName(Boolean(errors.impactScore))}
                {...register("impactScore")}
              >
                {impactScores.map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Date Added" error={errors.dateAdded?.message}>
              <Controller
                control={control}
                name="dateAdded"
                render={({ field }) => (
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    hasError={Boolean(errors.dateAdded)}
                  />
                )}
              />
            </Field>

            <div className="md:col-span-2 flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm leading-6 text-muted-foreground">
                All fields are validated with React Hook Form and persisted to PostgreSQL through Drizzle.
              </div>
              <Button type="submit" className="w-full min-w-40 sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Paper
              </Button>
            </div>
          </form>
        </Card>

        <Card className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#dff3ef,transparent_38%),linear-gradient(180deg,#173949_0%,#234b5c_100%)] text-white">
          <div className="space-y-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Built for serious reading workflows</h3>
              <p className="text-sm leading-6 text-white/72">
                Track unfinished papers, sort by impact, and keep a reliable archive for lab meetings, literature reviews,
                and thesis work.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <Insight label="Reading stages" value="6 distinct milestones" />
              <Insight label="Persistent storage" value="PostgreSQL + Drizzle ORM" />
              <Insight label="Analytics ready" value="Charts update from saved data" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DatePickerField({
  value,
  onChange,
  hasError
}: {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = value ? parseLocalDate(value) : getTodayLocalDate();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate));

  useEffect(() => {
    setVisibleMonth(startOfMonth(selectedDate));
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border bg-white px-4 py-2 text-left text-sm text-foreground shadow-sm outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20",
          hasError ? "border-rose-300 ring-2 ring-rose-100" : "border-border"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eef4f2] text-primary">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Selected date</p>
            <p className="truncate text-sm font-medium text-foreground">{formatDisplayDate(value)}</p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Pick</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,247,0.96))] p-4 shadow-[0_22px_60px_rgba(16,37,46,0.18)] backdrop-blur sm:left-auto sm:right-0 sm:w-[340px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e1e5] bg-white/80 text-slate-700 transition hover:bg-[#f3f8f6]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Calendar</p>
              <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-foreground">
                {monthLabels[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e1e5] bg-white/80 text-slate-700 transition hover:bg-[#f3f8f6]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2 px-1">
            {weekdayLabels.map((label) => (
              <div key={label} className="py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const isSelected = day.dateString === value;
              const isCurrentMonth = day.date.getMonth() === visibleMonth.getMonth();
              const isToday = day.dateString === toDateInputValue(getTodayLocalDate());

              return (
                <button
                  key={day.dateString}
                  type="button"
                  onClick={() => {
                    onChange(day.dateString);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-2xl text-sm font-medium transition",
                    isSelected
                      ? "bg-primary text-white shadow-soft"
                      : isCurrentMonth
                        ? "text-foreground hover:bg-[#eef5f3]"
                        : "text-slate-400 hover:bg-[#f5f7f6]",
                    isToday && !isSelected ? "border border-primary/25" : "border border-transparent"
                  )}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#e3eaed] pt-4">
            <button
              type="button"
              onClick={() => {
                const today = getTodayLocalDate();
                onChange(toDateInputValue(today));
                setVisibleMonth(startOfMonth(today));
                setIsOpen(false);
              }}
              className="text-sm font-medium text-primary transition hover:text-primary/80"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#d7e1e5] bg-white/80 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[#f3f8f6]"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return {
      date,
      dateString: toDateInputValue(date)
    };
  });
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getTodayLocalDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const date = parseLocalDate(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function getDefaultValues(): FormValues {
  return {
    paperTitle: "",
    firstAuthorName: "",
    researchDomain: researchDomains[0],
    readingStage: readingStages[0],
    citationCount: 0,
    impactScore: impactScores[3],
    dateAdded: toDateInputValue(getTodayLocalDate())
  };
}

function fieldClassName(hasError: boolean) {
  return hasError ? "border-rose-300 ring-2 ring-rose-100 focus:border-rose-400 focus:ring-rose-100" : "";
}

function Field({
  label,
  error,
  children,
  className
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
      <span className={cn("mt-2 block min-h-5 text-sm", error ? "text-rose-600" : "text-transparent")}>{error ?? "."}</span>
    </label>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
