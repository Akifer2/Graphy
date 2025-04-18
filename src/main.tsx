import React from "react"
import ReactDOM from "react-dom/client"
import App from "@/App"
import { ThemeProvider } from "@/contexts/theme-context"
import "@/lib/i18n"
import "@/styles/global.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
