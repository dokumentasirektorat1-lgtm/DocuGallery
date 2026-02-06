"use client"

import { useSettings } from "@/context/SettingsContext"

/**
 * Footer Component with Editable Text from Settings
 * Supports dynamic footer text and auto-updating copyright year
 */
export function Footer() {
    const { footerText } = useSettings()
    const currentYear = new Date().getFullYear()

    // If no custom footer text, use default
    const displayText = footerText || `© ${currentYear} DocuGallery. All rights reserved.`

    return (
        <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {displayText}
                </div>
            </div>
        </footer>
    )
}
