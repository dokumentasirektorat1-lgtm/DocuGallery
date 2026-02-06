"use client"

import { useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import { getDirectLink } from "@/lib/utils"

/**
 * DynamicBranding component dynamically updates favicon and browser title
 * based on settings from Firestore
 */
export function DynamicBranding() {
    const { appLogo, browserTitle } = useSettings()

    // Update document title
    useEffect(() => {
        if (browserTitle) {
            document.title = browserTitle
        }
    }, [browserTitle])

    // Update favicon - use Web Logo
    useEffect(() => {
        if (appLogo) {
            // Convert Drive URLs to direct links (same as Navbar)
            const directUrl = getDirectLink(appLogo)

            // Remove existing favicon (with null safety)
            const existingFavicon = document.querySelector("link[rel='icon']")
            if (existingFavicon && existingFavicon.parentNode) {
                existingFavicon.parentNode.removeChild(existingFavicon)
            }

            // Create and append new favicon
            const newFavicon = document.createElement("link")
            newFavicon.rel = "icon"
            newFavicon.href = directUrl
            document.head.appendChild(newFavicon)
        }
    }, [appLogo])

    return null // This component doesn't render anything
}
