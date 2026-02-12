"use client"

interface StatCardProps {
    icon: string
    label: string
    value: number
    bgColor: string
    iconColor: string
}

function StatCard({ icon, label, value, bgColor, iconColor }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-surface p-6 rounded-xl border border-border dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <div className={`p-3 ${bgColor} rounded-lg ${iconColor} mr-4 flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                </div>
            </div>
        </div>
    )
}

interface DashboardStatsProps {
    totalItems: number
    completedProjects: number
    inReview: number
}

export function DashboardStats({ totalItems, completedProjects, inReview }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                icon="folder"
                label="Total Items"
                value={totalItems}
                bgColor="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-primary"
            />
            <StatCard
                icon="check_circle"
                label="Completed Projects"
                value={completedProjects}
                bgColor="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600 dark:text-green-400"
            />
            <StatCard
                icon="hourglass_empty"
                label="In Review"
                value={inReview}
                bgColor="bg-yellow-100 dark:bg-yellow-900/30"
                iconColor="text-yellow-600 dark:text-yellow-400"
            />
        </div>
    )
}
