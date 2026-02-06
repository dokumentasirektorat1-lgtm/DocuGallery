"use client"

import { useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import { formatFaviconUrl } from "@/lib/driveConfig"

// Default favicon - UPDATED by user request
const DEFAULT_FAVICON = "https://ilkom.fish.univetbantara.ac.id/wp-content/uploads/2026/01/LOGO-UNIVET-FLAT-scaled-1-1024x996.webp"

/**
 * Dynamic Head Component
 * Updates page title and favicon based on app settings
 * CRITICAL: Auto-converts Drive preview links to direct usable links
 */
export function DynamicHead() {
    const { appName, appLogo } = useSettings()

    useEffect(() => {
        // Update document title in real-time
        if (appName) {
            document.title = appName
            console.log('📄 Page title updated:', appName)
        }

        // Update favicon with auto-conversion for Drive links
        // Use settings favicon if available, otherwise use default
        const faviconSource = appLogo || DEFAULT_FAVICON
        const usableFaviconUrl = formatFaviconUrl(faviconSource)

        // Find existing favicon or create new one
        let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement

        if (!favicon) {
            favicon = document.createElement('link')
            favicon.rel = 'icon'
            favicon.type = 'image/x-icon'
            document.head.appendChild(favicon)
        }

        // Set the formatted URL
        favicon.href = usableFaviconUrl
        console.log('🎨 Favicon updated:', usableFaviconUrl)
    }, [appName, appLogo]) // Real-time update on settings change

    return null // This component doesn't render anything
}
