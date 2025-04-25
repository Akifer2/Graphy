import { useState } from "react";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectItem
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { ModeToggle } from "./mode-toggle";
import logo_light from "@/assets/logo_light.svg";
import logo_dark from "@/assets/logo_dark.svg";
import { useTheme } from "@/contexts/theme-context";

export default function Header() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState<string>(i18n.language);
    const { theme } = useTheme();

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        i18n.changeLanguage(value);
        localStorage.setItem("language", value);
    };

    return (
        <header className="flex items-center justify-between w-full px-16 py-12 bg-background">
            <div className="flex flex-col gap-2">
                <img
                    className="w-36"
                    src={theme === "light" ? logo_light : logo_dark}
                    alt="Logo"
                />
                <h2 className="text-md font-semibold text-muted-foreground">
                    {t("app.subtitle")}
                </h2>
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
                <ModeToggle />
            </div>
        </header>
    );
}
