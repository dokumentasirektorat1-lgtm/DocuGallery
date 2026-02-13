"use client"

import Image from "next/image"
import { useState } from "react"
import { MediaFolder } from "@/lib/data"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { generateInternalLink, isFacebookLink } from "@/lib/helpers"
import { showInfo } from "@/lib/sweetalert"
import { repairThumbnail } from "@/lib/autoThumbnail"

interface MediaCardProps {
    folder: MediaFolder
}

export function MediaCard({ folder }: MediaCardProps) {
    const [showToast, setShowToast] = useState(false)
    const { user, userData } = useAuth()

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Smart Share Logic: Internal link for private content
        let linkToCopy: string
        let linkType: string

        if (folder.isPrivate) {
            // Private content: Share internal website link
            linkToCopy = generateInternalLink(folder.id)
            linkType = "Internal link"
        } else {
            // Public content: Share Drive/Facebook link directly
            if (folder.contentType === "facebook") {
                linkToCopy = folder.driveFolderId // Contains FB link
                linkType = "Facebook link"
            } else {
                linkToCopy = `https://drive.google.com/drive/folders/${folder.driveFolderId}`
                linkType = "Drive link"
            }
        }

        try {
            await navigator.clipboard.writeText(linkToCopy)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 2000)
        } catch (error) {
            showInfo(`Link: ${linkToCopy}`, 'Copy this link')
        }
    }

    // Privacy gate logic
    const isGuest = !user
    const isPendingUser = user && userData?.status === "pending"
    // Check both legacy boolean and new accessLevel
    const isPrivateContent = folder.isPrivate || folder.accessLevel === 'private' || folder.accessLevel === 'admin_only'
    const canAccess = !isPrivateContent || (user && userData?.status === "approved") || (user && userData?.role === 'admin')

    const handleCardClick = () => {
        if (!canAccess) {
            showInfo("You must be logged in and approved to access this content.", "Access Denied")
            return
        }

        // Always navigate to internal project page for consistent UX
        window.location.href = `/project/${folder.id}`
    }

    // Determine icon based on content type
    const isFacebookContent = folder.contentType === "facebook"
    const displayThumbnail = repairThumbnail(folder.thumbnailUrl)

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group relative block rounded-2xl overflow-hidden bg-surface dark:bg-surface border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                canAccess ? "cursor-pointer" : "cursor-not-allowed opacity-75"
            )}
        >
            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-20">
                <span className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full shadow-lg backdrop-blur-md",
                    isFacebookContent
                        ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                        : isPrivateContent
                            ? "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                            : "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300"
                )}>
                    {folder.category}
                </span>
            </div>

            {/* Share Button - ONLY visible if user can access */}
            {canAccess && (
                <button
                    onClick={handleShare}
                    className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-primary transition-colors shadow-sm"
                    title={isPrivateContent ? "Share Internal Link" : "Share Link"}
                >
                    <span className="material-symbols-outlined text-[18px]">ios_share</span>
                </button>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-12 right-3 z-40 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-lg animate-in fade-in zoom-in duration-200">
                    {isPrivateContent ? "Internal link copied!" : "Link copied!"}
                </div>
            )}

            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-[#283639] flex items-center justify-center">
                {displayThumbnail ? (
                    <Image
                        src={displayThumbnail}
                        alt={folder.title}
                        fill
                        loading="lazy"
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <span className="material-symbols-outlined text-[80px] text-gray-400 dark:text-gray-600 opacity-30">
                        {isFacebookContent ? "facebook" : "image"}
                    </span>
                )}
                {/* Lock overlay for inaccessible content */}
                {!canAccess && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-[48px] text-white mb-2">lock</span>
                            <p className="text-white text-sm font-medium">Login Required</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 flex-1">{folder.title}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {isPrivateContent && <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[16px] mt-0.5">lock</span>}
                        {isFacebookContent && <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5">facebook</span>}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        <span>{folder.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="line-clamp-1">{folder.location}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
