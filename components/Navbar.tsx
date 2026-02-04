"use client"

import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import { auth } from "@/lib/firebase"

export function Navbar() {
    const { user, userData } = useAuth();
    const { appName, appLogo } = useSettings();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    {appLogo ? (
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                            <Image src={appLogo} alt="Logo" fill className="object-cover" />
                        </div>
                    ) : (
                        <span className="material-symbols-outlined filled">gallery_thumbnail</span>
                    )}
                    <span className="text-foreground tracking-tight">{appName}</span>
                </Link>

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
                                <Link href="/admin" className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => auth.signOut()}
                                className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-cyan-600 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
