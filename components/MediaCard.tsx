import Image from "next/image"
import Link from "next/link"
import { MediaFolder } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface MediaCardProps {
    folder: MediaFolder
}

export function MediaCard({ folder }: MediaCardProps) {
    const [showToast, setShowToast] = useState(false);

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Use generic link if drive link generic, primarily for demo
        const link = `https://drive.google.com/drive/folders/${folder.driveFolderId}`;
        navigator.clipboard.writeText(link);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }

    return (
        <Link
            href={`/media/${folder.id}`}
            className="group relative block rounded-2xl overflow-hidden bg-surface dark:bg-surface border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-md text-foreground shadow-sm">
                    {folder.category}
                </span>
            </div>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-primary transition-colors shadow-sm"
                title="Share Link"
            >
                <span className="material-symbols-outlined text-[18px]">ios_share</span>
            </button>

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-12 right-3 z-40 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-lg animate-in fade-in zoom-in duration-200">
                    Link copied!
                </div>
            )}

            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-[#283639] flex items-center justify-center">
                {folder.thumbnailUrl ? (
                    <Image
                        src={folder.thumbnailUrl}
                        alt={folder.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="text-gray-400 flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px] text-gray-300 dark:text-gray-600">image</span>
                        <span className="text-xs font-medium">No Thumbnail</span>
                    </div>
                )}

                {folder.isPrivate && (
                    <div className="absolute top-3 right-12 z-20 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-md flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            </div>

            <div className="p-5">
                <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                    {folder.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>{folder.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="line-clamp-1">{folder.location}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
