"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                className
            )}
            aria-label="Toggle theme"
        >
            <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-300">
                {mounted && theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
        </button>
    )
}
