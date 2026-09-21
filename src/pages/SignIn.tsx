import { useState, type SubmitEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { signin } from "@/lib/api"
import { Button, Panel } from "@/components/ui-kit"
import AuthField from "@/components/AuthField"
import PasswordField from "@/components/PasswordField"
import { useToast } from "@/components/Toast"

import { withMinDelay } from "@/lib/utils"
import TopProgressBar from "@/components/TopProgressBar"
import BackgroundShapes from "@/components/BackgroundShapes"
import { useAuthStore } from "@/store/authStore"

const SIGNIN_SHAPES = [
    { type: "circle" as const, size: 110, top: "-6%", left: "8%", delay: 0, duration: 9 },
    { type: "square" as const, size: 48, bottom: "12%", right: "10%", delay: 1.2, duration: 10 },
]

const SignIn = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { login } = useAuthStore()

    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await withMinDelay(signin(form))
            login(res.data.token, form.email)
            showToast("Signed in successfully", "success")
            navigate("/")
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Invalid email or password."
                : "Invalid email or password."
            setError(message)
            showToast(message, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TopProgressBar loading={loading} />

            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
                <BackgroundShapes shapes={SIGNIN_SHAPES} />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-md"
                >
                    <Panel className="p-8">
                        <Link to="/" className="inline-block font-sans text-2xl tracking-wide">
                            BOOKTHESHOW<span className="text-primary">.</span>
                        </Link>

                        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-primary">Welcome back</p>
                        <h1 className="mt-3 font-display text-4xl tracking-wide">Sign in</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Pick up where you left off.</p>

                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                            <AuthField
                                id="email"
                                label="Email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                            />
                            <PasswordField
                                id="password"
                                label="Password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Your password"
                            />

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button type="submit" variant="primary" className="mt-2 w-full" disabled={loading}>
                                {loading ? "Signing in…" : "Sign in"}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </Panel>
                </motion.div>
            </section>
        </>
    )
}

export default SignIn