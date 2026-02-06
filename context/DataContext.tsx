"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MediaFolder, folders as initialProjects, dummyUsers as initialUsers, DummyUser } from "@/lib/data";
import { db } from "@/lib/firebase";
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    getDocs,
    writeBatch
} from "firebase/firestore";
import { generateAutoThumbnail } from "@/lib/autoThumbnail";

interface DataContextType {
    projects: MediaFolder[];
    users: DummyUser[];
    addProject: (project: Omit<MediaFolder, "id">) => Promise<void>;
    updateProject: (id: string, data: Partial<MediaFolder>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    updateUserStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
    updateUser: (id: string, role: "admin" | "user", status: "pending" | "approved" | "rejected") => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    projects: [],
    users: [],
    addProject: async () => { },
    updateProject: async () => { },
    deleteProject: async () => { },
    updateUserStatus: async () => { },
    updateUser: async () => { },
});

export const useData = () => useContext(DataContext);

export function DataProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<MediaFolder[]>([]);
    const [users, setUsers] = useState<DummyUser[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Seeding Logic
    const seedData = async () => {
        try {
            // Check Projects
            const projectsRef = collection(db, "projects");
            const projectsSnapshot = await getDocs(projectsRef);

            if (projectsSnapshot.empty) {
                console.log("Seeding Projects...");
                const batch = writeBatch(db);
                initialProjects.forEach(project => {
                    const docRef = doc(projectsRef); // Generate new ID
                    // Use spread to avoid type issues if ID is in data, but here we let Firestore generate ID
                    const { id, ...data } = project;
                    batch.set(docRef, data);
                });
                await batch.commit();
            }

            // Check Users
            const usersRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersRef);

            if (usersSnapshot.empty) {
                console.log("Seeding Users...");
                const batch = writeBatch(db);
                initialUsers.forEach(user => {
                    const docRef = doc(usersRef);
                    const { id, ...data } = user;
                    batch.set(docRef, data);
                });
                await batch.commit();
            }

        } catch (error) {
            console.error("Error seeding data:", error);
        }
    };

    // Real-time Listeners
    useEffect(() => {
        // Run seeding first
        seedData();

        // Projects Listener
        const qProjects = query(collection(db, "projects"));
        const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            const loadedProjects = snapshot.docs.map(doc => {
                const project = {
                    id: doc.id,
                    ...doc.data()
                } as MediaFolder;

                // Auto-generate thumbnail if missing
                if (!project.thumbnailUrl) {
                    const autoThumb = generateAutoThumbnail(project);
                    if (autoThumb) {
                        project.thumbnailUrl = autoThumb;
                    }
                }

                return project;
            });
            setProjects(loadedProjects);
        });

        // Users Listener
        const qUsers = query(collection(db, "users"));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
            const loadedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as DummyUser));
            setUsers(loadedUsers);
        });

        setIsInitialized(true);

        return () => {
            unsubProjects();
            unsubUsers();
        };
    }, []);

    // Firestore Actions
    const addProject = async (data: Omit<MediaFolder, "id">) => {
        // Validate all fields to prevent undefined errors
        const validatedProject: any = {
            title: data.title || "",
            date: data.date || new Date().toISOString().split('T')[0],
            location: data.location || "",
            category: data.category || "Project",
            thumbnailUrl: data.thumbnailUrl || "",
            driveFolderId: data.driveFolderId || "",
            isPrivate: data.isPrivate ?? false,
            status: data.status || "Synced",
            contentType: data.contentType || "drive",
        };

        // Only add postType if it exists
        if (data.postType) {
            validatedProject.postType = data.postType;
        }

        await addDoc(collection(db, "projects"), validatedProject);
    };

    const updateProject = async (id: string, data: Partial<MediaFolder>) => {
        const docRef = doc(db, "projects", id);

        // Clean data to remove undefined fields
        const cleanData: any = {};
        Object.keys(data).forEach(key => {
            const value = data[key as keyof Partial<MediaFolder>];
            if (value !== undefined) {
                cleanData[key] = value;
            }
        });

        await updateDoc(docRef, cleanData);
    };

    const deleteProject = async (id: string) => {
        await deleteDoc(doc(db, "projects", id));
    };

    const updateUserStatus = async (id: string, status: "approved" | "rejected") => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, { status });
    }

    const updateUser = async (id: string, role: "admin" | "user", status: "pending" | "approved" | "rejected") => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, { role, status });
    }

    if (!isInitialized) return null; // Prevent hydration mismatch

    return (
        <DataContext.Provider value={{ projects, users, addProject, updateProject, deleteProject, updateUserStatus, updateUser }}>
            {children}
        </DataContext.Provider>
    );
}
