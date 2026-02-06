"use client"

import { useState, useEffect } from "react"
import { MediaFolder } from "@/lib/data"
import { convertDriveToThumbnail } from "@/lib/utils"
import { isFacebookLink, generateDriveThumbnail, extractDriveFolderId } from "@/lib/helpers"

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
    const [postType, setPostType] = useState<"post" | "video">("post")

    // Auto-detect Facebook links
    const isFacebook = isFacebookLink(driveLink)

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDate(initialData.date)
            setLocation(initialData.location)
            setDriveLink(initialData.driveFolderId)
            setIsPrivate(initialData.isPrivate)
            setThumbnailInput(initialData.thumbnailUrl || "")
            setThumbnailType(initialData.thumbnailUrl ? "custom" : "auto")
            setPostType(initialData.postType || "post")
        } else {
            setTitle("")
            setDate("")
            setLocation("")
            setDriveLink("")
            setIsPrivate(false)
            setThumbnailInput("")
            setThumbnailType("auto")
            setPostType("post")
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let finalThumbnail = ""

        if (thumbnailType === "custom" && thumbnailInput) {
            // Auto convert if it looks like a drive file link
            finalThumbnail = convertDriveToThumbnail(thumbnailInput)
        } else if (thumbnailType === "auto" && !isFacebook) {
            // Extract folder ID first
            const folderId = extractDriveFolderId(driveLink) || driveLink

            // Try to fetch auto-thumbnail from Drive API
            try {
                const { getAutoThumbnail } = await import("@/lib/autoThumbnail")
                console.log('🔄 Fetching auto-thumbnail via Drive API...')
                finalThumbnail = await getAutoThumbnail(folderId)
            } catch (error) {
                console.error('Failed to fetch auto-thumbnail, using fallback:', error)
                finalThumbnail = generateDriveThumbnail(driveLink)
            }
        }

        // Extract folder ID or keep full link for Facebook
        let driveFolderId = driveLink
        if (!isFacebook) {
            const extractedId = extractDriveFolderId(driveLink)
            driveFolderId = extractedId || driveLink
        }

        onSubmit?.({
            title,
            date,
            location,
            driveFolderId,
            isPrivate,
            category: "Project",
            thumbnailUrl: finalThumbnail,
            status: "Synced",
            contentType: isFacebook ? "facebook" : "drive",
            postType: isFacebook ? postType : undefined,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-foreground">{isEditing ? "Edit Project" : "Add New Project"}</h2>
                    <p className="text-sm text-gray-500">{isEditing ? "Update existing details" : "Connect Drive or Facebook"}</p>
                </div>
                {isEditing && (
                    <button type="button" onClick={onCancel} className="text-xs text-red-500 hover:underline">Cancel</button>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isFacebook ? "Facebook Link" : "Drive Folder Link"}
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                            {isFacebook ? "facebook" : "add_link"}
                        </span>
                        <input
                            type="text"
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                            placeholder={isFacebook ? "Facebook post/video URL" : "Folder ID or Link"}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        />
                    </div>
                    {isFacebook && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            Facebook link detected automatically
                        </p>
                    )}
                </div>

                {/* Facebook Post Type Selector */}
                {isFacebook && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Type</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPostType("post")}
                                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${postType === "post"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Post
                            </button>
                            <button
                                type="button"
                                onClick={() => setPostType("video")}
                                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${postType === "video"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Video
                            </button>
                        </div>
                    </div>
                )}

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

                {/* Thumbnail Options */}
                {!isFacebook && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setThumbnailType("auto")}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${thumbnailType === "auto"
                                    ? "bg-primary/10 text-primary border-2 border-primary"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-border"
                                    }`}
                            >
                                Auto from Drive
                            </button>
                            <button
                                type="button"
                                onClick={() => setThumbnailType("custom")}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${thumbnailType === "custom"
                                    ? "bg-primary/10 text-primary border-2 border-primary"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-border"
                                    }`}
                            >
                                Custom URL
                            </button>
                        </div>

                        {thumbnailType === "custom" && (
                            <input
                                type="text"
                                value={thumbnailInput}
                                onChange={(e) => setThumbnailInput(e.target.value)}
                                placeholder="Direct image link or Google Drive file link"
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-sm"
                            />
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-gray-600 dark:text-gray-400">lock</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Private Content</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/25"
            >
                {isEditing ? "Update Project" : "Add Project"}
            </button>
        </form>
    )
}
