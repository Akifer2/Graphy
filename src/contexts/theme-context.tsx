import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null
        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme)
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark")
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            const root = document.documentElement
            root.classList.remove(theme === "dark" ? "light" : "dark")
            root.classList.add(theme)
            localStorage.setItem("theme", theme)
        }
    }, [theme, mounted])

    const value = {
        theme,
        setTheme,
    }

    // Only render children once mounted to avoid hydration mismatch
    return <ThemeContext.Provider value={value}>{mounted ? children : null}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
