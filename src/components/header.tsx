import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import i18n from "@/lib/i18n"
import { ModeToggle } from "./mode-toggle"
import Logo from "@/assets/Logo.svg"

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
                <img className="w-36" src={Logo} alt="Logo" />
                <h2 className="text-md font-semibold text-muted-foreground">{t("app.subtitle")}</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[140px] cursor-pointer">
                        <SelectValue placeholder={t("app.language")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt" className="cursor-pointer">Português</SelectItem>
                        <SelectItem value="en" className="cursor-pointer">English</SelectItem>
                        <SelectItem value="es" className="cursor-pointer">Español</SelectItem>
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
