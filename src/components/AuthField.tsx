import { forwardRef, type InputHTMLAttributes } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    id: string
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
    ({ label, id, className, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                <Label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {label}
                </Label>
                <Input id={id} ref={ref} className={className} {...props} />
            </div>
        )
    }
)

AuthField.displayName = "AuthField"

export default AuthField