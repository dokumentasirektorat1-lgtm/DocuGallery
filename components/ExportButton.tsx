"use client"

import { useState, useRef, useEffect } from "react"
import { MediaFolder } from "@/lib/data"
import * as XLSX from "xlsx"

interface ExportButtonProps {
    projects: MediaFolder[]
}

export function ExportButton({ projects }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const formatDataForExcel = () => {
        return projects.map(p => ({
            "Judul Proyek": p.title,
            "Tipe": p.category,
            "Tanggal": p.date || "-",
            "Lokasi": p.location || "-",
            "Link Drive / ID": p.contentType === 'facebook' ? p.driveFolderId : `https://drive.google.com/drive/folders/${p.driveFolderId}`,
            "Link Thumbnail": p.thumbnailUrl || "-",
            "Status": p.status || "Unknown",
            "Visibility": p.isPrivate ? "Private" : "Public"
        }))
    }

    const handleExportExcel = () => {
        const data = formatDataForExcel()

        // Create Worksheet
        const ws = XLSX.utils.json_to_sheet(data)

        // Column Widths (Auto-width simulation)
        const wscols = [
            { wch: 30 }, // Judul
            { wch: 10 }, // Tipe
            { wch: 15 }, // Tanggal
            { wch: 20 }, // Lokasi
            { wch: 40 }, // Link
            { wch: 40 }, // Thumb
            { wch: 10 }, // Status
            { wch: 10 }, // Vis
        ]
        ws['!cols'] = wscols

        // Add Generated Date at bottom
        XLSX.utils.sheet_add_aoa(ws, [
            [], // Empty row
            [`Generated on: ${new Date().toLocaleString()}`]
        ], { origin: -1 })

        // Create Workbook
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Projects")

        // Save
        XLSX.writeFile(wb, `DisplayDokumentasi_Export_${new Date().toISOString().split('T')[0]}.xlsx`)
        setIsOpen(false)
    }

    const handleExportCSV = () => {
        const data = formatDataForExcel()
        const ws = XLSX.utils.json_to_sheet(data)
        const csv = XLSX.utils.sheet_to_csv(ws)

        // Add BOM for Excel UTF-8 compatibility
        const bom = "\uFEFF"
        const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `DisplayDokumentasi_Export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setIsOpen(false)
    }

    return (
        <div className="relative inline-flex shadow-sm rounded-lg" ref={dropdownRef}>
            {/* Main Button (Defaults to Excel) */}
            <button
                onClick={handleExportExcel}
                className="relative inline-flex items-center px-4 py-2.5 rounded-l-lg border border-r-0 border-gray-300 dark:border-primary/20 bg-white dark:bg-primary/10 text-sm font-medium text-gray-700 dark:text-primary hover:bg-gray-50 dark:hover:bg-primary/20 focus:z-10 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
                <span className="material-symbols-outlined text-[20px] mr-2">download</span>
                Export Data
            </button>

            {/* Dropdown Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center px-2 py-2.5 rounded-r-lg border border-gray-300 dark:border-primary/20 bg-white dark:bg-primary/10 text-sm font-medium text-gray-700 dark:text-primary hover:bg-gray-50 dark:hover:bg-primary/20 focus:z-10 focus:ring-2 focus:ring-primary focus:border-primary transition-all border-l border-l-gray-300 dark:border-l-primary/20"
            >
                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-[#1a242e] ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1" role="menu">
                        <button
                            onClick={handleExportCSV}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px] text-green-600">description</span>
                            Download as CSV
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px] text-blue-600">table_view</span>
                            Download as Excel (.xlsx)
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
