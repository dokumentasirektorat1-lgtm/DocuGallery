"use client"

import { useState, useEffect, useRef } from "react"
import { MediaFolder } from "@/lib/data"
import { convertDriveToThumbnail } from "@/lib/utils"
import { isFacebookLink, generateDriveThumbnail, extractDriveFolderId } from "@/lib/helpers"
import { uploadThumbnail, validateImageFile } from "@/lib/firebaseStorage"
import { FolderImageSelector } from "./FolderImageSelector"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { useSettings } from "@/context/SettingsContext"

interface AdminFormProps {
    initialData?: MediaFolder
    onSubmit?: (data: any) => void
    onCancel?: () => void
    isEditing?: boolean
}

export function AdminForm({ initialData, onSubmit, onCancel, isEditing = false }: AdminFormProps) {
    const { googleDriveApiKey } = useSettings()

    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [driveLink, setDriveLink] = useState("")
    const [accessLevel, setAccessLevel] = useState<"public" | "private" | "admin_only">("public")
    const [thumbnailType, setThumbnailType] = useState<"auto" | "custom" | "upload" | "folder">("auto")
    const [thumbnailInput, setThumbnailInput] = useState("")
    const [postType, setPostType] = useState<"post" | "video">("post")
    const [uploading, setUploading] = useState(false)
    const [folderSelectorOpen, setFolderSelectorOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Auto-detect Facebook links
    const isFacebook = isFacebookLink(driveLink)

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDate(initialData.date)
            setLocation(initialData.location)
            setDriveLink(initialData.driveFolderId)
            setAccessLevel(initialData.accessLevel || (initialData.isPrivate ? "private" : "public"))
            setThumbnailInput(initialData.thumbnailUrl || "")
            setThumbnailType(initialData.thumbnailUrl ? "custom" : "auto")
            setPostType(initialData.postType || "post")
        } else {
            setTitle("")
            setDate("")
            setLocation("")
            setDriveLink("")
            setAccessLevel("public")
            setThumbnailInput("")
            setThumbnailType("auto")
            setPostType("post")
        }
    }, [initialData])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validation = validateImageFile(file)
        if (!validation.valid) {
            showErrorToast(validation.error || "Invalid file")
            return
        }

        setUploading(true)
        try {
            const downloadURL = await uploadThumbnail(file)
            setThumbnailInput(downloadURL)
            setThumbnailType("upload")
            showSuccessToast("Thumbnail uploaded!")
        } catch (error: any) {
            showErrorToast(error.message || "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleFolderImageSelect = (imageUrl: string) => {
        setThumbnailInput(imageUrl)
        setThumbnailType("folder")
        showSuccessToast("Image selected!")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let finalThumbnail = ""

        if ((thumbnailType === "custom" || thumbnailType === "upload" || thumbnailType === "folder") && thumbnailInput) {
            // Use provided thumbnail
            finalThumbnail = thumbnailType === "custom" ? convertDriveToThumbnail(thumbnailInput) : thumbnailInput
        } else if (thumbnailType === "auto" && !isFacebook) {
            // Extract folder ID first
            const folderId = extractDriveFolderId(driveLink) || driveLink

            // Try to fetch auto-thumbnail from Drive API
            try {
                const { getAutoThumbnail } = await import("@/lib/autoThumbnail")
                console.log('🔄 Fetching auto-thumbnail via Drive API...')
                finalThumbnail = await getAutoThumbnail(folderId, googleDriveApiKey)
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
            isPrivate: accessLevel !== "public", // Backward compatibility
            accessLevel,
            category: "Project",
            thumbnailUrl: finalThumbnail,
            status: "Synced",
            contentType: isFacebook ? "facebook" : "drive",
            postType: isFacebook ? postType : undefined,
        })
    }

    return (
        <>
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail Options</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setThumbnailType("auto")}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${thumbnailType === "auto"
                                        ? "bg-primary/10 text-primary border-2 border-primary"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-border"
                                        }`}
                                >
                                    Auto
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${thumbnailType === "upload"
                                        ? "bg-primary/10 text-primary border-2 border-primary"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-border"
                                        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const folderId = extractDriveFolderId(driveLink) || driveLink
                                        if (!folderId) {
                                            showErrorToast("Enter folder link first")
                                            return
                                        }
                                        setFolderSelectorOpen(true)
                                    }}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${thumbnailType === "folder"
                                        ? "bg-primary/10 text-primary border-2 border-primary"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-border"
                                        }`}
                                >
                                    From Folder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setThumbnailType("custom")}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${thumbnailType === "custom"
                                        ? "bg-primary/10 text-primary border-2 border-primary"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-border"
                                        }`}
                                >
                                    Manual Link
                                </button>
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

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

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility Access</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setAccessLevel("public")}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${accessLevel === "public"
                                        ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 ring-1 ring-green-500"
                                        : "bg-background border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <span className="material-symbols-outlined mb-1">public</span>
                                <span className="text-xs font-semibold">Public</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAccessLevel("private")}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${accessLevel === "private"
                                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-500"
                                        : "bg-background border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <span className="material-symbols-outlined mb-1">lock</span>
                                <span className="text-xs font-semibold">Private</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAccessLevel("admin_only")}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${accessLevel === "admin_only"
                                        ? "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-700 dark:text-rose-400 ring-1 ring-rose-500"
                                        : "bg-background border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <span className="material-symbols-outlined mb-1">local_police</span>
                                <span className="text-xs font-semibold">Admin Only</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
                            {accessLevel === "public" && "Visible to everyone including guests without login."}
                            {accessLevel === "private" && "Visible only to logged-in users and admins."}
                            {accessLevel === "admin_only" && "Strictly visible to users with Admin role."}
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/25"
                >
                    {isEditing ? "Update Project" : "Add Project"}
                </button>
            </form>

            {/* Folder Image Selector Modal */}
            {folderSelectorOpen && (
                <FolderImageSelector
                    folderId={extractDriveFolderId(driveLink) || driveLink}
                    isOpen={folderSelectorOpen}
                    onClose={() => setFolderSelectorOpen(false)}
                    onSelect={handleFolderImageSelect}
                />
            )}
        </>
    )
}
