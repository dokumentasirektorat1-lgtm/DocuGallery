"use client"

import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useData } from "@/context/DataContext";
import { EditUserModal } from "@/components/EditUserModal";
import { DummyUser } from "@/lib/data";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

export default function AccessRequestsPage() {
    const { users, updateUserStatus, updateUser } = useData();
    const [editingUser, setEditingUser] = useState<DummyUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter for pending users
    const pendingUsers = users.filter(u => u.status === "pending");

    const handleEditUser = (user: DummyUser) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = async (id: string, role: "admin" | "user", status: "pending" | "approved" | "rejected") => {
        try {
            await updateUser(id, role, status);
            showSuccessToast("User updated successfully!");
        } catch (error) {
            showErrorToast("Failed to update user");
        }
    };

    const handlePasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            showSuccessToast(`Password reset email sent to ${email}`);
        } catch (error: any) {
            showErrorToast(error.message);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await updateUserStatus(id, "approved");
            showSuccessToast("User approved!");
        } catch (error) {
            showErrorToast("Failed to approve user");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateUserStatus(id, "rejected");
            showSuccessToast("User rejected");
        } catch (error) {
            showErrorToast("Failed to reject user");
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <AdminSidebar />

                <div className="lg:pl-64 transition-all duration-300">
                    <div className="p-8 max-w-7xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-foreground">Access Requests</h1>
                            <p className="text-gray-500">Review and manage user access requests.</p>
                        </header>

                        <div className="space-y-8">
                            {/* Pending Requests Section */}
                            <div>
                                <h2 className="font-semibold text-lg mb-4">Pending Requests ({pendingUsers.length})</h2>
                                <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {pendingUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-foreground">
                                                        {(user as any).displayName || user.email?.split('@')[0] || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                            Pending
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApprove(user.id)}
                                                                className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50 rounded-lg text-xs font-medium transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(user.id)}
                                                                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 rounded-lg text-xs font-medium transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                        No pending requests
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* All Users Section */}
                            <div>
                                <h2 className="font-semibold text-lg mb-4">All Users ({users.length})</h2>
                                <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-foreground">
                                                        {(user as any).displayName || user.email?.split('@')[0] || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                                            ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "approved"
                                                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                                            : user.status === "rejected"
                                                                ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                                                : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditUser(user)}
                                                                className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-800/50 rounded-lg transition-colors"
                                                                title="Edit user"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handlePasswordReset(user.email)}
                                                                className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-lg transition-colors"
                                                                title="Send password reset"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit User Modal */}
                <EditUserModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                    }}
                    user={editingUser}
                    onSave={handleSaveUser}
                />
            </div>
        </ProtectedRoute>
    );
}
