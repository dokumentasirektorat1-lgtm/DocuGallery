"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface SettingsContextType {
    appName: string;
    appLogo: string;
    heroHeadline: string;
    heroSubline: string;
    faviconUrl: string;
    browserTitle: string;
    updateSettings: (name: string, logo: string, headline?: string, subline?: string, favicon?: string, title?: string) => void;
}

const SettingsContext = createContext<SettingsContextType>({
    appName: "DocuGallery Hub",
    appLogo: "",
    heroHeadline: "Your Enterprise Knowledge Base & Gallery",
    heroSubline: "Securely access event documentation, project assets, and internal resources from a single unified hub.",
    faviconUrl: "",
    browserTitle: "DocuGallery Hub",
    updateSettings: () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [appName, setAppName] = useState("DocuGallery Hub");
    const [appLogo, setAppLogo] = useState("");
    const [heroHeadline, setHeroHeadline] = useState("Your Enterprise Knowledge Base & Gallery");
    const [heroSubline, setHeroSubline] = useState("Securely access event documentation, project assets, and internal resources from a single unified hub.");
    const [faviconUrl, setFaviconUrl] = useState("");
    const [browserTitle, setBrowserTitle] = useState("DocuGallery Hub");
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from Firestore (Real-time)
    useEffect(() => {
        const docRef = doc(db, "settings", "siteConfig");
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                if (data.appName) setAppName(data.appName);
                if (data.appLogo) setAppLogo(data.appLogo);
                if (data.heroHeadline) setHeroHeadline(data.heroHeadline);
                if (data.heroSubline) setHeroSubline(data.heroSubline);
                if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
                if (data.browserTitle) setBrowserTitle(data.browserTitle);
            }
            setIsInitialized(true);
        });

        return () => unsubscribe();
    }, []);

    const updateSettings = async (name: string, logo: string, headline?: string, subline?: string, favicon?: string, title?: string) => {
        // Optimistic update
        setAppName(name);
        setAppLogo(logo);
        if (headline) setHeroHeadline(headline);
        if (subline) setHeroSubline(subline);
        if (favicon !== undefined) setFaviconUrl(favicon);
        if (title !== undefined) setBrowserTitle(title);

        // Firestore update
        const docRef = doc(db, "settings", "siteConfig");
        await setDoc(docRef, {
            appName: name,
            appLogo: logo,
            heroHeadline: headline || heroHeadline,
            heroSubline: subline || heroSubline,
            faviconUrl: favicon !== undefined ? favicon : faviconUrl,
            browserTitle: title !== undefined ? title : browserTitle
        }, { merge: true });
    };

    return (
        <SettingsContext.Provider value={{ appName, appLogo, heroHeadline, heroSubline, faviconUrl, browserTitle, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
