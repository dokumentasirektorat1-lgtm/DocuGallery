"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminForm } from "@/components/AdminForm"
import { ProjectTable } from "@/components/ProjectTable"
import { useProjects } from "@/lib/useProjects"
import { MediaFolder } from "@/lib/data"

export default function AdminPage() {
    const { projects, addProject, updateProject, deleteProject } = useProjects()
    const [editingProject, setEditingProject] = useState<MediaFolder | undefined>(undefined)

    const handleEdit = (project: MediaFolder) => {
        setEditingProject(project)
    }

    const handleCancelEdit = () => {
        setEditingProject(undefined)
    }

    const handleFormSubmit = async (data: any) => { // Type 'any' for simplicity in transition
        if (editingProject) {
            await updateProject(editingProject.id, data)
            setEditingProject(undefined)
        } else {
            await addProject(data)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />

            <div className="lg:pl-64 transition-all duration-300">
                <div className="p-8 max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Project Manager</h1>
                        <p className="text-gray-500">Manage gallery content and documentation.</p>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Pane: Project List */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-lg">All Projects ({projects.length})</h2>
                            </div>
                            <ProjectTable
                                projects={projects}
                                onEdit={handleEdit}
                                onDelete={deleteProject}
                            />
                        </div>

                        {/* Right Pane: Sticky Form */}
                        <div className="xl:col-span-1">
                            <AdminForm
                                initialData={editingProject}
                                onSubmit={handleFormSubmit}
                                onCancel={handleCancelEdit}
                                isEditing={!!editingProject}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
