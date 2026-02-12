"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useData } from "@/context/DataContext"
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
    const { users } = useData()
    const pendingCount = users ? users.filter(u => u.status === "pending").length : 0;

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



    return (
        <>
            {/* Backdrop - Full Coverage */}
            {/* Backdrop - Full Coverage with Fade */}
            <div
                className={cn(
                    "fixed inset-0 w-screen h-screen bg-black/50 z-[9998] lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Full Screen Sidebar - 100% Solid, NO Transparency */}
            <aside
                className={cn(
                    "fixed inset-0 w-screen h-screen bg-white dark:bg-gray-900 z-[9999] lg:hidden",
                    "flex flex-col",
                    "overflow-y-auto overscroll-contain",
                    "transform transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
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

                {/* Navigation - At Top (30-50% of screen) */}
                <nav className="flex-shrink-0 px-6 py-4 space-y-2 bg-white dark:bg-gray-900">
                    <Link
                        href="/admin"
                        onClick={onClose}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group min-h-[48px]",
                            pathname === "/admin"
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <span className={cn(
                            "material-symbols-outlined text-[22px] transition-transform group-hover:scale-110",
                            pathname === "/admin" ? "text-white" : "text-primary"
                        )}>
                            folder_managed
                        </span>
                        <span className="font-medium">Project Manager</span>
                    </Link>

                    <Link
                        href="/admin/requests"
                        onClick={onClose}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group min-h-[48px]",
                            pathname === "/admin/requests"
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-2 w-full">
                            <span className={cn(
                                "material-symbols-outlined text-[22px] transition-transform group-hover:scale-110",
                                pathname === "/admin/requests" ? "text-white" : "text-primary"
                            )}>
                                how_to_reg
                            </span>
                            <span className="font-medium">Access Requests</span>
                            {pendingCount > 0 && (
                                <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/20">
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                    </Link>

                    <Link
                        href="/admin/settings"
                        onClick={onClose}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group min-h-[48px]",
                            pathname === "/admin/settings"
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <span className={cn(
                            "material-symbols-outlined text-[22px] transition-transform group-hover:scale-110",
                            pathname === "/admin/settings" ? "text-white" : "text-primary"
                        )}>
                            settings
                        </span>
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                {/* BIG SPACER - Solid BG, No Transparency (30-60% of screen) */}
                <div className="flex-1 min-h-[30vh] bg-white dark:bg-gray-900"></div>

                {/* User Info & Logout - ABSOLUTE BOTTOM (menempel ke bawah layar) */}
                <div className="flex-shrink-0 p-4 pb-4 border-t border-gray-200 dark:border-gray-800 space-y-3 bg-gray-50 dark:bg-gray-800">
                    {/* User Card - Compact */}
                    <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout Button - Prominent */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-semibold group min-h-[44px] shadow-sm hover:shadow-md"
                        aria-label="Logout"
                    >
                        <span className="material-symbols-outlined text-[18px] group-hover:text-red-600 dark:group-hover:text-red-500">logout</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
