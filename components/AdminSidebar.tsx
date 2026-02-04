"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { name: "Project Manager", icon: "folder_managed", href: "/admin" },
        { name: "Access Requests", icon: "how_to_reg", href: "/admin/requests" },
        { name: "Settings", icon: "settings", href: "/admin/settings" },
    ]

    return (
        <aside className="w-64 fixed left-0 top-16 bottom-0 border-r border-border bg-background z-40 hidden lg:block p-6">
            <div className="mb-8 px-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Panel</h2>
            </div>

            <nav className="space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-[20px]",
                                isActive ? "text-primary" : "text-slate-600 dark:text-slate-300"
                            )}>{link.icon}</span>
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">Admin</p>
                    </div>
                    <button className="text-gray-400 hover:text-foreground">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}
