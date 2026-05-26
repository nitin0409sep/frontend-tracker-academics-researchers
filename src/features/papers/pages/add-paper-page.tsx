import { forwardRef, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarDays, CheckCircle2 } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { createPaper } from "@/shared/lib/api"
import { impactScores, readingStages, researchDomains } from "@/shared/lib/constants"
import { SectionHeading } from "@/shared/components/section-heading"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/toast"
import { cn } from "@/shared/lib/utils"

const schema = z.object({
  paperTitle: z.string().trim().min(1, "Paper title is required"),
  firstAuthorName: z.string().trim().min(1, "First author name is required"),
  researchDomain: z.enum(researchDomains, { message: "Research domain is required" }),
  readingStage: z.enum(readingStages, { message: "Reading stage is required" }),
  citationCount: z.coerce.number().int().min(0, "Citation count must be 0 or greater"),
  impactScore: z.enum(impactScores, { message: "Impact score is required" }),
  dateAdded: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date added is required")
})

type FormValues = z.infer<typeof schema>

export function AddPaperPage() {
  const { pushToast } = useToast()
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
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createPaper(values)
      pushToast({
        variant: "success",
        title: "Paper saved",
        message: "The paper has been added to your library successfully."
      })
      reset(getDefaultValues())
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Unable to save paper",
        message:
          error instanceof Error ? error.message : "Something went wrong while saving the paper."
      })
    }
  })

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
              <Controller
                control={control}
                name="researchDomain"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={Boolean(errors.researchDomain)}
                      className={fieldClassName(Boolean(errors.researchDomain))}
                    >
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchDomains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label="Reading Stage" error={errors.readingStage?.message}>
              <Controller
                control={control}
                name="readingStage"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={Boolean(errors.readingStage)}
                      className={fieldClassName(Boolean(errors.readingStage))}
                    >
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {readingStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label="Impact Score" error={errors.impactScore?.message}>
              <Controller
                control={control}
                name="impactScore"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={Boolean(errors.impactScore)}
                      className={fieldClassName(Boolean(errors.impactScore))}
                    >
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      {impactScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
                All fields are validated with React Hook Form and persisted to PostgreSQL through
                Drizzle.
              </div>
              <Button type="submit" className="w-full min-w-40 sm:w-auto" loading={isSubmitting}>
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
                Track unfinished papers, sort by impact, and keep a reliable archive for lab
                meetings, literature reviews, and thesis work.
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
  )
}

function DatePickerField({
  value,
  onChange,
  hasError
}: {
  value: string
  onChange: (value: string) => void
  hasError: boolean
}) {
  return (
    <DatePicker
      selected={parseLocalDate(value)}
      onChange={(date) => {
        if (date) {
          onChange(toDateInputValue(date))
        }
      }}
      dateFormat="yyyy-MM-dd"
      calendarClassName="research-datepicker"
      popperClassName="research-datepicker-popper"
      wrapperClassName="block w-full"
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled
      }) => (
        <div className="research-datepicker-header">
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="research-datepicker-nav"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>
          <div className="research-datepicker-heading">
            <span className="research-datepicker-eyebrow">Calendar</span>
            <span className="research-datepicker-title">{formatMonthYear(date)}</span>
          </div>
          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="research-datepicker-nav"
          >
            <span aria-hidden="true">&#8250;</span>
          </button>
        </div>
      )}
      dayClassName={(date) =>
        cn(
          "research-datepicker-day",
          isSameDay(date, parseLocalDate(value)) && "is-selected",
          isSameDay(date, getTodayLocalDate()) &&
            !isSameDay(date, parseLocalDate(value)) &&
            "is-today",
          date.getMonth() !== parseLocalDate(value).getMonth() && "is-outside"
        )
      }
      customInput={<DatePickerTrigger hasError={hasError} value={value} />}
    />
  )
}

const DatePickerTrigger = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; hasError: boolean }
>(({ value = "", onClick, hasError }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={cn(
      "group flex h-14 w-full items-center justify-between rounded-[22px] border bg-[linear-gradient(180deg,#ffffff,rgba(247,250,249,0.98))] px-4 py-3 text-left shadow-[0_10px_26px_rgba(23,52,64,0.08)] outline-none transition hover:border-primary/35 hover:shadow-[0_14px_30px_rgba(23,52,64,0.12)] focus:border-primary focus:ring-2 focus:ring-primary/15",
      hasError ? "border-rose-300 ring-2 ring-rose-100" : "border-[#d8e1e3]"
    )}
  >
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#edf5f3] text-primary transition group-hover:bg-[#e4efeb]">
        <CalendarDays className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Date
        </p>
        <p className="mt-0.5 truncate text-[15px] font-semibold tracking-[-0.02em] text-foreground">
          {formatDisplayDate(value)}
        </p>
      </div>
    </div>
    <span className="rounded-full border border-[#d9e3e5] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition group-hover:border-primary/20 group-hover:text-primary">
      Pick
    </span>
  </button>
))

DatePickerTrigger.displayName = "DatePickerTrigger"

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function getTodayLocalDate() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatMonthYear(date: Date) {
  return `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`
}

function formatDisplayDate(value: string) {
  const date = parseLocalDate(value)
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date)
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
  }
}

function fieldClassName(hasError: boolean) {
  return hasError
    ? "border-rose-300 ring-2 ring-rose-100 focus:border-rose-400 focus:ring-rose-100"
    : ""
}

function Field({
  label,
  error,
  children,
  className
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
      <span
        className={cn("mt-2 block min-h-5 text-sm", error ? "text-rose-600" : "text-transparent")}
      >
        {error ?? "."}
      </span>
    </label>
  )
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  )
}
