"use client"

import { useState } from "react"
import { showSuccess, showError, showConfirm } from "@/lib/sweetalert"
import { useAuth } from "@/context/AuthContext"
import { deleteUser } from "firebase/auth"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function UserSettings() {
    const { user, userData } = useAuth();
    const router = useRouter();

    const handleDeleteAccount = async () => {
        const isConfirmed = await showConfirm(
            "Are you sure?",
            "Your account will be permanently deleted. This action cannot be undone.",
            "Yes, delete my account",
            "Cancel"
        );

        if (isConfirmed) {
            try {
                if (user) {
                    // 1. Delete Firestore Document
                    await deleteDoc(doc(db, "users", user.uid));

                    // 2. Delete Auth User (Self-deletion requires recent login)
                    await deleteUser(user);

                    await showSuccess("Your account has been successfully deleted.", "Account Deleted");
                    router.push("/login");
                }
            } catch (error: any) {
                if (error.code === 'auth/requires-recent-login') {
                    await showError("For security reasons, please log out and log in again before deleting your account.", "Requires Recent Login");
                } else {
                    await showError("Failed to delete account. " + error.message);
                }
            }
        }
    }

    if (!user) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-2xl min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="bg-surface border border-border rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">person</span>
                    Profile Information
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                            <p className="font-mono text-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-border">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Role</label>
                            <div className="flex items-center gap-2">
                                <p className="capitalize text-foreground font-medium">{userData?.role || 'User'}</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${userData?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {userData?.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">User ID</label>
                        <p className="font-mono text-xs text-gray-500 break-all">{user.uid}</p>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">warning</span>
                    Danger Zone
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Deleting your account is permanent. All your data and access privileges will be removed immediately. You will need to register again if you wish to use the application.
                </p>
                <div className="flex justify-start">
                    <button
                        onClick={handleDeleteAccount}
                        className="px-5 py-2.5 bg-white dark:bg-red-950 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-red-500/25 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                        Delete My Account
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
                <a href="/" className="hover:text-foreground hover:underline transition-colors">&larr; Back to Home</a>
            </div>
        </div>
    )
}
