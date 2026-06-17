import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ToastProvider } from "@/shared/components/ui/toast"
import { AuthProvider } from "@/features/auth/lib/auth-context"
import "./styles.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
)
