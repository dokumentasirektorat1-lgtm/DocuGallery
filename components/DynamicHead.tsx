"use client"

import { useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import { getDirectLink } from "@/lib/utils"

/**
 * Dynamic Head Component
 * Updates page title and favicon based on app settings
 */
export function DynamicHead() {
    const { appName, appLogo } = useSettings()

    useEffect(() => {
        // Update document title
        if (appName) {
            document.title = appName
        }

        // Update favicon
        if (appLogo) {
            const directLink = getDirectLink(appLogo)

            // Find existing favicon or create new one
            let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement

            if (!favicon) {
                favicon = document.createElement('link')
                favicon.rel = 'icon'
                document.head.appendChild(favicon)
            }

            favicon.href = directLink
        }
    }, [appName, appLogo])

    return null // This component doesn't render anything
}
