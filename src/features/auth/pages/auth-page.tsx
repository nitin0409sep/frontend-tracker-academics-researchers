import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ShieldCheck } from "lucide-react"
import { useAuth } from "@/features/auth/lib/auth-context"
import { useToast } from "@/shared/components/ui/toast"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[0-9]/, "Include a number")
    .regex(/[^A-Za-z0-9]/, "Include a special character")
})

const loginSchema = signupSchema.omit({ fullName: true })

type SignupValues = z.infer<typeof signupSchema>
type LoginValues = z.infer<typeof loginSchema>

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup")
  const { login, signup } = useAuth()
  const { pushToast } = useToast()

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: { fullName: "", email: "", password: "" }
  })

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" }
  })

  const isSignup = mode === "signup"

  function switchMode(nextMode: "login" | "signup") {
    if (nextMode === mode) {
      return
    }

    signupForm.reset()
    loginForm.reset()
    setMode(nextMode)
  }

  async function handleSignup(values: SignupValues) {
    try {
      await signup(values)
      pushToast({
        variant: "success",
        title: "Account created",
        message: "Your secure workspace is ready."
      })
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Sign up failed",
        message: error instanceof Error ? error.message : "Unable to create account."
      })
    }
  }

  async function handleLogin(values: LoginValues) {
    try {
      await login(values)
      pushToast({
        variant: "success",
        title: "Signed in",
        message: "Welcome back to your paper tracker."
      })
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Sign in failed",
        message: error instanceof Error ? error.message : "Unable to sign in."
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(182,219,212,0.85),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(234,214,180,0.55),transparent_24%),linear-gradient(135deg,#f7f5ef_0%,#eef5f3_100%)] p-8">
          <div className="space-y-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <p className="inline-flex rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">
                Secure Access
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
                Protected research workspace
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Sign in to access your personal paper library, analytics, and protected create-paper
                workflow.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="mb-6 flex gap-2 rounded-full border border-[#dce4e7] bg-[#f6faf8] p-1">
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition",
                isSignup ? "bg-primary text-white" : "text-slate-600"
              )}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition",
                !isSignup ? "bg-primary text-white" : "text-slate-600"
              )}
            >
              Sign in
            </button>
          </div>

          {isSignup ? (
            <form className="space-y-4" onSubmit={signupForm.handleSubmit(handleSignup)} noValidate>
              <Field label="Full Name" error={signupForm.formState.errors.fullName?.message}>
                <Input
                  {...signupForm.register("fullName")}
                  className={fieldClassName(Boolean(signupForm.formState.errors.fullName))}
                />
              </Field>
              <Field label="Email" error={signupForm.formState.errors.email?.message}>
                <Input
                  type="email"
                  {...signupForm.register("email")}
                  className={fieldClassName(Boolean(signupForm.formState.errors.email))}
                />
              </Field>
              <Field label="Password" error={signupForm.formState.errors.password?.message}>
                <Input
                  type="password"
                  {...signupForm.register("password")}
                  className={fieldClassName(Boolean(signupForm.formState.errors.password))}
                />
              </Field>
              <Button type="submit" className="w-full" loading={signupForm.formState.isSubmitting}>
                Create secure account
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
              <Field label="Email" error={loginForm.formState.errors.email?.message}>
                <Input
                  type="email"
                  {...loginForm.register("email")}
                  className={fieldClassName(Boolean(loginForm.formState.errors.email))}
                />
              </Field>
              <Field label="Password" error={loginForm.formState.errors.password?.message}>
                <Input
                  type="password"
                  {...loginForm.register("password")}
                  className={fieldClassName(Boolean(loginForm.formState.errors.password))}
                />
              </Field>
              <Button type="submit" className="w-full" loading={loginForm.formState.isSubmitting}>
                Sign in
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
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

function fieldClassName(hasError: boolean) {
  return hasError
    ? "border-rose-300 ring-2 ring-rose-100 focus:border-rose-400 focus:ring-rose-100"
    : ""
}
