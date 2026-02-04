"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
    appName: string;
    appLogo: string;
    updateSettings: (name: string, logo: string) => void;
}

const SettingsContext = createContext<SettingsContextType>({
    appName: "DocuGallery Hub",
    appLogo: "",
    updateSettings: () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [appName, setAppName] = useState("DocuGallery Hub");
    const [appLogo, setAppLogo] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem("dg_appName");
        const savedLogo = localStorage.getItem("dg_appLogo");
        if (savedName) setAppName(savedName);
        if (savedLogo) setAppLogo(savedLogo);
        setIsInitialized(true);
    }, []);

    const updateSettings = (name: string, logo: string) => {
        setAppName(name);
        setAppLogo(logo);
        localStorage.setItem("dg_appName", name);
        localStorage.setItem("dg_appLogo", logo);
    };

    return (
        <SettingsContext.Provider value={{ appName, appLogo, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
