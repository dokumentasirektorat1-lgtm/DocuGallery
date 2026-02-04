"use client"

import { useParams } from "next/navigation"
import { folders } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Lightbox } from "@/components/Lightbox"
import { VideoPlayer } from "@/components/VideoPlayer"

// Dummy content for the detail view simulation
const dummyContent = [
    { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622' },
    { id: 2, type: 'image', src: 'https://images.unsplash.com/photo-1511551203524-9a24350a5771' },
    { id: 3, type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 4, type: 'image', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad' },
]

export default function MediaDetailPage() {
    const params = useParams()
    const folder = folders.find(f => f.id === params.id)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState("")

    if (!folder) {
        return <div className="text-center py-20">Folder not found</div>
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                        {folder.title}
                        {folder.isPrivate && <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {folder.date}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {folder.location}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyContent.map((item) => (
                    <div
                        key={item.id}
                        className="group relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => {
                            if (item.type === 'image') {
                                setCurrentImage(item.src)
                                setLightboxOpen(true)
                            }
                        }}
                    >
                        {item.type === 'video' ? (
                            <VideoPlayer src={item.src} />
                        ) : (
                            <>
                                <Image
                                    src={item.src}
                                    alt="Gallery item"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </>
                        )}
                    </div>
                ))}
            </div>

            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                src={currentImage}
                alt="Preview"
            />
        </div>
    )
}
