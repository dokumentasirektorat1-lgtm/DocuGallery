"use client"

import { useState, useEffect } from "react"
import { MediaFolder } from "@/lib/data"
import { convertDriveToThumbnail } from "@/lib/utils"

interface AdminFormProps {
    initialData?: MediaFolder
    onSubmit?: (data: any) => void
    onCancel?: () => void
    isEditing?: boolean
}

export function AdminForm({ initialData, onSubmit, onCancel, isEditing = false }: AdminFormProps) {
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [driveLink, setDriveLink] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [thumbnailType, setThumbnailType] = useState<"auto" | "custom">("auto")
    const [thumbnailInput, setThumbnailInput] = useState("")

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDate(initialData.date)
            setLocation(initialData.location)
            setDriveLink(initialData.driveFolderId)
            setIsPrivate(initialData.isPrivate)
            setThumbnailInput(initialData.thumbnailUrl || "")
            setThumbnailType(initialData.thumbnailUrl ? "custom" : "auto")
        } else {
            setTitle("")
            setDate("")
            setLocation("")
            setDriveLink("")
            setIsPrivate(false)
            setThumbnailInput("")
            setThumbnailType("auto")
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Auto convert if it looks like a drive file link
        const finalThumbnail = convertDriveToThumbnail(thumbnailInput);

        onSubmit?.({
            title,
            date,
            location,
            driveFolderId: driveLink,
            isPrivate,
            category: "Project",
            thumbnailUrl: finalThumbnail,
            status: "Synced"
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-2xl border border-border shadow-md sticky top-24">
            <div className="space-y-1 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-foreground">{isEditing ? "Edit Project" : "Add New Project"}</h2>
                    <p className="text-sm text-gray-500">{isEditing ? "Update existing details" : "Connect a Google Drive folder"}</p>
                </div>
                {isEditing && (
                    <button type="button" onClick={onCancel} className="text-xs text-red-500 hover:underline">Cancel</button>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drive Folder Link</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">add_link</span>
                        <input
                            type="text"
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                            placeholder="Folder ID or Link"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Q4 Marketing Campaign"
                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Control</label>
                    <div className="flex bg-background p-1 rounded-xl border border-border">
                        <button
                            type="button"
                            onClick={() => setIsPrivate(false)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${!isPrivate
                                ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Public
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPrivate(true)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${isPrivate
                                ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Private
                        </button>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail Image</label>
                    <div className="flex flex-col gap-3">
                        <div className="flex bg-background p-1 rounded-xl border border-border">
                            <button
                                type="button"
                                onClick={() => setThumbnailType("auto")}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${thumbnailType === "auto"
                                    ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                Auto (Unsplash)
                            </button>
                            <button
                                type="button"
                                onClick={() => setThumbnailType("custom")}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${thumbnailType === "custom"
                                    ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                Custom Link
                            </button>
                        </div>

                        {thumbnailType === "custom" && (
                            <div className="relative animate-in slide-in-from-top-2 duration-200">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">image</span>
                                <input
                                    type="text"
                                    value={thumbnailInput}
                                    onChange={(e) => setThumbnailInput(e.target.value)}
                                    placeholder="Paste Image Link or Drive File Link"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">Supports direct links and Google Drive file links.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/25"
            >
                <span className="material-symbols-outlined">save</span>
                {isEditing ? "Update Project" : "Create Project"}
            </button>
        </form>
    )
}
