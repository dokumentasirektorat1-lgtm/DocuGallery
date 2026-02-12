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
    writeBatch,
    serverTimestamp,
    where
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

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
    const { userData, loading: authLoading } = useAuth();

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

    // Real-time Listeners with Security Guard
    useEffect(() => {
        if (authLoading) return; // Wait until auth is resolved

        // Run seeding first (only if admin or dev - simplified here)
        seedData();

        // Projects Listener - The Security Guard 🛡️
        let qProjects;

        if (userData?.role === 'admin') {
            // Admin sees EVERYTHING
            qProjects = query(collection(db, "projects"));

            // Auto-Backfill Migration for Admin
            // Check if any docs missing accessLevel
            getDocs(qProjects).then(snap => {
                const batch = writeBatch(db);
                let migrationCount = 0;
                snap.docs.forEach(doc => {
                    const d = doc.data();
                    if (!d.accessLevel) {
                        batch.update(doc.ref, {
                            accessLevel: d.isPrivate ? "private" : "public",
                            updatedAt: serverTimestamp()
                        });
                        migrationCount++;
                    }
                });
                if (migrationCount > 0) {
                    console.log(`🛡️ Security Migration: Backfilled ${migrationCount} projects with accessLevel.`);
                    batch.commit();
                }
            });

        } else {
            // User + Guest: Public + Private
            // Guest juga perlu melihat item Private (agar bisa ditampilkan sebagai item terkunci/limited)
            qProjects = query(collection(db, "projects"), where("accessLevel", "in", ["public", "private"]));
        }

        const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            const loadedProjects = snapshot.docs.map(doc => {
                const project = {
                    id: doc.id,
                    ...doc.data()
                } as MediaFolder;

                // Quick thumbnail fallback
                if (!project.thumbnailUrl && project.contentType === 'drive' && project.driveFolderId) {
                    project.thumbnailUrl = `https://drive.google.com/thumbnail?id=${project.driveFolderId}&sz=w600`;
                }

                // 🔒 DATA SANITIZATION (Prevent Link Leaks)
                // Jika user bukan Admin/Approved, sembunyikan link asli folder Private
                const isAuthorized = userData?.role === 'admin' || userData?.status === 'approved';
                if (!isAuthorized && (project.accessLevel === 'private' || project.isPrivate)) {
                    project.driveFolderId = "PROTECTED_CONTENT"; // Obfuscate sensitive ID
                    // Note: thumbnailUrl tetap dibiarkan agar gambar bisa tampil (blur), 
                    // tapi link folder utama diamankan.
                }

                return project;
            });
            setProjects(loadedProjects);
        }, (error) => {
            console.error("Firestore Security Block:", error);
            setProjects([]); // Clear data on security error
        });

        // Users Listener (Admin Only or Self? Simplified for now)
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
    }, [userData, authLoading]);

    // Firestore Actions
    const addProject = async (data: Omit<MediaFolder, "id">) => {
        // Validate all fields to prevent undefined errors
        const validatedProject: any = {
            title: data.title || "",
            date: data.date || new Date().toISOString().split('T')[0],
            location: data.location || "",
            category: data.category || "Project",
            thumbnailUrl: data.thumbnailUrl || (data.driveFolderId ? `https://drive.google.com/thumbnail?id=${data.driveFolderId}&sz=w600` : ""),
            driveFolderId: data.driveFolderId || "",
            isPrivate: data.isPrivate ?? false,
            accessLevel: data.accessLevel || (data.isPrivate ? "private" : "public"),
            status: data.status || "Synced",
            contentType: data.contentType || "drive",
            createdAt: serverTimestamp(), // Set creation timestamp
            updatedAt: serverTimestamp(), // Set initial update timestamp
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
        const cleanData: any = {
            updatedAt: serverTimestamp() // Always set updatedAt on update
        };

        Object.keys(data).forEach(key => {
            const value = data[key as keyof Partial<MediaFolder>];
            if (value !== undefined) {
                cleanData[key] = value;
            }
        });

        // Smart Update Fallback: If Folder ID changes but no thumbnail provided, auto-generate it
        if (data.driveFolderId && !data.thumbnailUrl && !cleanData.thumbnailUrl) {
            cleanData.thumbnailUrl = `https://drive.google.com/thumbnail?id=${data.driveFolderId}&sz=w600`;
        }

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
