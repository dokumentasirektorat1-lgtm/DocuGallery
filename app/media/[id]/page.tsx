"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Lightbox } from "@/components/Lightbox"
import { VideoPlayer } from "@/components/VideoPlayer"
import { useProjects } from "@/lib/useProjects"
import { useAuth } from "@/context/AuthContext"

// Dummy content for the detail view simulation
const dummyContent = [
    { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622' },
    { id: 2, type: 'image', src: 'https://images.unsplash.com/photo-1511551203524-9a24350a5771' },
    { id: 3, type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 4, type: 'image', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad' },
]

export default function MediaDetailPage() {
    const params = useParams()
    const { projects } = useProjects()
    const { user, userData } = useAuth()
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState("")

    const folder = projects.find(f => f.id === params.id)

    if (!folder) {
        return <div className="text-center py-20">Project not found</div>
    }

    // Privacy Gate Logic
    const isPendingUser = user && userData?.status === "pending"
    const isGuest = !user
    const isPrivateContent = folder.isPrivate
    const canViewPrivateContent = user && userData?.status === "approved"

    // Block access for pending users trying to view private content
    if (isPrivateContent && isPendingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-[64px] text-amber-600 mb-4">lock</span>
                    <h2 className="text-xl font-bold text-foreground mb-2">Akun Dalam Antrean Verifikasi</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Akun Anda dalam antrean verifikasi. Mohon tunggu persetujuan Admin untuk melihat konten privat.
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        )
    }

    // Block access for guests trying to view private content
    if (isPrivateContent && isGuest) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-[64px] text-red-600 mb-4">lock</span>
                    <h2 className="text-xl font-bold text-foreground mb-2">Konten Privat</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Anda harus login dan terverifikasi untuk melihat konten ini.
                    </p>
                    <Link href="/login" className="inline-block px-6 py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        )
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

            {/* Hide Drive link for guests on private content */}
            {!(isPrivateContent && isGuest) && (
                <div className="flex gap-3">
                    <a
                        href={`https://drive.google.com/drive/folders/${folder.driveFolderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-cyan-500/25"
                    >
                        <span className="material-symbols-outlined text-[20px]">folder_open</span>
                        Open in Drive
                    </a>
                </div>
            )}

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
                                    loading="lazy"
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
