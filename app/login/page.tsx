"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
import { showSuccessToast, showErrorToast } from "@/lib/toast"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("") // NEW: Username field
    const [showPassword, setShowPassword] = useState(false) // NEW: Password visibility toggle
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            if (isRegistering) {
                // Register new user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)

                // Save user profile with username
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    email: userCredential.user.email,
                    displayName: username || email.split('@')[0], // Use username or email prefix
                    role: "user",
                    status: "pending",
                    createdAt: new Date()
                })

                showSuccessToast("Account created! Awaiting admin approval.")
            } else {
                // Login existing user
                await signInWithEmailAndPassword(auth, email, password)
                showSuccessToast("Welcome back!")
            }

            router.push("/")
        } catch (err: any) {
            setError(err.message)
            showErrorToast(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {isRegistering ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-gray-500">
                        {isRegistering ? "Join the enterprise hub" : "Access internal documentation"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    {/* USERNAME FIELD - Only show during registration */}
                    {isRegistering && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="johndoe"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        />
                    </div>

                    {/* PASSWORD WITH VISIBILITY TOGGLE */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 mt-2"
                    >
                        {isRegistering ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            setError("")
                        }}
                        className="text-primary font-bold hover:underline"
                    >
                        {isRegistering ? "Sign In" : "Register"}
                    </button>
                </div>
            </div>
        </div>
    )
}
