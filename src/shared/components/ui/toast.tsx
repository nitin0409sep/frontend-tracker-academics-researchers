import { CheckCircle2, X, AlertCircle } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react"
import { cn } from "@/shared/lib/utils"

type ToastVariant = "success" | "error"

type ToastItem = {
  id: number
  title: string
  message?: string
  variant: ToastVariant
}

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<number, number>>(new Map())

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const pushToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((current) => [...current, { ...toast, id }])
      const timer = window.setTimeout(() => removeToast(id), 3200)
      timersRef.current.set(id, timer)
    },
    [removeToast]
  )

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current.clear()
    }
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:justify-end sm:px-6">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const Icon = toast.variant === "success" ? CheckCircle2 : AlertCircle

  return (
    <div
      className={cn(
        "pointer-events-auto rounded-[24px] border px-4 py-4 shadow-[0_18px_45px_rgba(15,32,41,0.16)] backdrop-blur",
        toast.variant === "success"
          ? "border-emerald-200 bg-white/95"
          : "border-rose-200 bg-white/95"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
            toast.variant === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
