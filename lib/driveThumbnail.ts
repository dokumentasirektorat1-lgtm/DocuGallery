/**
 * Auto-Thumbnail Generator for Google Drive Folders
 * Uses multiple fallback strategies to get the best thumbnail
 */

/**
 * Fetch the best thumbnail for a Google Drive folder
 * @param folderId - Google Drive folder ID
 * @returns Promise<string> - Thumbnail URL
 */
export async function fetchDriveThumbnail(folderId: string): Promise<string> {
    // Strategy 1: Try Drive thumbnail endpoint (most reliable)
    const standardThumbnail = `https://drive.google.com/thumbnail?id=${folderId}&sz=w500`

    // Strategy 2: Proxy fallback  
    const proxyThumbnail = `https://thumbnail-v2.simple-api.com/drive/${folderId}`

    try {
        // Test if standard thumbnail works
        const response = await fetch(standardThumbnail, { method: 'HEAD' })
        if (response.ok) {
            return standardThumbnail
        }
    } catch (error) {
        console.log('Standard thumbnail failed, using proxy')
    }

    // Return proxy as fallback
    return proxyThumbnail
}

/**
 * Generate thumbnail URL synchronously (for immediate use)
 * @param folderId - Google Drive folder ID
 * @returns Thumbnail URL
 */
export function generateQuickThumbnail(folderId: string): string {
    return `https://drive.google.com/thumbnail?id=${folderId}&sz=w500`
}

/**
 * Check if a URL returns a valid image
 * @param url - Image URL to test
 * @returns Promise<boolean>
 */
export async function isValidImageUrl(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' })
        const contentType = response.headers.get('content-type')
        return response.ok && contentType?.startsWith('image/') || false
    } catch {
        return false
    }
}
