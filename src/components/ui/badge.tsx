import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Badge({ className = "", children, ...props }: BadgeProps) {
return (
<div
className={"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/80 " + className}
{...props}
>
{children}
</div>
)
}
