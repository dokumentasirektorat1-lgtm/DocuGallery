/**
 * Improved Drive thumbnail generation with multiple fallback strategies
 */

import { MediaFolder } from "./data";

/**
 * Extract Google Drive file/folder ID from various URL formats
 */
function extractDriveId(url: string): string | null {
    if (!url) return null;

    // Pattern 1: /file/d/FILE_ID
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];

    // Pattern 2: /folders/FOLDER_ID
    const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) return folderMatch[1];

    // Pattern 3: /open?id=ID or &id=ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];

    // Pattern 4: /d/ID (shortened format)
    const shortMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];

    return null;
}

/**
 * Generate thumbnail URL from Drive ID with multiple size options
 */
export function generateDriveThumbnail(driveIdOrUrl: string, size: number = 500): string {
    const driveId = extractDriveId(driveIdOrUrl) || driveIdOrUrl;

    if (!driveId) return "";

    // Try multiple thumbnail endpoints for better success rate
    // Primary: Google Drive thumbnail API
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${size}`;

    // Alternatives that could be used as fallbacks:
    // return `https://lh3.googleusercontent.com/d/${driveId}=w${size}`;
    // return `https://drive.google.com/uc?export=view&id=${driveId}`;
}

/**
 * Generate auto-thumbnail for a project if it doesn't have one
 * @param project - Media folder project
 * @returns Generated thumbnail URL or empty string
 */
export function generateAutoThumbnail(project: MediaFolder): string {
    // If already has thumbnail, return it
    if (project.thumbnailUrl) {
        return project.thumbnailUrl;
    }

    // For Drive content, generate thumbnail from folder ID
    if (project.contentType === "drive" && project.driveFolderId) {
        return generateDriveThumbnail(project.driveFolderId, 400);
    }

    // For Facebook content, return empty (will show Facebook icon as fallback)
    if (project.contentType === "facebook") {
        return "";
    }

    // No automatic thumbnail available
    return "";
}

/**
 * Check if a project needs auto-thumbnail generation
 */
export function needsAutoThumbnail(project: MediaFolder): boolean {
    return !project.thumbnailUrl && project.contentType === "drive" && !!project.driveFolderId;
}
