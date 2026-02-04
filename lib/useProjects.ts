"use client"

import { useData } from "@/context/DataContext"

export function useProjects() {
    const { projects, addProject, updateProject, deleteProject } = useData()

    // Directly return data from context to ensure single source of truth
    // Loading state is handled by DataContext internally (isInitialized), 
    // but for hook compatibility we can set loading false if projects exist or if init is done.
    // Assuming access to page happens after layout hydration.

    return {
        projects,
        loading: false, // Context data is instant after initial load
        addProject,
        updateProject,
        deleteProject
    }
}
