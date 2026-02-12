"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { MobileSidebar } from "./MobileSidebar"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import { auth } from "@/lib/firebase"
import { getDirectLink } from "@/lib/utils"

export function Navbar() {
    const { user, userData } = useAuth();
    const { appName, appLogo } = useSettings();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Convert Drive links to direct viewable links
    const displayLogo = getDirectLink(appLogo);

    // Show hamburger menu only for admin AND when in admin pages
    const isAdminPage = pathname?.startsWith('/admin');
    const showHamburger = userData?.role === "admin" && isAdminPage;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu - Admin Only, Admin Pages Only, Mobile Only */}
                    {showHamburger && (
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 min-w-[44px] min-h-[44px] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                            aria-label="Open menu"
                        >
                            <span className="material-symbols-outlined text-[24px]">menu</span>
                        </button>
                    )}

                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        {displayLogo ? (
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                                <Image src={displayLogo} alt="Logo" fill className="object-cover" />
                            </div>
                        ) : (
                            <span className="material-symbols-outlined filled">gallery_thumbnail</span>
                        )}
                        <span className="text-foreground tracking-tight">{appName}</span>
                    </Link>
                </div>

                {/* Static links removed as per request */}

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <div className="text-xs font-bold text-foreground">{user.email?.split('@')[0]}</div>
                                <div className="text-[10px] text-gray-500 uppercase">{userData?.role || "User"}</div>
                            </div>
                            {userData?.role === "admin" && (
                                <Link href="/admin" className="flex px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                            )}
                            <Link href="/settings" className="p-2 min-w-[44px] min-h-[44px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-foreground transition-colors flex items-center justify-center" title="User Settings">
                                <span className="material-symbols-outlined">settings</span>
                            </Link>
                            <button
                                onClick={() => auth.signOut()}
                                className="p-2 min-w-[44px] min-h-[44px] rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center"
                                title="Sign Out"
                                aria-label="Sign Out"
                            >
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="px-4 py-2 min-h-[44px] text-sm font-medium bg-primary text-white hover:bg-cyan-600 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar - Only in Admin Pages */}
            {showHamburger && (
                <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            )}
        </nav>
    )
}
