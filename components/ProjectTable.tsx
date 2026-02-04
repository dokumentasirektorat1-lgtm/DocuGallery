import { MediaFolder } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ProjectTableProps {
    projects: MediaFolder[]
    onEdit?: (project: MediaFolder) => void
    onDelete?: (id: string) => void
}

import { useState } from "react"
import { ConfirmModal } from "./ConfirmModal"

export function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Visibility</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-[20px]">folder</span>
                                        </div>
                                        <span className="font-medium text-foreground">{project.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{project.date}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                                        project.status === "Synced"
                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                    )}>
                                        {project.status || "Unknown"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {project.isPrivate ? "Private" : "Public"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit?.(project)}
                                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => setFolderToDelete(project.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={!!folderToDelete}
                title="Delete Project?"
                message="Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan."
                onConfirm={() => {
                    if (folderToDelete && onDelete) {
                        onDelete(folderToDelete);
                        setFolderToDelete(null);
                    }
                }}
                onCancel={() => setFolderToDelete(null)}
            />
        </>
    )
}
