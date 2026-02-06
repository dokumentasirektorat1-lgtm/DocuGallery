/**
 * Date utilities for robust date parsing and year extraction
 */

/**
 * Extract year from various date formats
 * Supports: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YY, MM/DD/YYYY, and more
 * @param dateString - Date string in various formats
 * @returns Extracted 4-digit year or empty string if unparseable
 */
export function extractYearFromDate(dateString: string): string {
    if (!dateString) return ""

    // Try to parse as standard date first
    const parsed = new Date(dateString)
    if (!isNaN(parsed.getTime())) {
        return parsed.getFullYear().toString()
    }

    // Try common formats with regex
    // Format: YYYY-MM-DD or YYYY/MM/DD
    const yearFirstMatch = dateString.match(/^(\d{4})[-\/]/)
    if (yearFirstMatch) {
        return yearFirstMatch[1]
    }

    // Format: DD/MM/YYYY or DD-MM-YYYY
    const dayFirstMatch = dateString.match(/^\d{1,2}[-\/](\d{1,2})[-\/](\d{4})/)
    if (dayFirstMatch) {
        return dayFirstMatch[2]
    }

    // Format: MM/DD/YYYY or MM-DD-YYYY
    const monthFirstMatch = dateString.match(/^\d{1,2}[-\/]\d{1,2}[-\/](\d{4})/)
    if (monthFirstMatch) {
        return monthFirstMatch[1]
    }

    // Extract any 4-digit year found in the string
    const anyYearMatch = dateString.match(/\b(20\d{2}|19\d{2})\b/)
    if (anyYearMatch) {
        return anyYearMatch[1]
    }

    // Format: DD/MM/YY or DD-MM-YY (2-digit year)
    const twoDigitYearMatch = dateString.match(/^\d{1,2}[-\/]\d{1,2}[-\/](\d{2})$/)
    if (twoDigitYearMatch) {
        const year = parseInt(twoDigitYearMatch[1])
        // Assume 20xx for years 00-49, 19xx for 50-99
        return year < 50 ? `20${year}` : `19${year}`
    }

    return ""
}
