import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { PlusCircle, ListChecks, ShieldCheck, ArrowLeft } from "lucide-react"
import { Button, PageHeading, Panel } from "@/components/ui-kit"
import { useAuthStore } from "@/store/authStore"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"
import { ADMIN_SHAPES } from "@/constants/backgroundShapes"



const ADMIN_ACTIONS = [
    {
        to: "/admin/create-event",
        icon: PlusCircle,
        title: "Create event",
        desc: "Add a new show — set the name, date, poster, and section pricing/capacity.",
    },
    {
        to: "/admin/manage-events",
        icon: ListChecks,
        title: "Manage events",
        desc: "Edit or delete existing events, and see remaining inventory at a glance.",
    },
]

const AdminPanel = () => {

    const navigate = useNavigate();


    const email = useAuthStore((s) => s.email)

    return (
        <section className="relative overflow-hidden px-6 py-16 h-[83vh]">
            <AmbientGlow />
            <BackgroundShapes shapes={ADMIN_SHAPES} />

            <div className="relative mx-auto max-w-5xl">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="mb-6 gap-2"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </Button>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Admin</p>
                </div>

                <div className="mt-2">
                    <PageHeading
                        eyebrow=""
                        title="Admin panel"
                        subtitle={`Signed in as ${email ?? "admin"} — manage events across BookTheShow.`}
                    />
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    {ADMIN_ACTIONS.map(({ to, icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={to}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] }}
                            whileHover={{ y: -6, boxShadow: "0 20px 40px -12px var(--color-primary)" }}
                            style={{ boxShadow: "0 0 0 0 transparent" }}
                        >
                            <Link to={to} className="block h-full">
                                <Panel className="flex h-full flex-col gap-4 p-7 transition-colors hover:border-primary/40">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                        <Icon size={22} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                                        <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                </Panel>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AdminPanel