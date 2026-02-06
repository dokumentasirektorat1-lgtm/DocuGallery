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

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <AdminSidebar />

                <div className="lg:pl-64 transition-all duration-300">
                    <div className="p-8 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <header>
                                <h1 className="text-2xl font-bold text-foreground">Project Manager</h1>
                                <p className="text-gray-500">Manage gallery content and documentation.</p>
                            </header>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddNew}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-cyan-500/25"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    <span>Add Item</span>
                                </button>
                                <CSVImport onComplete={() => window.location.reload()} />
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
