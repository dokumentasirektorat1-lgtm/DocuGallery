import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertDriveToThumbnail(link: string): string {
  if (!link) return "";

  // Check if it's a google drive file link
  // Standard view link: https://drive.google.com/file/d/ITEM_ID/view?usp=sharing
  // We want: https://lh3.googleusercontent.com/u/0/d/ITEM_ID

  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = link.match(driveRegex);

  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
  }

  // Return original if no match (assumes it's a direct link or valid URL)
  return link;
}

export function getDirectLink(url: string): string {
  if (!url) return "";

  // Check if it's a Google Drive file link
  // Pattern: https://drive.google.com/file/d/ID_FILE/view...
  // Convert to: https://drive.google.com/uc?export=view&id=ID_FILE

  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);

  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  // Return original if not a Drive link
  return url;
}
