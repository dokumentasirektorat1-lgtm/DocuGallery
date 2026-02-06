"use client"

interface BulkActionsToolbarProps {
    selectedCount: number
    onDelete: () => void
    onClear: () => void
}

export function BulkActionsToolbar({ selectedCount, onDelete, onClear }: BulkActionsToolbarProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span className="font-semibold text-foreground">
                        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        <span>Delete Selected</span>
                    </button>

                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                    >
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
