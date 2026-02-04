"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password)
            } else {
                await signInWithEmailAndPassword(auth, email, password)
            }
            router.push("/")
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {isRegistering ? "Create Account" : "Termasuk Area"}
                    </h1>
                    <p className="text-gray-500">
                        {isRegistering ? "Join the enterprise hub" : "Access internal documentation"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
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

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 mt-2"
                    >
                        {isRegistering ? "Sign Up" : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-primary font-bold hover:underline"
                    >
                        {isRegistering ? "Sign In" : "Register"}
                    </button>
                </div>
            </div>
        </div>
    )
}
