"use client"

import { useProjects } from "@/lib/useProjects"
import { extractYearFromDate } from "@/lib/dateUtils"
import { useMemo, useState } from "react"

interface FilterBarProps {
    activeYear: string
    onYearChange: (year: string) => void
}

export function FilterBar({ activeYear, onYearChange }: FilterBarProps) {
    const { projects } = useProjects()
    const [showAllYears, setShowAllYears] = useState(false)

    // Extract unique years and sort descending (newest first)
    const years = useMemo(() => {
        const yearSet = new Set<string>()
        projects.forEach(project => {
            const year = extractYearFromDate(project.date)
            if (year) yearSet.add(year)
        })
        return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a))
    }, [projects])

    // Recent years (last 4 years) for quick access
    const recentYears = years.slice(0, 4)
    const olderYears = years.slice(4)

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button
                onClick={() => onYearChange("All")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeYear === "All"
                    ? "bg-primary/10 text-primary"
                    : "bg-surface hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
            >
                All
            </button>

            {/* Recent 4 years as buttons */}
            {recentYears.map(year => (
                <button
                    key={year}
                    onClick={() => onYearChange(year)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeYear === year
                        ? "bg-primary/10 text-primary"
                        : "bg-surface hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                >
                    {year}
                </button>
            ))}

            {/* Dropdown for older years */}
            {olderYears.length > 0 && (
                <div className="relative">
                    <button
                        onClick={() => setShowAllYears(!showAllYears)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${olderYears.includes(activeYear)
                            ? "bg-primary/10 text-primary"
                            : "bg-surface hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        {olderYears.includes(activeYear) ? activeYear : "Older"}
                        <span className="material-symbols-outlined text-[18px]">
                            {showAllYears ? "expand_less" : "expand_more"}
                        </span>
                    </button>

                    {showAllYears && (
                        <div className="absolute top-full mt-2 left-0 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-[120px] max-h-60 overflow-y-auto">
                            {olderYears.map(year => (
                                <button
                                    key={year}
                                    onClick={() => {
                                        onYearChange(year)
                                        setShowAllYears(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${activeYear === year
                                        ? "text-primary font-medium"
                                        : "text-foreground"
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
