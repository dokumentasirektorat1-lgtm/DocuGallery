"use client"

import { AdminSidebar } from "@/components/AdminSidebar";
import { useData } from "@/context/DataContext";

export default function AccessRequestsPage() {
    const { users, updateUserStatus } = useData();

    // Filter for pending users directly from context state
    const pendingUsers = users.filter(u => u.status === "pending");

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />

            <div className="lg:pl-64 transition-all duration-300">
                <div className="p-8 max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Access Requests</h1>
                        <p className="text-gray-500">Manage pending user registrations.</p>
                    </header>

                    <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">User ID/Email</th>
                                    <th className="px-6 py-4">Current Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pendingUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No pending requests found.</td>
                                    </tr>
                                )}
                                {pendingUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-foreground">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => updateUserStatus(user.id, "approved")}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateUserStatus(user.id, "rejected")}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
