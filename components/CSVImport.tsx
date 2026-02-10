"use client"

import { useState, useRef } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { extractDriveFolderId, generateDriveThumbnail, isFacebookLink } from "@/lib/helpers"
import { showSuccess, showError, showLoading, closeSwal } from "@/lib/sweetalert"
import { useSettings } from "@/context/SettingsContext"
import { getAutoThumbnail } from "@/lib/autoThumbnail"

interface CSVImportProps {
    onComplete: () => void
}

export function CSVImport({ onComplete }: CSVImportProps) {
    const { googleDriveApiKey } = useSettings()

    const [isOpen, setIsOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const parseCSV = (text: string): any[] => {
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length === 0) return []

        const headers = lines[0].split(',').map(h => h.trim())
        const data = []

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            const row: any = {}
            headers.forEach((header, index) => {
                row[header] = values[index] || ''
            })
            data.push(row)
        }

        return data
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsProcessing(true)
        setProgress("Reading file...")

        try {
            const text = await file.text()
            const rows = parseCSV(text)

            if (rows.length === 0) {
                throw new Error("No data found in CSV")
            }

            showLoading(`Importing ${rows.length} projects...`)

            // Use addDoc for appending (NOT batch.set which could overwrite)
            const projectsRef = collection(db, "projects")
            let successCount = 0

            // Import getAutoThumbnail
            // const { getAutoThumbnail } = await import("@/lib/autoThumbnail")

            for (const [index, row] of rows.entries()) {
                setProgress(`Processing ${index + 1}/${rows.length}...`)

                // Map CSV columns to project fields
                const driveLink = row["Link Dokumentasi"] || row["Drive Link"] || ""
                let thumbnailUrl = row["Thumbnail"] || row["thumbnailUrl"] || ""

                // Detect content type
                const contentType = isFacebookLink(driveLink) ? "facebook" : "drive"

                // Extract folder ID for Drive links
                let driveFolderId = driveLink
                if (contentType === "drive") {
                    const extractedId = extractDriveFolderId(driveLink)
                    driveFolderId = extractedId || driveLink
                }

                // Auto-generate thumbnail if empty and it's a Drive link
                if (!thumbnailUrl && driveFolderId && contentType === "drive") {
                    console.log(`🔄 [CSV Row ${index + 1}] Fetching auto-thumbnail for: ${driveFolderId}`)
                    try {
                        thumbnailUrl = await getAutoThumbnail(driveFolderId, googleDriveApiKey)
                        console.log(`✅ [CSV Row ${index + 1}] Got thumbnail: ${thumbnailUrl}`)
                    } catch (error) {
                        console.error(`❌ [CSV Row ${index + 1}] Failed to fetch auto-thumbnail:`, error)
                        // Fallback to simple generator
                        thumbnailUrl = generateDriveThumbnail(driveLink)
                    }
                }

                const project = {
                    title: row["Nama Kegiatan"] || row["Title"] || `Project ${index + 1}`,
                    date: row["Tanggal Pelaksanaan"] || row["Date"] || new Date().toISOString().split('T')[0],
                    location: row["Tempat Pelaksanaan"] || row["Location"] || "Unknown",
                    driveFolderId,
                    category: (row["Category"] as any) || "Event" as const,
                    thumbnailUrl,
                    isPrivate: row["Private"]?.toLowerCase() === "true" || false,
                    status: "Synced" as const,
                    contentType,
                }

                // Use addDoc to append (not overwrite)
                await addDoc(projectsRef, project)
                successCount++
            }

            closeSwal()
            await showSuccess(`Successfully imported ${successCount} projects!`, 'Import Complete')

            setIsOpen(false)
            setIsProcessing(false)
            setProgress("")
            onComplete()
            if (fileInputRef.current) fileInputRef.current.value = ""

        } catch (error) {
            closeSwal()
            console.error("CSV Import Error:", error)
            await showError(
                error instanceof Error ? error.message : "Failed to import CSV",
                'Import Failed'
            )
            setIsProcessing(false)
            setProgress("")
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-500/25"
            >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                Import CSV
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Import Projects from CSV</h2>
                            <button
                                onClick={() => !isProcessing && setIsOpen(false)}
                                disabled={isProcessing}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">CSV Format:</p>
                                <code className="text-xs text-blue-800 dark:text-blue-300 block">
                                    Nama Kegiatan, Tanggal Pelaksanaan, Tempat Pelaksanaan, Link Dokumentasi, Thumbnail (Optional)
                                </code>
                                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                                    💡 Thumbnails are auto-generated from Drive links if not provided
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    disabled={isProcessing}
                                    className="hidden"
                                    id="csv-upload"
                                />
                                <label
                                    htmlFor="csv-upload"
                                    className={`cursor-pointer flex flex-col items-center gap-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-[48px] text-primary">cloud_upload</span>
                                    <div>
                                        <p className="font-medium text-foreground">Click to upload CSV file</p>
                                        <p className="text-sm text-gray-500">or drag and drop</p>
                                    </div>
                                </label>
                            </div>

                            {progress && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-sm text-foreground">{progress}</p>
                                </div>
                            )}
                        </div>

                        {!isProcessing && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
