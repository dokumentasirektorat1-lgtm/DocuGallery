"use client"

import { useParams, useRouter } from "next/navigation"
import { useProjects } from "@/lib/useProjects"
import { useAuth } from "@/context/AuthContext"

export default function InternalProjectViewer() {
    const params = useParams()
    const router = useRouter()
    const { projects } = useProjects()
    const { user, userData } = useAuth()

    const project = projects.find(p => p.id === params.id)

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-[64px] text-gray-400 mb-4">folder_off</span>
                    <h2 className="text-xl font-bold text-foreground mb-2">Project Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The project you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="inline-block px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    // Privacy Gate Logic
    const isPendingUser = user && userData?.status === "pending"
    const isGuest = !user
    const isPrivateContent = project.isPrivate
    const canViewContent = !isPrivateContent || (user && userData?.status === "approved")

    // Access Denied for pending users
    if (isPrivateContent && isPendingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-[64px] text-amber-600 mb-4">lock</span>
                    <h2 className="text-xl font-bold text-foreground mb-2">Pending Verification</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your account is pending verification. Please wait for admin approval to access private content.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="inline-block px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    // Access Denied for guests
    if (isPrivateContent && isGuest) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-[64px] text-red-600 mb-4">lock</span>
                    <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You must be logged in and approved to access this private content.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-foreground font-bold rounded-xl transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const handleOpenDrive = () => {
        if (project.contentType === "facebook") {
            window.open(project.driveFolderId, '_blank')
        } else {
            window.open(`https://drive.google.com/drive/folders/${project.driveFolderId}`, '_blank')
        }
    }

    const driveEmbedUrl = project.contentType === "drive"
        ? `https://drive.google.com/embeddedfolderview?id=${project.driveFolderId}#grid`
        : null

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-surface border-b border-border sticky top-0 z-40 backdrop-blur-lg bg-surface/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground font-medium rounded-xl transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            <span>Back</span>
                        </button>

                        <button
                            onClick={handleOpenDrive}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-cyan-500/25"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {project.contentType === "facebook" ? "facebook" : "folder_open"}
                            </span>
                            <span>Open in {project.contentType === "facebook" ? "Facebook" : "Drive"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Project Details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                                {project.title}
                                {project.isPrivate && (
                                    <span className="material-symbols-outlined text-gray-400 text-[24px]">lock</span>
                                )}
                                {project.contentType === "facebook" && (
                                    <span className="material-symbols-outlined text-blue-500 text-[28px]">facebook</span>
                                )}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    {project.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    {project.location}
                                </span>
                                <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 text-sm font-medium rounded-full">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {/* Embedded Drive Viewer */}
                    {driveEmbedUrl && (
                        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-border">
                                <h2 className="font-semibold text-foreground flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">folder</span>
                                    Google Drive Folder
                                </h2>
                            </div>
                            <iframe
                                src={driveEmbedUrl}
                                className="w-full h-[600px] border-0"
                                title="Google Drive Folder"
                            />
                        </div>
                    )}

                    {/* Facebook Content - Show placeholder */}
                    {project.contentType === "facebook" && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-12 text-center">
                            <span className="material-symbols-outlined text-[64px] text-blue-600 mb-4 block">facebook</span>
                            <h3 className="text-xl font-bold text-foreground mb-2">Facebook Content</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Click the button above to view this content on Facebook.
                            </p>
                            <button
                                onClick={handleOpenDrive}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Open Facebook Link
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleOpenDrive}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-cyan-600 text-white font-bold text-lg rounded-xl transition-colors shadow-xl shadow-cyan-500/25"
                    >
                        <span className="material-symbols-outlined text-[24px]">
                            {project.contentType === "facebook" ? "facebook" : "folder_open"}
                        </span>
                        <span>Open Full {project.contentType === "facebook" ? "Facebook Post" : "Drive Folder"}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
