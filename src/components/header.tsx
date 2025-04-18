import { useState } from "react"
import { LineChartIcon } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import i18n from "@/lib/i18n"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
    const { t } = useTranslation()
    const [language, setLanguage] = useState<string>(i18n.language)

    const handleLanguageChange = (value: string) => {
        setLanguage(value)
        i18n.changeLanguage(value)
        localStorage.setItem("language", value)
    }

    return (
        <div className="flex items-center justify-between w-full px-12 py-6 bg-background">
            <div className="flex flex-col">
                <h1 className="flex items-baseline font-bold text-4xl text-primary">
                    {t("app.title")}
                    <LineChartIcon className="ml-2 text-primary-600" />
                </h1>
                <h2 className="text-md font-semibold text-muted-foreground mt-2">{t("app.subtitle")}</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={t("app.language")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                </Select>

                {/* Theme Mode Toggle */}
                <div className="flex items-center gap-2">
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
}
