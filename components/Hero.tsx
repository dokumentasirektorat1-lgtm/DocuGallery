"use client"

import { useSettings } from "@/context/SettingsContext"

export function Hero() {
    const { heroHeadline, heroSubline } = useSettings();

    return (
        <div className="py-20 md:py-32 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto">
                {heroHeadline}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                {heroSubline}
            </p>
        </div>
    )
}
