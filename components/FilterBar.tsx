"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function FilterBar({ activeYear, onYearChange }: { activeYear: string, onYearChange: (year: string) => void }) {
    const filters = ["All", "2026", "2025", "2024", "2023"]

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onYearChange(filter)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border",
                            activeYear === filter
                                ? "bg-primary text-white border-primary shadow-lg shadow-cyan-500/25"
                                : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    )
}
