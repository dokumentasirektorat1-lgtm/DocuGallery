"use client"

import { useState, useRef } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { showSuccess, showError, showLoading, closeSwal } from "@/lib/sweetalert"
import * as XLSX from 'xlsx'

interface DataImportProps {
    onComplete?: () => void
}

function parseExcelDate(input: any): string {
    if (!input) return new Date().toISOString().split('T')[0]

    // Handle Excel Serial Date
    const serial = Number(input)
    // Check if likely a serial date (between year 1950 and 2050 approx: 18264 - 54789)
    // Also ensure it's not a string like "2023-01-01" which converts to NaN or Year 2023 (serial 2023 is year 1905)
    if (!isNaN(serial) && serial > 18000 && serial < 60000 && !String(input).includes("-") && !String(input).includes("/")) {
        const excelEpoch = new Date(1899, 11, 30);
        // Add days (serial * milliseconds per day)
        // Note: Excel treats 1900 as leap year, so for dates after Mar 1 1900, we technically need to subtract 1 day relative to JS 1899-12-31?
        // JS 1899-12-30 + serial days aligns correctly for modern dates (post 1900-03-01).
        const date = new Date(excelEpoch.getTime() + serial * 86400000);
        // Adjust for timezone (Excel usually implies local Midnight)
        // If we want the date part, UTC methods on this object often work if created this way.
        // But safer to add 12 hours to avoid boundary issues?
        // Let's stick to standard conversion.
        return date.toISOString().split('T')[0];
    }

    const date = new Date(input)
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
    }

    return new Date().toISOString().split('T')[0]
}

export function DataImport({ onComplete }: DataImportProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const requiredHeaders = [
        "Judul Proyek",
        "Tipe",
        "Tanggal",
        "Lokasi",
        "Link Drive / ID",
        "Link Thumbnail",
        "Status",
        "Visibility"
    ]

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsProcessing(true)
        setProgress("Membaca file...")

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            const worksheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[worksheetName]
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet)

            if (jsonData.length === 0) {
                throw new Error("File kosong atau format tidak valid")
            }

            // Validate Headers
            const firstRow = jsonData[0]
            const headers = Object.keys(firstRow)
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

            if (missingHeaders.length > 0) {
                throw new Error(`Format kolom tidak sesuai. Kolom hilang: ${missingHeaders.join(", ")}`)
            }

            // Process Data
            showLoading(`Mengimpor ${jsonData.length} data...`)
            const projectsRef = collection(db, "projects")
            const batchImportId = `import_${Date.now()}`
            let successCount = 0

            for (const [index, row] of jsonData.entries()) {
                setProgress(`Memproses ${index + 1}/${jsonData.length}...`)

                // 1. Extract/Optimize IDs
                let driveFolderId = row["Link Drive / ID"] || ""
                // Regex to extract from full link if needed
                const idMatch = driveFolderId.match(/(?:\/folders\/|\/d\/|id=)([-\w]+)/)
                if (idMatch && idMatch[1]) {
                    driveFolderId = idMatch[1]
                }

                // 2. Optimize Thumbnail Link (LH3)
                let thumbnailUrl = row["Link Thumbnail"] || ""
                if (thumbnailUrl && (thumbnailUrl.includes("drive.google.com") || thumbnailUrl.includes("/d/"))) {
                    // Extract ID
                    const thumbMatch = thumbnailUrl.match(/(?:file\/d\/|id=|d\/)([-\w]+)/)
                    if (thumbMatch && thumbMatch[1]) {
                        // PREVENT FOLDER LINKS
                        if (!thumbnailUrl.includes("/folders/") && thumbMatch[1] !== driveFolderId) {
                            thumbnailUrl = `https://lh3.googleusercontent.com/d/${thumbMatch[1]}`
                        }
                    }
                }

                // 3. Map Fields
                const project = {
                    title: row["Judul Proyek"] || "Untitled Project",
                    category: row["Tipe"] || "Event",
                    date: parseExcelDate(row["Tanggal"]),
                    location: row["Lokasi"] || "Unknown",
                    driveFolderId: driveFolderId,
                    thumbnailUrl: thumbnailUrl,
                    status: row["Status"] || "Synced",
                    accessLevel: (row["Visibility"] === "Private" || row["Visibility"] === "private") ? "private" : "public",
                    // Legacy support
                    isPrivate: (row["Visibility"] === "Private" || row["Visibility"] === "private"),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    contentType: "drive", // Default
                    importId: batchImportId
                }

                await addDoc(projectsRef, project)
                successCount++
            }

            closeSwal()
            await showSuccess(`Berhasil mengimpor ${successCount} proyek!`, "Import Selesai")

            setIsOpen(false)
            onComplete?.()
            if (fileInputRef.current) fileInputRef.current.value = ""

        } catch (error: any) {
            console.error("Import Error:", error)
            closeSwal()
            await showError(error.message || "Gagal mengimpor file")
        } finally {
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
                Import Excel/CSV
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Import Data Proyek</h2>
                            <button onClick={() => setIsOpen(false)} disabled={isProcessing} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                                <p className="font-bold mb-2">Format Header Wajib:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Judul Proyek</li>
                                    <li>Tipe</li>
                                    <li>Tanggal (YYYY-MM-DD)</li>
                                    <li>Lokasi</li>
                                    <li>Link Drive / ID</li>
                                    <li>Link Thumbnail (Optional Link Drive)</li>
                                    <li>Status</li>
                                    <li>Visibility (Public/Private)</li>
                                </ul>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={handleFileUpload}
                                    disabled={isProcessing}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">upload_file</span>
                                    <p className="text-sm font-medium text-foreground">
                                        Klik untuk upload .xlsx atau .csv
                                    </p>
                                </label>
                            </div>

                            {progress && <p className="text-center text-sm text-gray-500">{progress}</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
