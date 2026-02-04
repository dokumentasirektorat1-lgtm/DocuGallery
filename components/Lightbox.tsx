"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

interface LightboxProps {
    isOpen: boolean
    onClose: () => void
    src: string
    alt: string
}

export function Lightbox({ isOpen, onClose, src, alt }: LightboxProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
                <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl h-[80vh]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    )
}
