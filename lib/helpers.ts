/**
 * Helper utilities for DocuGallery V11
 */

/**
 * Extract Google Drive folder ID from various Drive URL formats
 * @param url Drive folder URL
 * @returns Folder ID or null if not found
 */
export function extractDriveFolderId(url: string): string | null {
    if (!url) return null

    // Pattern: https://drive.google.com/drive/folders/FOLDER_ID
    const folderMatch = url.match(/folders\/([a-zA-Z0-9_-]+)/)
    if (folderMatch) return folderMatch[1]

    // Pattern: https://drive.google.com/open?id=FOLDER_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openMatch) return openMatch[1]

    return null
}

/**
 * Generate thumbnail URL from Google Drive folder link or file ID
 * Note: For folders, this attempts to access folder content which may not always work
 * For best results, use file IDs directly
 * @param driveLink Full Drive folder URL or file ID
 * @returns Thumbnail URL or empty string
 */
export function generateDriveThumbnail(driveLink: string): string {
    // Extract folder ID if it's a full URL, otherwise use as-is
    const folderId = driveLink.includes('drive.google.com')
        ? extractDriveFolderId(driveLink)
        : driveLink;

    if (!folderId) return "";

    // Multiple thumbnail strategies (choose based on what works best)
    // Strategy 1: Google'susercontent domain (best for files)
    return `https://lh3.googleusercontent.com/d/${folderId}=w400-h300-p-k-no-nu`;

    // Alternative strategies (uncomment to try):
    // return `https://drive.google.com/thumbnail?id=${folderId}&sz=w400`;
    // return `https://drive.google.com/uc?export=view&id=${folderId}`;
}

/**
 * Detect if a URL is a Facebook link
 * @param url URL to check
 * @returns true if Facebook link
 */
export function isFacebookLink(url: string): boolean {
    if (!url) return false
    return url.includes('facebook.com') || url.includes('fb.com') || url.includes('fb.watch')
}

/**
 * Generate internal project link
 * @param projectId Project ID
 * @param origin Window origin (default: window.location.origin)
 * @returns Internal project URL
 */
export function generateInternalLink(projectId: string, origin?: string): string {
    const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : '')
    return `${baseUrl}/project/${projectId}`
}
