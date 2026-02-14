import { GOOGLE_DRIVE_API_KEY, DRIVE_API_BASE, convertToDriveDirectLink } from "./driveConfig"

/**
 * Image file metadata from Drive API
 */
interface DriveImageFile {
    id: string
    name: string
    thumbnailLink?: string
    webContentLink?: string
    imageMediaMetadata?: {
        width?: number
        height?: number
    }
    size?: string // File size in bytes (as string)
}

/**
 * Repair thumbnail URL to ensure HTTPS
 * @param url - The URL to repair
 * @returns The repaired URL
 */
export function repairThumbnail(url: string | undefined): string {
    if (!url) return getPlaceholderThumbnail()

    // SAFEGUARD 1: Meta/Facebook Domain Filter
    // If link contains facebook.com or fbcdn.net, SKIP processing to prevent breaking valid tokens
    if (url.includes('facebook.com') || url.includes('fbcdn.net')) {
        // If it looks like a direct image link (fbcdn or extension), return as is
        if (url.includes('fbcdn.net') || url.includes('scontent') || url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i)) {
            return url
        }

        // If it's just a Facebook Post link (not an image), return Universal Thumbnail (blue gradient)
        // This fixes broken images for post insertions
        return getPlaceholderThumbnail()
    }

    // SAFEGUARD 2: Domain Whitelist
    // Only process Google Drive related domains or relative paths
    // If it's another external domain (e.g. Unsplash, privately hosted), return as is
    const isGoogleDomain = url.includes('drive.google.com') ||
        url.includes('googleusercontent.com')

    if (!isGoogleDomain && url.startsWith('http')) {
        return url
    }

    // TRANSFORM: Fix Google Drive Links to HTTPS
    let repairedUrl = url

    // Fix protocol-relative URLs or plain http
    if (repairedUrl.startsWith('//')) {
        repairedUrl = `https:${repairedUrl}`
    } else if (repairedUrl.startsWith('http://')) {
        repairedUrl = repairedUrl.replace(/^http:\/\//i, 'https://')
    } else if (!repairedUrl.startsWith('https://') && repairedUrl.includes('googleusercontent.com')) {
        // Handle naked domains if necessary
        repairedUrl = `https://${repairedUrl}`
    }

    // SAFEGUARD 3: Prevent re-processing valid Profile/Specific URLs
    // If it matches the specific profile picture pattern and is already HTTPS, leave it matches
    if (repairedUrl.includes('/profile/picture/') && repairedUrl.startsWith('https://')) {
        return repairedUrl
    }

    return repairedUrl
}

/**
 * Get auto-generated thumbnail from Google Drive folder with BEST VISUAL PICKER
 * Intelligently selects the best image based on:
 * 1. Filename keywords (cover, thumb, main, thumbnail)
 * 2. Highest resolution (width x height)
 * 3. Largest file size
 * 
 * @param folderId - Google Drive folder ID
 * @returns Promise<string> - Thumbnail URL or empty string
 */
export async function getAutoThumbnail(folderId: string, apiKey?: string): Promise<string> {
    if (!folderId) return ""

    const driveKey = apiKey || GOOGLE_DRIVE_API_KEY;

    if (!driveKey) {
        console.warn("⚠️ Google Drive API Key is missing. Auto-thumbnail may fail.");
    }

    try {
        // Build API URL to search for ALL images in the folder with metadata
        const query = `'${folderId}' in parents and mimeType contains 'image/'`
        const fields = "files(id,name,thumbnailLink,webContentLink,imageMediaMetadata,size)"
        const apiUrl = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=${fields}&key=${driveKey}&pageSize=50&orderBy=createdTime desc`

        console.log('🔍 Fetching images from Drive API for best visual picker:', folderId)

        const response = await fetch(apiUrl)

        if (!response.ok) {
            console.error('❌ Drive API error:', response.status, response.statusText)
            return getPlaceholderThumbnail()
        }

        const data = await response.json()

        // Check if any images were found
        if (data.files && data.files.length > 0) {
            const images: DriveImageFile[] = data.files

            console.log(`📸 Found ${images.length} images in folder`)

            // BEST VISUAL PICKER LOGIC
            const bestImage = selectImage(images)

            if (bestImage) {
                console.log(`🏆 Best image selected: ${bestImage.name}`)
                return generateThumbnailUrl(bestImage)
            }
        }

        // No images found in folder
        console.log('⚠️ No images found in folder:', folderId)
        // Fallback: Use placeholder
        return getPlaceholderThumbnail()

    } catch (error) {
        console.error('❌ Error fetching auto-thumbnail:', error)
        // Fallback: Use placeholder on error
        return getPlaceholderThumbnail()
    }
}

/**
 * Select the best image from array based on intelligent criteria
 * Priority:
 * 1. Filename contains keywords (cover, thumb, main, thumbnail, hero)
 * 2. Highest resolution
 * 3. Largest file size
 */
function selectImage(images: DriveImageFile[]): DriveImageFile | null {
    if (images.length === 0) return null
    if (images.length === 1) return images[0]

    // Priority 1: Check for keyword matches in filename
    const keywords = ['cover', 'thumb', 'main', 'thumbnail', 'hero', 'feature', 'banner']
    for (const keyword of keywords) {
        const keywordMatch = images.find(img =>
            img.name.toLowerCase().includes(keyword)
        )
        if (keywordMatch) {
            console.log(`✨ Found keyword match: "${keyword}" in ${keywordMatch.name}`)
            return keywordMatch
        }
    }

    // Priority 2: Select by highest resolution (width x height)
    const imagesWithResolution = images.filter(img =>
        img.imageMediaMetadata?.width && img.imageMediaMetadata?.height
    )

    if (imagesWithResolution.length > 0) {
        const highestRes = imagesWithResolution.reduce((best, current) => {
            const bestPixels = (best.imageMediaMetadata?.width || 0) * (best.imageMediaMetadata?.height || 0)
            const currentPixels = (current.imageMediaMetadata?.width || 0) * (current.imageMediaMetadata?.height || 0)

            if (currentPixels > bestPixels) {
                console.log(`🎯 Higher resolution found: ${current.name} (${current.imageMediaMetadata?.width}x${current.imageMediaMetadata?.height})`)
                return current
            }
            return best
        })

        return highestRes
    }

    // Priority 3: Select by largest file size
    const imagesWithSize = images.filter(img => img.size)

    if (imagesWithSize.length > 0) {
        const largest = imagesWithSize.reduce((best, current) => {
            const bestSize = parseInt(best.size || '0')
            const currentSize = parseInt(current.size || '0')

            if (currentSize > bestSize) {
                console.log(`📊 Larger file found: ${current.name} (${formatBytes(currentSize)})`)
                return current
            }
            return best
        })

        return largest
    }

    // Fallback: return first image
    console.log(`🔄 Using first image as fallback: ${images[0].name}`)
    return images[0]
}

/**
 * Generate high-quality thumbnail URL from selected image
 * Uses LH3 direct link format
 */
function generateThumbnailUrl(image: DriveImageFile): string {
    // Priority 1: Use direct LH3 link with ID
    console.log('📌 Using LH3 direct link')
    return `https://lh3.googleusercontent.com/d/${image.id}`
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get placeholder thumbnail when no image is available
 * @returns Default placeholder image URL
 */
export function getPlaceholderThumbnail(): string {
    // Use a professional placeholder from Unsplash
    return "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop"
}

/**
 * Synchronous thumbnail generation (fallback)
 * Uses placeholder for folder IDs to avoid broken LH3 links
 * 
 * @param folderId - Google Drive folder ID
 * @returns Thumbnail URL
 */
export function getQuickThumbnail(folderId: string): string {
    return getPlaceholderThumbnail()
}

/**
 * Validate if Drive folder ID is valid format
 * @param folderId - Folder ID to validate
 * @returns boolean
 */
export function isValidDriveFolderId(folderId: string): boolean {
    // Drive IDs are typically 33 characters alphanumeric with hyphens/underscores
    return /^[a-zA-Z0-9_-]{20,50}$/.test(folderId)
}
