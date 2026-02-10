"use client"

import { MediaFolder } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import { BulkActionsToolbar } from "./BulkActionsToolbar"
import { showSuccessToast, showErrorToast, promiseToast } from "@/lib/toast"
import toast from "react-hot-toast"

type SortField = 'title' | 'date' | 'createdAt'
type SortOrder = 'asc' | 'desc'

interface ProjectTableProps {
    projects: MediaFolder[]
    onEdit?: (project: MediaFolder) => void
    onDelete?: (id: string) => void
    onBulkDelete?: (ids: string[]) => void
}

export function ProjectTable({ projects, onEdit, onDelete, onBulkDelete }: ProjectTableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortField, setSortField] = useState<SortField>('createdAt')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // Sort handler
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle order if clicking same field
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            // New field, default to descending
            setSortField(field)
            setSortOrder('desc')
        }
    }

    // Sorted projects
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            let comparison = 0

            if (sortField === 'title') {
                comparison = a.title.localeCompare(b.title)
            } else if (sortField === 'date') {
                const dateA = new Date(a.date).getTime() || 0
                const dateB = new Date(b.date).getTime() || 0
                comparison = dateA - dateB
            } else if (sortField === 'createdAt') {
                // Use createdAt if available, otherwise use date
                const timeA = (a as any).createdAt?.toDate?.().getTime() || new Date(a.date).getTime() || 0
                const timeB = (b as any).createdAt?.toDate?.().getTime() || new Date(b.date).getTime() || 0
                comparison = timeA - timeB
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })
    }, [projects, sortField, sortOrder])

    // Pagination calculations (using sorted projects)
    const totalPages = Math.ceil(sortedProjects.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage)

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(paginatedProjects.map(p => p.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id])
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
        }
    }

    const handleBulkDelete = async () => {
        const confirmed = confirm(`Delete ${selectedIds.length} projects? This cannot be undone.`)

        if (confirmed && onBulkDelete) {
            const deletePromise = (async () => {
                await onBulkDelete(selectedIds)
                setSelectedIds([])
            })()

            promiseToast(deletePromise, {
                loading: 'Deleting projects...',
                success: `${selectedIds.length} projects deleted successfully!`,
                error: 'Failed to delete projects'
            })
        }
    }

    const handleSingleDelete = async (id: string, title: string) => {
        const confirmed = confirm(`Delete "${title}"? This cannot be undone.`)

        if (confirmed && onDelete) {
            try {
                await onDelete(id)
                showSuccessToast('Project deleted successfully!')
            } catch (error) {
                showErrorToast('Failed to delete project')
            }
        }
    }


    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        setSelectedIds([]) // Clear selection on page change
    }

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1) // Reset to first page
        setSelectedIds([])
    }

    const allSelected = paginatedProjects.length > 0 && selectedIds.length === paginatedProjects.length
    const someSelected = selectedIds.length > 0 && selectedIds.length < paginatedProjects.length

    // Sort icon component
    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <span className="material-symbols-outlined text-[16px] text-gray-400 opacity-50">unfold_more</span>
        }
        return sortOrder === 'asc'
            ? <span className="material-symbols-outlined text-[16px] text-primary">arrow_upward</span>
            : <span className="material-symbols-outlined text-[16px] text-primary">arrow_downward</span>
    }

    return (
        <>
            {/* Pagination Controls - Above Table */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl border-x border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted">
                    <span className="font-medium">{sortedProjects.length}</span>
                    <span>total projects</span>
                    {sortedProjects.length > 0 && (
                        <>
                            <span className="text-gray-400">•</span>
                            <span>Page {currentPage} of {totalPages}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* First Page */}
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-700 dark:text-gray-200"
                        title="First page"
                    >
                        <span className="material-symbols-outlined text-[18px]">first_page</span>
                    </button>

                    {/* Previous */}
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-700 dark:text-gray-200"
                        title="Previous page"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    {/* Page Indicator */}
                    <div className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm min-w-[60px] sm:min-w-[80px] text-center">
                        {currentPage} / {totalPages || 1}
                    </div>

                    {/* Next */}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg border border-border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-700 dark:text-gray-200"
                        title="Next page"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>

                    {/* Last Page */}
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg border border-border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-700 dark:text-gray-200"
                        title="Last page"
                    >
                        <span className="material-symbols-outlined text-[18px]">last_page</span>
                    </button>
                </div>
            </div>






            {/* Table Container - Mobile Scroll Visible */}
            <div
                className="overflow-x-auto overflow-y-visible pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'auto',
                    scrollbarColor: 'rgb(6 182 212) rgb(229 231 235)'
                }}
            >
                <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                    <table className="w-full text-left text-sm min-w-[900px]">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={input => {
                                            if (input) input.indeterminate = someSelected
                                        }}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 select-none transition-colors"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Nama</span>
                                        <SortIcon field="title" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 select-none transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Tanggal</span>
                                        <SortIcon field="date" />
                                    </div>
                                </th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Visibility</th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 select-none transition-colors"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Upload</span>
                                        <SortIcon field="createdAt" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedProjects.map((project) => (
                                <tr
                                    key={project.id}
                                    className={cn(
                                        "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                                        selectedIds.includes(project.id) && "bg-cyan-50 dark:bg-cyan-900/10"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(project.id)}
                                            onChange={(e) => handleSelectOne(project.id, e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "p-2 rounded-lg",
                                                project.contentType === "facebook"
                                                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600"
                                                    : "bg-primary/10 text-primary"
                                            )}>
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {project.contentType === "facebook" ? "facebook" : "folder"}
                                                </span>
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
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium",
                                            project.contentType === "facebook"
                                                ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                                        )}>
                                            {project.contentType === "facebook" ? "Facebook" : "Drive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-1">
                                            {project.isPrivate && <span className="material-symbols-outlined text-[14px]">lock</span>}
                                            <span>{project.isPrivate ? "Private" : "Public"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {(project as any).createdAt
                                            ? new Date((project as any).createdAt.toDate?.() || (project as any).createdAt).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '-'
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* HIGH CONTRAST EDIT BUTTON - CYAN */}
                                            <button
                                                onClick={() => onEdit?.(project)}
                                                className="p-2 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-800/60 rounded-lg transition-colors shadow-sm"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            {/* HIGH CONTRAST DELETE BUTTON - RED */}
                                            <button
                                                onClick={() => handleSingleDelete(project.id, project.title)}
                                                className="p-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 rounded-lg transition-colors shadow-sm"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION CONTROLS */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50 dark:bg-gray-800/30">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <span>per page</span>
                            <span className="ml-3 font-medium text-foreground">
                                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProjects.length)} of {sortedProjects.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg border transition-colors font-medium text-sm",
                                        currentPage === page
                                            ? "bg-primary text-white border-primary"
                                            : "border-border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            <BulkActionsToolbar
                selectedCount={selectedIds.length}
                onDelete={handleBulkDelete}
                onClear={() => setSelectedIds([])}
            />
        </>
    )
}
