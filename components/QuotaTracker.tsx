"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot, writeBatch, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MediaFolder } from "@/lib/data"
import { showSuccess, showInfo, showConfirm, showError } from "@/lib/sweetalert"

interface QuotaTrackerProps {
    projects: MediaFolder[]
}

export function QuotaTracker({ projects }: QuotaTrackerProps) {
    const [usage, setUsage] = useState({ count: 0, limit: 20000 })
    const [loading, setLoading] = useState(false)

    // Real-time listener for API usage
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "settings", "api_usage"), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setUsage({
                    count: data.daily_requests || 0,
                    limit: data.limit || 20000
                })
            } else {
                // Default if no settings doc
                setUsage({ count: 0, limit: 20000 })
            }
        })
        return () => unsub()
    }, [])

    const percentage = Math.min(100, Math.round((usage.count / usage.limit) * 100))

    // Determine color based on usage thresholds
    let colorClass = "bg-green-500"
    if (percentage >= 95) colorClass = "bg-red-500"
    else if (percentage >= 80) colorClass = "bg-yellow-500"

    const handleFixThumbnails = async () => {
        const confirmed = await showConfirm(
            "Optimalkan Semua Thumbnail?",
            "Tindakan ini akan mengupdate link thumbnail semua proyek ke format hemat kuota (LH3 Direct Link). Semua link Google Drive lama akan dikonversi.",
            "Ya, Optimalkan",
            "Batal"
        )
        if (!confirmed) return

        setLoading(true)
        try {
            const batch = writeBatch(db)
            let fixCount = 0

            // Regex to extract ID from various Google Drive link formats
            // Matches: /file/d/ID, ?id=ID, /thumbnail?id=ID, /d/ID
            const driveRegex = /(?:file\/d\/|id=|d\/)([-\w]+)/;

            // Import helper dynamically or use string directly if needed, but better to import
            const { getPlaceholderThumbnail } = await import("@/lib/autoThumbnail")
            const placeholderUrl = getPlaceholderThumbnail()

            // Iterate all projects and queue updates
            projects.forEach(p => {
                // REPAIR LOGIC: Fix corrupted Facebook thumbnails
                if (p.contentType === "facebook") {
                    const currentUrl = p.thumbnailUrl || "";

                    // Specific fix for items corrupted by previous "Fix All" (converted to Google/LH3)
                    // OR if empty
                    if (currentUrl.includes("google") || currentUrl.includes("lh3") || !currentUrl) {
                        const ref = doc(db, "projects", p.id)
                        batch.update(ref, {
                            thumbnailUrl: placeholderUrl,
                            updatedAt: serverTimestamp()
                        })
                        fixCount++
                    }
                    return; // SAFEGUARD: Stop processing Facebook items
                }

                // SKIP if no thumbnail
                if (!p.thumbnailUrl) return;

                // EXTRA SAFEGUARD: Skip any URL containing facebook
                if (p.thumbnailUrl.includes("facebook.com") || p.thumbnailUrl.includes("fbcdn.net")) {
                    return;
                }

                const match = p.thumbnailUrl.match(driveRegex);

                if (match && match[1]) {
                    const fileId = match[1];

                    // VALIDATION 1: Skip if ID matches the Project's main Folder ID
                    // (This prevents converting the folder icon to a broken file link)
                    if (fileId === p.driveFolderId) {
                        // console.warn(`Skipping ${p.title}: ID matches folder ID.`);
                        return;
                    }

                    // VALIDATION 2: Skip if original URL explicitly mentions 'folders'
                    if (p.thumbnailUrl.includes("/folders/")) {
                        // console.warn(`Skipping ${p.title}: URL is a folder link.`);
                        return;
                    }

                    const newUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

                    // Update if URL is different
                    if (p.thumbnailUrl !== newUrl) {
                        const ref = doc(db, "projects", p.id)
                        batch.update(ref, {
                            thumbnailUrl: newUrl,
                            updatedAt: serverTimestamp()
                        })
                        fixCount++
                    }
                }
            })

            console.log(`Fixing ${fixCount} thumbnails...`)

            if (fixCount > 0) {
                await batch.commit()
                await showSuccess(`Berhasil memperbaiki ${fixCount} item (Facebook/Drive).`, "Sukses")
            } else {
                await showInfo("Semua thumbnail sudah aman/optimal.", "Sudah OK")
            }
        } catch (error: any) {
            console.error("Fix Thumbnails Error:", error)
            await showError("Gagal memperbarui thumbnail: " + error.message, "Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-surface border border-border rounded-xl p-5 shadow-sm mb-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${percentage >= 90 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <span className="material-symbols-outlined text-[20px]">api</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">API Quota Tracker</h3>
                        <p className="text-xs text-gray-500">Google Drive API Requests</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${percentage >= 95 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        percentage >= 80 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {percentage}% Used
                    </span>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
                <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${colorClass} ${loading ? 'animate-pulse opacity-70' : ''}`}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{usage.count.toLocaleString()} / {usage.limit.toLocaleString()} requests</span>

                <button
                    onClick={handleFixThumbnails}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Convert all thumbnails to persistent URL format to save quota"
                >
                    <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
                        {loading ? 'sync' : 'auto_fix_high'}
                    </span>
                    {loading ? 'Optimizing...' : 'Fix All Thumbnails'}
                </button>
            </div>
        </div>
    )
}
