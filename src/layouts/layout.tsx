import type { ReactNode } from "react"
import Header from "../components/header"

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto p-4">{children}</main>
        </div>
    )
}
