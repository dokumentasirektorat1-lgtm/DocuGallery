"use client"

import { useState } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { useProjects } from "@/lib/useProjects";
import { extractYearFromDate } from "@/lib/dateUtils";

export default function Home() {
    const { projects, loading } = useProjects();
    const [activeYear, setActiveYear] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects
        .filter(project => {
            // Use robust date parser to extract year from various formats
            const projectYear = extractYearFromDate(project.date);
            const matchesYear = activeYear === "All" || projectYear === activeYear;
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.location.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesYear && matchesSearch;
        })
        .sort((a, b) => {
            // Sort by date descending (newest first)
            // Parse dates properly - support YYYY-MM-DD, DD/MM/YYYY formats
            const parseDate = (dateStr: string): number => {
                if (!dateStr) return 0;

                // Try parsing as-is first (works for YYYY-MM-DD)
                const timestamp = new Date(dateStr).getTime();
                if (!isNaN(timestamp)) return timestamp;

                // Try DD/MM/YYYY or DD-MM-YYYY format
                const parts = dateStr.split(/[-\/]/);
                if (parts.length === 3) {
                    // If first part is 4 digits, it's YYYY-MM-DD (already handled above)
                    // Otherwise assume DD/MM/YYYY or DD-MM-YYYY
                    if (parts[0].length !== 4) {
                        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime() || 0;
                    }
                }

                return 0;
            };

            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA; // Descending order (newest first)
        });

    return (
        <div className="container mx-auto px-4 pb-20">
            <Hero />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <FilterBar activeYear={activeYear} onYearChange={setActiveYear} />
                <div className="relative w-full md:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-600 dark:text-slate-300">search</span>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-sans"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading gallery...</div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <span className="material-symbols-outlined text-[32px] text-gray-400">search_off</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Proyek tidak ditemukan</h3>
                    <p className="text-gray-500">Coba ubah kata kunci atau filter tahun.</p>
                </div>
            ) : (
                <GalleryGrid folders={filteredProjects} />
            )}
        </div>
    );
}
