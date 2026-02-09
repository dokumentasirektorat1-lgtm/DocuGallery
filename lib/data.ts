export interface MediaFolder {
    id: string;
    title: string;
    date: string;
    location: string;
    category: "Event" | "Project" | "Trip" | "Other";
    thumbnailUrl: string;
    driveFolderId: string;
    isPrivate: boolean;
    status?: "Synced" | "Indexing" | "Error";
    contentType?: "drive" | "facebook"; // Platform type
    postType?: "post" | "video"; // For Facebook content
    createdAt?: any; // Firestore Timestamp - when first created
    updatedAt?: any; // Firestore Timestamp - last modified
}

export const folders: MediaFolder[] = [
    {
        id: "1",
        title: "Future Vision Summit 2026",
        date: "2026-03-15",
        location: "Tokyo, Japan",
        category: "Event",
        thumbnailUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
        driveFolderId: "folder_2026",
        isPrivate: false,
        status: "Synced"
    },
    {
        id: "2",
        title: "Eco-Hub Launch 2025",
        date: "2025-06-20",
        location: "Berlin, Germany",
        category: "Project",
        thumbnailUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?q=80&w=2013&auto=format&fit=crop",
        driveFolderId: "folder_2025",
        isPrivate: true,
        status: "Synced"
    },
    {
        id: "3",
        title: "Annual Retreat 2024",
        date: "2024-09-10",
        location: "Bali, Indonesia",
        category: "Trip",
        thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop",
        driveFolderId: "folder_2024",
        isPrivate: false,
        status: "Synced"
    },
    {
        id: "4",
        title: "Q1 Financial Report 2023",
        date: "2023-01-15",
        location: "New York, USA",
        category: "Other",
        thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2026&auto=format&fit=crop",
        driveFolderId: "folder_2023",
        isPrivate: true,
        status: "Synced"
    },
    {
        id: "5",
        title: "Prototype Testing 2022",
        date: "2022-11-05",
        location: "Austin, Texas",
        category: "Project",
        thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
        driveFolderId: "folder_2022",
        isPrivate: true,
        status: "Synced"
    }
];

export interface DummyUser {
    id: string;
    email: string;
    role: "admin" | "user";
    status: "pending" | "approved" | "rejected";
}

export const dummyUsers: DummyUser[] = [
    {
        id: "user_a",
        email: "pending_user@example.com",
        role: "user",
        status: "pending"
    },
    {
        id: "user_b",
        email: "approved_user@example.com",
        role: "user",
        status: "approved"
    },
    {
        id: "user_c",
        email: "rejected_user@example.com",
        role: "user",
        status: "rejected"
    }
];
