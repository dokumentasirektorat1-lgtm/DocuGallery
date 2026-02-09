"use client"

import { useEffect } from "react"
import { AdminForm } from "./AdminForm"
import { MediaFolder } from "@/lib/data"

interface AdminFormModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: MediaFolder
    onSubmit?: (data: any) => void
    isEditing?: boolean
}

export function AdminFormModal({ isOpen, onClose, initialData, onSubmit, isEditing = false }: AdminFormModalProps) {
    // ESC key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >    {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close modal"
                >
                    <span className="material-symbols-outlined text-[20px] text-gray-600 dark:text-gray-300">close</span>
                </button>

                {/* Form */}
                <div className="p-6">
                    <AdminForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        isEditing={isEditing}
                    />
                </div>
            </div>
        </div>
    )
}
