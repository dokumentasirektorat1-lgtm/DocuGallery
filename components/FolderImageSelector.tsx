"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { GOOGLE_DRIVE_API_KEY, DRIVE_API_BASE } from "@/lib/driveConfig"

interface DriveImage {
    id: string
    name: string
    thumbnailLink?: string
}

interface FolderImageSelectorProps {
    folderId: string
    isOpen: boolean
    onClose: () => void
    onSelect: (imageUrl: string) => void
}

export function FolderImageSelector({ folderId, isOpen, onClose, onSelect }: FolderImageSelectorProps) {
    const [images, setImages] = useState<DriveImage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && folderId) {
            fetchImages()
        }
    }, [isOpen, folderId])

    const fetchImages = async () => {
        if (!folderId) {
            setError("No folder ID provided")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const query = `'${folderId}' in parents and mimeType contains 'image/'`
            const fields = "files(id,name,thumbnailLink)"
            const apiUrl = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=${fields}&key=${GOOGLE_DRIVE_API_KEY}&pageSize=50&orderBy=createdTime desc`

            console.log('🔍 Fetching folder images:', folderId)

            const response = await fetch(apiUrl)

            if (!response.ok) {
                throw new Error(`Drive API error: ${response.status}`)
            }

            const data = await response.json()

            if (data.files && data.files.length > 0) {
                setImages(data.files)
                console.log(`✅ Found ${data.files.length} images`)
            } else {
                setError("No images found in this folder")
            }
        } catch (err: any) {
            console.error('❌ Error fetching images:', err)
            setError(err.message || "Failed to load images")
        } finally {
            setLoading(false)
        }
    }

    const handleSelectImage = (image: DriveImage) => {
        setSelectedImageId(image.id)
        // Generate thumbnail URL (Quota efficient format)
        const thumbnailUrl = `https://lh3.googleusercontent.com/d/${image.id}`
        onSelect(thumbnailUrl)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-[95%] max-w-4xl max-h-[80vh] overflow-y-auto bg-background rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-background">
                    <h3 className="text-lg font-bold">Select Image from Folder</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-gray-500">Loading images from folder...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <span className="material-symbols-outlined text-[48px] text-red-500 mb-4">error</span>
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={fetchImages}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image) => (
                                <button
                                    key={image.id}
                                    onClick={() => handleSelectImage(image)}
                                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageId === image.id
                                        ? "border-primary shadow-lg scale-105"
                                        : "border-border hover:border-primary/50 hover:scale-105"
                                        }`}
                                >
                                    {image.thumbnailLink ? (
                                        <Image
                                            src={image.thumbnailLink}
                                            alt={image.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[40px] text-gray-400">image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs text-white truncate">{image.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
