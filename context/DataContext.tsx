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

interface DataContextType {
    projects: MediaFolder[];
    users: DummyUser[];
    addProject: (project: Omit<MediaFolder, "id">) => Promise<void>;
    updateProject: (id: string, data: Partial<MediaFolder>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    updateUserStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    projects: [],
    users: [],
    addProject: async () => { },
    updateProject: async () => { },
    deleteProject: async () => { },
    updateUserStatus: async () => { },
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
            const loadedProjects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as MediaFolder));
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
        await addDoc(collection(db, "projects"), data);
    };

    const updateProject = async (id: string, data: Partial<MediaFolder>) => {
        const docRef = doc(db, "projects", id);
        await updateDoc(docRef, data);
    };

    const deleteProject = async (id: string) => {
        await deleteDoc(doc(db, "projects", id));
    };

    const updateUserStatus = async (id: string, status: "approved" | "rejected") => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, { status });
    }

    if (!isInitialized) return null; // Prevent hydration mismatch

    return (
        <DataContext.Provider value={{ projects, users, addProject, updateProject, deleteProject, updateUserStatus }}>
            {children}
        </DataContext.Provider>
    );
}
