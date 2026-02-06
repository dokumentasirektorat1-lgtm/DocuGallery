"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { showErrorToast } from "@/lib/toast"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, userData, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                showErrorToast("Please login to access admin panel")
                router.push("/login")
            } else if (userData?.role !== "admin") {
                showErrorToast("Admin access required")
                router.push("/")
            }
        }
    }, [user, userData, loading, router])

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying access...</p>
                </div>
            </div>
        )
    }

    // Don't render if not authorized
    if (!user || userData?.role !== "admin") {
        return null
    }

    return <>{children}</>
}
