export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
}) {
  return (
    <div className={align === "center" ? "space-y-3 text-center" : "space-y-3"}>
      <div
        className={
          align === "center"
            ? "inline-flex items-center justify-center rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary/75"
            : "inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary/75"
        }
      >
        {eyebrow}
      </div>
      <div className="space-y-2">
        <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p
          className={
            align === "center"
              ? "mx-auto max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base"
              : "max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base"
          }
        >
          {description}
        </p>
      </div>
    </div>
  )
}
