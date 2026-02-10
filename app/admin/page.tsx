"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminFormModal } from "@/components/AdminFormModal"
import { ProjectTable } from "@/components/ProjectTable"
import { useProjects } from "@/lib/useProjects"
import { MediaFolder } from "@/lib/data"
import { CSVImport } from "@/components/CSVImport"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Swal from "sweetalert2"

export default function AdminPage() {
    const { projects, addProject, updateProject, deleteProject } = useProjects()
    const [editingProject, setEditingProject] = useState<MediaFolder | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                await Swal.fire({
                    icon: "success",
                    title: "Update Berhasil!",
                    text: "Data proyek berhasil diperbarui",
                    timer: 2000,
                    showConfirmButton: false
                })
            } else {
                await addProject(data)
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil Menambahkan Data!",
                    text: "Proyek baru berhasil ditambahkan",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            handleCloseModal()
        } catch (error: any) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.message || "Terjadi kesalahan saat menyimpan data",
            })
        }
    }

    const handleDelete = async (id: string) => {
        await deleteProject(id)
    }

    const handleBulkDelete = async (ids: string[]) => {
        for (const id of ids) {
            await deleteProject(id)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <AdminSidebar />

                <div className="lg:pl-64 transition-all duration-300">
                    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                        {/* Modern Header - Text Above Buttons on Mobile */}
                        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent dark:from-primary/10 dark:via-primary/20 dark:to-transparent rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-primary/10">
                            <div className="flex flex-col gap-4 sm:gap-6">
                                {/* Title Section - Always Full Width on Top */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
                                            <span className="material-symbols-outlined text-white text-[20px] sm:text-[24px]">dashboard</span>
                                        </div>
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Project Manager</h1>
                                    </div>
                                    <p className="text-sm sm:text-base text-muted pl-0 sm:pl-[52px]">
                                        Manage your media content and documentation
                                    </p>
                                </div>

                                {/* Action Buttons - Compact & User-Friendly */}
                                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                                    <button
                                        onClick={handleAddNew}
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm sm:text-base min-h-[44px] w-full xs:w-auto xs:min-w-[140px] sm:min-w-[160px]"
                                    >
                                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">add</span>
                                        <span>Add Item</span>
                                    </button>
                                    <CSVImport onComplete={() => window.location.reload()} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-lg">All Projects ({projects.length})</h2>
                            </div>
                            <ProjectTable
                                projects={projects}
                                onEdit={handleEdit}
                                onDelete={deleteProject}
                                onBulkDelete={async (ids) => {
                                    for (const id of ids) {
                                        await deleteProject(id)
                                    }
                                }}
                            />
                        </div>
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
