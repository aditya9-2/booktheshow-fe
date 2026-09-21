import { forwardRef, useState, type InputHTMLAttributes } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    id: string
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ label, id, className, ...props }, ref) => {
        const [visible, setVisible] = useState(false)

        return (
            <div className="flex flex-col gap-2">
                <Label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {label}
                </Label>
                <div className="relative">
                    <Input
                        id={id}
                        ref={ref}
                        type={visible ? "text" : "password"}
                        className={`pr-10 ${className ?? ""}`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        tabIndex={-1}
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
        )
    }
)

PasswordField.displayName = "PasswordField"

export default PasswordField