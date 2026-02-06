"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { DummyUser } from "@/lib/data"

interface EditUserModalProps {
    user: DummyUser | null
    isOpen: boolean
    onClose: () => void
    onSave: (id: string, role: "admin" | "user", status: "pending" | "approved" | "rejected") => Promise<void>
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
    const [role, setRole] = useState<"admin" | "user">("user")
    const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (user) {
            setRole(user.role)
            setStatus(user.status)
        }
    }, [user])

    if (!isOpen || !user) return null

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(user.id, role, status)
            onClose()
        } catch (error) {
            console.error("Error saving user:", error)
            alert("Failed to update user")
        } finally {
            setIsSaving(false)
        }
    }

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Edit User</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-foreground">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as "admin" | "user")}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "pending" | "approved" | "rejected")}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
