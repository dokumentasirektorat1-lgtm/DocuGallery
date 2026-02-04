"use client"

import { useState } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { useProjects } from "@/lib/useProjects";

export default function Home() {
    const { projects, loading } = useProjects();
    const [activeYear, setActiveYear] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects.filter(project => {
        const matchesYear = activeYear === "All" || project.date.startsWith(activeYear);
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesYear && matchesSearch;
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
