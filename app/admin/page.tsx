"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminFormModal } from "@/components/AdminFormModal"
import { ProjectTable } from "@/components/ProjectTable"
import { DashboardStats } from "@/components/DashboardStats"
import { useProjects } from "@/lib/useProjects"
import { MediaFolder } from "@/lib/data"
import { DataImport } from "@/components/DataImport"
import { ExportButton } from "@/components/ExportButton"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { showSuccess, showError, showConfirm } from "@/lib/sweetalert"
import { QuotaTracker } from "@/components/QuotaTracker"
import { BulkActionsToolbar } from "@/components/BulkActionsToolbar"
import Swal from 'sweetalert2'

export default function AdminPage() {
    const { projects, addProject, updateProject, deleteProject } = useProjects()
    const [editingProject, setEditingProject] = useState<MediaFolder | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>("")

    // Filter projects based on search query
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [filterSource, setFilterSource] = useState<'all' | 'manual' | 'import'>('all')

    // Filter projects based on search query AND source
    const filteredProjects = projects.filter(project => {
        let matchesSearch = true
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            matchesSearch = (
                project.title.toLowerCase().includes(query) ||
                project.date.toLowerCase().includes(query) ||
                project.location.toLowerCase().includes(query) ||
                project.category.toLowerCase().includes(query) ||
                (project.status?.toLowerCase().includes(query) ?? false)
            )
        }

        let matchesSource = true
        if (filterSource === 'manual') matchesSource = !project.importId
        if (filterSource === 'import') matchesSource = !!project.importId

        return matchesSearch && matchesSource
    })

    const handleSelectionChange = (newSet: Set<string>) => {
        setSelectedIds(newSet)
    }

    const handleSelectAllFiltered = () => {
        if (filteredProjects.length === 0) return
        const newSet = new Set(selectedIds)
        filteredProjects.forEach(p => newSet.add(p.id))
        setSelectedIds(newSet)
        showSuccess(`Selected all ${filteredProjects.length} items from filter`, "Selection Updated")
    }

    const handleBulkDeleteSelected = async () => {
        const selectedProjects = projects.filter(p => selectedIds.has(p.id))
        const count = selectedProjects.length

        if (count === 0) return

        const listHtml = selectedProjects.slice(0, 10).map(p =>
            `<div class="text-left text-sm py-1 border-b border-gray-100 dark:border-gray-700 last:border-0 truncate">${p.title}</div>`
        ).join('')

        const moreCount = count > 10
            ? `<div class="text-left text-xs text-gray-500 mt-2 italic">+ ${count - 10} more items...</div>`
            : ''

        const result = await Swal.fire({
            title: `Delete ${count} Items?`,
            html: `
                <div class="mb-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete these items?</div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700">
                    ${listHtml}
                    ${moreCount}
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete All',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            customClass: {
                popup: 'rounded-2xl shadow-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                title: 'text-xl font-bold text-gray-900 dark:text-white',
            }
        })

        if (result.isConfirmed) {
            handleBulkDelete(Array.from(selectedIds))
            setSelectedIds(new Set())
        }
    }

    const handleEdit = (project: MediaFolder) => {
        setEditingProject(project)
        setIsModalOpen(true)
    }

    const handleAddNew = () => {
        setEditingProject(undefined)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingProject(undefined)
    }

    const handleFormSubmit = async (data: any) => {
        try {
            if (editingProject) {
                await updateProject(editingProject.id, data)
                await showSuccess("Data proyek berhasil diperbarui", "Update Berhasil!")
            } else {
                await addProject(data)
                await showSuccess("Proyek baru berhasil ditambahkan", "Berhasil Menambahkan Data!")
            }
            handleCloseModal()
        } catch (error: any) {
            await showError(error?.message || "Terjadi kesalahan saat menyimpan data", "Gagal")
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await showConfirm(
            "Hapus Proyek?",
            "Data yang dihapus tidak dapat dikembalikan",
            "Ya, Hapus",
            "Batal"
        );

        if (confirmed) {
            try {
                await deleteProject(id);
                await showSuccess("Proyek berhasil dihapus");
            } catch (error) {
                await showError("Gagal menghapus proyek");
            }
        }
    }

    const handleBulkDelete = async (ids: string[]) => {
        const confirmed = await showConfirm(
            `Hapus ${ids.length} Proyek?`,
            "Tindakan ini tidak dapat dibatalkan",
            "Ya, Hapus Semua",
            "Batal"
        );

        if (confirmed) {
            try {
                // Delete one by one to ensure Firestore triggers
                const deletePromises = ids.map(id => deleteProject(id));
                await Promise.all(deletePromises);

                await showSuccess(`${ids.length} proyek berhasil dihapus`);
            } catch (error) {
                await showError("Gagal menghapus beberapa proyek");
            }
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <AdminSidebar />

                <div className="lg:pl-64 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        {/* Header Section */}
                        <header className="mb-8 sm:mb-10">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Project Manager
                            </h1>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Manage your media content and documentation across all active campaigns.
                            </p>
                        </header>

                        {/* Control Bar - Search + Buttons */}
                        <div className="space-y-4 mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* Search Bar */}
                                <div className="relative flex-1 max-w-md">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <span className="material-symbols-outlined text-lg">search</span>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search media..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border-none bg-white dark:bg-surface rounded-lg shadow-sm focus:ring-2 focus:ring-primary text-sm placeholder-gray-400 dark:text-gray-300"
                                    />
                                </div>

                                {/* Source Filter */}
                                <select
                                    value={filterSource}
                                    onChange={(e) => setFilterSource(e.target.value as any)}
                                    className="px-4 py-2.5 rounded-lg border-none bg-white dark:bg-surface shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary cursor-pointer"
                                >
                                    <option value="all">All Sources</option>
                                    <option value="manual">Manual Input</option>
                                    <option value="import">Imported</option>
                                </select>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <DataImport onComplete={() => window.location.reload()} />
                                    <ExportButton projects={projects} />
                                    <button
                                        onClick={handleAddNew}
                                        className="inline-flex items-center px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition-colors shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-2">add</span>
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            {/* Advanced Tools */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    {searchQuery || filterSource !== 'all' ? (
                                        <button
                                            onClick={handleSelectAllFiltered}
                                            className="text-sm font-medium text-primary hover:text-cyan-600 transition-colors"
                                        >
                                            Select all {filteredProjects.length} filtered results
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Main Table */}
                        <div className="mb-12">
                            <ProjectTable
                                projects={filteredProjects}
                                onEdit={handleEdit}
                                onDelete={deleteProject}
                                selectedIds={selectedIds}
                                onSelectionChange={handleSelectionChange}
                            />
                        </div>

                        <BulkActionsToolbar
                            selectedCount={selectedIds.size}
                            onDelete={handleBulkDeleteSelected}
                            onClear={() => setSelectedIds(new Set())}
                        />

                        {/* API Quota Tracker */}
                        <QuotaTracker projects={projects} />

                        {/* Dashboard Stats Grid */}
                        <DashboardStats
                            totalItems={filteredProjects.length}
                            publicItems={filteredProjects.filter(p => p.accessLevel === 'public' || (!p.accessLevel && !p.isPrivate)).length}
                            privateItems={filteredProjects.filter(p => p.accessLevel === 'private' || (!p.accessLevel && p.isPrivate)).length}
                            restrictedItems={filteredProjects.filter(p => p.accessLevel === 'admin_only').length}
                        />
                    </div>
                </div>

                {/* Modal */}
                <AdminFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    initialData={editingProject}
                    onSubmit={handleFormSubmit}
                    isEditing={!!editingProject}
                />
            </div>
        </ProtectedRoute >
    )
}
