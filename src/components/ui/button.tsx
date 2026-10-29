import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
({ className = "", children, ...props }, ref) => {
return (
<button
className={"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition " + className}
ref={ref}
{...props}
>
{children}
</button>
)
}
)
Button.displayName = "Button"
