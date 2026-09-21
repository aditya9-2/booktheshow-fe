
const AmbientGlow = () => {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-130 w-205 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-95 w-95 rounded-full bg-primary/10 blur-3xl" />
        </div>
    )
}

export default AmbientGlow