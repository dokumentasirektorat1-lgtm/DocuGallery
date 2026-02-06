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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default: 20 items

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

    // Calculate pagination
    const totalItems = filteredProjects.length;
    const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage);

    // Get current page items
    const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
    const endIndex = itemsPerPage === -1 ? totalItems : startIndex + itemsPerPage;
    const currentItems = filteredProjects.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleYearChange = (year: string) => {
        setActiveYear(year);
        setCurrentPage(1);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <div className="container mx-auto px-4 pb-20">
            <Hero />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <FilterBar activeYear={activeYear} onYearChange={handleYearChange} />
                <div className="relative w-full md:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-600 dark:text-slate-300">search</span>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
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
                <>
                    {/* Items count and items per page selector */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} projects
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Items per page:</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={-1}>All</option>
                            </select>
                        </div>
                    </div>

                    <GalleryGrid folders={currentItems} />

                    {/* Pagination controls */}
                    {totalPages > 1 && itemsPerPage !== -1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Show pages around current page
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg transition-colors ${currentPage === pageNum
                                                    ? 'bg-primary text-white'
                                                    : 'border border-border bg-surface hover:bg-primary/10'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
