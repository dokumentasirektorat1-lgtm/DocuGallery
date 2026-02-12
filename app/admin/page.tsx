"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminFormModal } from "@/components/AdminFormModal"
import { ProjectTable } from "@/components/ProjectTable"
import { DashboardStats } from "@/components/DashboardStats"
import { useProjects } from "@/lib/useProjects"
import { MediaFolder } from "@/lib/data"
import { CSVImport } from "@/components/CSVImport"
import { ExportButton } from "@/components/ExportButton"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { showSuccess, showError, showConfirm } from "@/lib/sweetalert"

export default function AdminPage() {
    const { projects, addProject, updateProject, deleteProject } = useProjects()
    const [editingProject, setEditingProject] = useState<MediaFolder | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>("")

    // Filter projects based on search query
    const filteredProjects = projects.filter(project => {
        if (!searchQuery.trim()) return true

        const query = searchQuery.toLowerCase()
        return (
            project.title.toLowerCase().includes(query) ||
            project.date.toLowerCase().includes(query) ||
            project.location.toLowerCase().includes(query) ||
            project.category.toLowerCase().includes(query) ||
            (project.status?.toLowerCase().includes(query))
        )
    })

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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <span className="material-symbols-outlined text-lg">search</span>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search media or documents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border-none bg-white dark:bg-surface rounded-lg shadow-sm focus:ring-2 focus:ring-primary text-sm placeholder-gray-400 dark:text-gray-300"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <CSVImport onComplete={() => window.location.reload()} />
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

                        {/* Main Table */}
                        <div className="mb-12">
                            <ProjectTable
                                projects={filteredProjects}
                                onEdit={handleEdit}
                                onDelete={deleteProject}
                                onBulkDelete={async (ids) => {
                                    for (const id of ids) {
                                        await deleteProject(id)
                                    }
                                }}
                            />
                        </div>

                        {/* Dashboard Stats Grid */}
                        <DashboardStats
                            totalItems={filteredProjects.length}
                            completedProjects={filteredProjects.filter(p => p.status === 'Synced').length}
                            inReview={filteredProjects.filter(p => p.status === 'Indexing').length}
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
        </ProtectedRoute>
    )
}
