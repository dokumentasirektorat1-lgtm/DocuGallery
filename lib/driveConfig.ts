/**
 * Google Drive API Configuration
 * Used for auto-thumbnail generation from Drive folders
 */

// Google Drive API Key from environment variable
export const GOOGLE_DRIVE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || ""

// API Endpoints
export const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3"

/**
 * Convert Google Drive sharing link to direct download/view link
 * @param driveLink - Google Drive file link
 * @returns Direct link for embedding
 */
export function convertToDriveDirectLink(driveLink: string): string {
    // Extract file ID from various Drive URL formats
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /id=([a-zA-Z0-9_-]+)/,
        /^([a-zA-Z0-9_-]+)$/
    ]

    for (const pattern of patterns) {
        const match = driveLink.match(pattern)
        if (match) {
            const fileId = match[1]
            // Use googleusercontent for better reliability
            return `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-p-k-no-nu`
        }
    }

    return driveLink
}

/**
 * Format Favicon URL - Convert Drive preview links to direct usable links
 * CRITICAL: Fixes Drive /view links that don't work as favicons
 * 
 * @param url - Original favicon URL (may be Drive preview link)
 * @returns Direct usable URL for browser favicon
 */
export function formatFaviconUrl(url: string): string {
    if (!url) return ""

    // Check if it's a Google Drive link
    if (url.includes("drive.google.com")) {
        // Extract file ID from various formats
        const patterns = [
            /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/ID/view
            /\/d\/([a-zA-Z0-9_-]+)/,                 // /d/ID
            /id=([a-zA-Z0-9_-]+)/,                    // ?id=ID
            /\/open\?id=([a-zA-Z0-9_-]+)/,           // /open?id=ID
            /^([a-zA-Z0-9_-]{25,})$/                 // Just ID (33+ chars)
        ]

        for (const pattern of patterns) {
            const match = url.match(pattern)
            if (match) {
                const fileId = match[1]
                // Convert to direct download link - works for favicon
                return `https://drive.google.com/uc?export=view&id=${fileId}`
            }
        }
    }

    // If not Drive link or already in correct format, return as-is
    return url
}
