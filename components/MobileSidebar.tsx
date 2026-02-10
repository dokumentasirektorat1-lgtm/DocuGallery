"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, userData } = useAuth()

    const links = [
        { name: "Project Manager", icon: "folder_managed", href: "/admin" },
        { name: "Access Requests", icon: "how_to_reg", href: "/admin/requests" },
        { name: "Settings", icon: "settings", href: "/admin/settings" },
    ]

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push("/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    // Get user display info
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin'
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AD'

    if (!isOpen) return null

    return (
        <>
            {/* Full Screen Sidebar - Solid Background (NO Transparency) */}
            <aside
                className={cn(
                    "fixed inset-0 w-full h-full bg-white dark:bg-gray-900 z-[9999] lg:hidden",
                    "flex flex-col",
                    "transition-all duration-300 ease-in-out",
                    isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                )}
            >
                {/* Header with Logo & Close */}
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    {/* Logo Section - Same as Desktop */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                            <span className="material-symbols-outlined text-white text-[24px] font-bold">dashboard</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
                            <p className="text-xs text-muted">Management System</p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-hover rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Close menu"
                    >
                        <span className="material-symbols-outlined text-foreground text-[24px]">close</span>
                    </button>
                </div>

                {/* Navigation - Top Aligned */}
                <nav className="flex-none px-6 py-6 space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group min-h-[48px]",
                                pathname === link.href
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-[22px] transition-transform group-hover:scale-110",
                                pathname === link.href ? "text-white" : "text-primary"
                            )}>
                                {link.icon}
                            </span>
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Spacer to push user info down */}
                <div className="flex-1"></div>

                {/* User Info & Logout - Desktop Style, Pinned Lower */}
                <div className="flex-shrink-0 p-6 pb-[15vh]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{displayName}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{userData?.role || 'Admin'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
