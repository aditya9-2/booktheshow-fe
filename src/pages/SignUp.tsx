import { useState, type SubmitEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { signup } from "@/lib/api"
import { Button, Panel } from "@/components/ui-kit"
import AuthField from "@/components/AuthField"
import PasswordField from "@/components/PasswordField"
import { useToast } from "@/components/Toast"
import { withMinDelay } from "@/lib/utils"
import TopProgressBar from "@/components/TopProgressBar"
import BackgroundShapes from "@/components/BackgroundShapes"

const SIGNUP_SHAPES = [
    { type: "circle" as const, size: 130, top: "-8%", right: "10%", delay: 0, duration: 10 },
    { type: "square" as const, size: 56, bottom: "10%", left: "6%", delay: 1, duration: 9 },
    { type: "circle" as const, size: 70, bottom: "-6%", right: "20%", delay: 1.5, duration: 8 },
]

const SignUp = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await withMinDelay(signup(form))
            showToast("Account created — sign in to continue", "success")
            navigate("/signin")
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Something went wrong. Try again."
                : "Something went wrong. Try again."
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
                <BackgroundShapes shapes={SIGNUP_SHAPES} />

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

                        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-primary">Get started</p>
                        <h1 className="mt-3 font-display text-4xl tracking-wide">Create your account</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Book shows in seconds, right from the concierge.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                            <AuthField
                                id="name"
                                label="Full name"
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Aditya Basak"
                            />
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
                                minLength={6}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="At least 6 characters"
                            />

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button type="submit" variant="primary" className="mt-2 w-full" disabled={loading}>
                                {loading ? "Creating account…" : "Sign up"}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/signin" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </Panel>
                </motion.div>
            </section>
        </>
    )
}

export default SignUp