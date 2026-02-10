"use client"

import { showSuccess, showError } from "@/lib/sweetalert"
import { AdminSidebar } from "@/components/AdminSidebar"
import { useSettings } from "@/context/SettingsContext"

export default function SettingsPage() {
    const { appName, appLogo, heroHeadline, heroSubline, faviconUrl, browserTitle, footerText, googleDriveApiKey, updateSettings } = useSettings();

    // Local state for inputs
    const [nameInput, setNameInput] = useState(appName);
    const [logoInput, setLogoInput] = useState(appLogo);
    const [heroHeadlineInput, setHeroHeadlineInput] = useState(heroHeadline);
    const [heroSublineInput, setHeroSublineInput] = useState(heroSubline);
    const [faviconInput, setFaviconInput] = useState(faviconUrl);
    const [browserTitleInput, setBrowserTitleInput] = useState(browserTitle);
    const [footerTextInput, setFooterTextInput] = useState(footerText);

    // Other settings
    const [profileName, setProfileName] = useState("Admin User");
    const [profileImage, setProfileImage] = useState("");
    const [publicRegistration, setPublicRegistration] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(googleDriveApiKey || "");

    // Sync local state when context changes
    useEffect(() => {
        setNameInput(appName);
        setLogoInput(appLogo);
        setHeroHeadlineInput(heroHeadline);
        setHeroSublineInput(heroSubline);
        setFaviconInput(faviconUrl);
        setBrowserTitleInput(browserTitle);
        setFooterTextInput(footerText);
        setApiKeyInput(googleDriveApiKey || "");
    }, [appName, appLogo, heroHeadline, heroSubline, faviconUrl, browserTitle, footerText, googleDriveApiKey]);

    const handleSaveGlobalRender = async () => {
        try {
            await updateSettings(nameInput, logoInput, heroHeadlineInput, heroSublineInput, faviconInput, browserTitleInput, footerTextInput, apiKeyInput);
            await showSuccess('Your changes have been successfully updated.', 'Settings Saved');
        } catch (error) {
            await showError('Failed to save settings.');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />

            <div className="lg:pl-64 transition-all duration-300">
                <div className="p-8 max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                        <p className="text-gray-500">Manage system configurations and profile.</p>
                    </header>

                    <div className="space-y-6">
                        {/* Web Customization Section */}
                        <div className="p-6 rounded-xl border border-border bg-surface shadow-sm">
                            <h2 className="text-lg font-bold text-foreground mb-4">Web Customization</h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Web Name</label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Web Logo URL</label>
                                    <input
                                        type="text"
                                        value={logoInput}
                                        onChange={(e) => setLogoInput(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Favicon URL</label>
                                    <input
                                        type="text"
                                        value={faviconInput}
                                        onChange={(e) => setFaviconInput(e.target.value)}
                                        placeholder="https://example.com/favicon.ico"
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                    <p className="text-xs text-gray-400">Icon shown in browser tab</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Browser Tab Title</label>
                                    <input
                                        type="text"
                                        value={browserTitleInput}
                                        onChange={(e) => setBrowserTitleInput(e.target.value)}
                                        placeholder="My Gallery Site"
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                    <p className="text-xs text-gray-400">Title shown in browser tab</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer Text</label>
                                    <input
                                        type="text"
                                        value={footerTextInput}
                                        onChange={(e) => setFooterTextInput(e.target.value)}
                                        placeholder="© 2024 Your Company. All rights reserved."
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                    <p className="text-xs text-gray-400">Custom footer text (leave empty for default)</p>
                                </div>
                                <button onClick={handleSaveGlobalRender} className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-lg transition-colors">
                                    Update Identity
                                </button>
                            </div>

                            <hr className="border-border my-6" />

                            <h2 className="text-lg font-bold text-foreground mb-4">Hero Section</h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hero Headline</label>
                                    <input
                                        type="text"
                                        value={heroHeadlineInput}
                                        onChange={(e) => setHeroHeadlineInput(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hero Sub-headline</label>
                                    <textarea
                                        value={heroSublineInput}
                                        onChange={(e) => setHeroSublineInput(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                                <button onClick={handleSaveGlobalRender} className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-lg transition-colors">
                                    Update Hero
                                </button>
                            </div>
                        </div>

                        {/* Admin Profile Section */}
                        <div className="p-6 rounded-xl border border-border bg-surface shadow-sm">
                            <h2 className="text-lg font-bold text-foreground mb-4">Admin Profile</h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Avatar URL</label>
                                    <input
                                        type="text"
                                        value={profileImage}
                                        onChange={(e) => setProfileImage(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* System Configuration Section */}
                        <div className="p-6 rounded-xl border border-border bg-surface shadow-sm">
                            <h2 className="text-lg font-bold text-foreground mb-4">System Configuration</h2>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-medium text-foreground">Public Registration</h3>
                                    <p className="text-sm text-gray-500">Allow new users to sign up.</p>
                                </div>
                                <button
                                    onClick={() => setPublicRegistration(!publicRegistration)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${publicRegistration ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${publicRegistration ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>

                            <hr className="border-border my-6" />

                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-foreground">API Configuration</h3>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Drive API Key</label>
                                        <input
                                            type="password"
                                            value={apiKeyInput}
                                            onChange={(e) => setApiKeyInput(e.target.value)}
                                            placeholder="AIza..."
                                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                        />
                                        <p className="text-xs text-gray-400">Required for Auto-Thumbnail feature. Restrict this key to your domain in Google Cloud Console.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={handleSaveGlobalRender} className="px-6 py-2 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/25">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
}
