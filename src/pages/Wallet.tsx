import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowLeft, Wallet as WalletIcon, Plus } from "lucide-react"
import { getWallet, createWalletOrder, verifyWalletPayment } from "@/lib/api"
import { Button, Panel, PageHeading } from "@/components/ui-kit"
import { useToast } from "@/components/Toast"
import AmbientGlow from "@/components/AmbientGlow"
import BackgroundShapes from "@/components/BackgroundShapes"

declare global {
    interface Window {
        Razorpay: any
    }
}

const QUICK_AMOUNTS = [100, 250, 500, 1000]

const WalletPage = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [balance, setBalance] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState("")
    const [processing, setProcessing] = useState(false)

    const fetchBalance = async () => {
        try {
            const res = await getWallet()
            setBalance(res.data.balance)
        } catch {
            showToast("Couldn't load wallet balance", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBalance()
    }, [])

    const handleRecharge = async () => {
        const amt = Number(amount)
        if (!amt || amt < 10) {
            showToast("Enter at least ₹10", "error")
            return
        }

        setProcessing(true)
        try {
            const orderRes = await createWalletOrder({ amount: amt })
            const { orderId, amount: paise, currency, keyId } = orderRes.data

            const razorpay = new window.Razorpay({
                key: keyId,
                amount: paise,
                currency,
                order_id: orderId,
                name: "BookTheShow Wallet",
                description: `Recharge ₹${amt}`,
                handler: async (response: any) => {
                    try {
                        const verifyRes = await verifyWalletPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: amt,
                        })
                        setBalance(verifyRes.data.balance)
                        setAmount("")
                        showToast(verifyRes.data.message ?? "Wallet recharged!", "success")
                    } catch {
                        showToast("Payment succeeded but wallet update failed — contact support.", "error")
                    } finally {
                        setProcessing(false)
                    }
                },
                modal: { ondismiss: () => setProcessing(false) },
                theme: { color: "#0e7490" },
            })

            razorpay.open()
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Couldn't start recharge."
                : "Couldn't start recharge."
            showToast(message, "error")
            setProcessing(false)
        }
    }

    return (
        <section className="relative overflow-hidden px-6 py-16">
            <AmbientGlow />
            <BackgroundShapes shapes={[{ type: "circle", size: 100, top: "6%", right: "8%", delay: 0, duration: 9 }]} />

            <div className="relative mx-auto max-w-2xl">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
                    <ArrowLeft className="size-4" />
                    Back
                </Button>

                <PageHeading
                    eyebrow="Your account"
                    title="Wallet"
                    subtitle="Used to pay for bookings made through the AI concierge."
                />

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Panel className="mt-8 flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <WalletIcon size={22} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current balance</p>
                                <p className="text-3xl font-semibold text-foreground">
                                    {loading ? "…" : `₹${balance ?? 0}`}
                                </p>
                            </div>
                        </div>
                    </Panel>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Panel className="mt-5 p-6">
                        <p className="text-sm font-semibold text-foreground">Recharge wallet</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {QUICK_AMOUNTS.map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setAmount(String(a))}
                                    className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${amount === String(a)
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:border-primary/40"
                                        }`}
                                >
                                    ₹{a}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-3">
                            <input
                                type="number"
                                min={10}
                                placeholder="Custom amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="flex-1 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                            />
                            <Button
                                variant="primary"
                                onClick={handleRecharge}
                                disabled={processing || !amount}
                                className="shrink-0 gap-2"
                            >
                                <Plus size={16} />
                                {processing ? "Processing…" : "Add money"}
                            </Button>
                        </div>
                    </Panel>
                </motion.div>
            </div>
        </section>
    )
}

export default WalletPage