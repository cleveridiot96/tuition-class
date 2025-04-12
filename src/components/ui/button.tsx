
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 android-ripple active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-ag-green to-ag-green-dark text-primary-foreground hover:shadow-md shadow-sm hover:shadow-ag-green/30",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-700 text-destructive-foreground hover:shadow-md shadow-sm hover:shadow-red-500/30",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-ag-green-light",
        secondary:
          "bg-gradient-to-r from-ag-brown-light to-ag-brown text-secondary-foreground hover:shadow-md shadow-sm hover:shadow-ag-brown/30",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow",
        link: "text-primary underline-offset-4 hover:underline",
        danger: "bg-gradient-to-r from-red-600 to-red-800 text-white hover:shadow-lg shadow-sm hover:shadow-red-600/40 hover:from-red-700 hover:to-red-900",
        warning: "bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:shadow-lg shadow-sm hover:shadow-amber-500/40 hover:from-amber-600 hover:to-amber-800",
        success: "bg-gradient-to-r from-green-500 to-green-700 text-white hover:shadow-lg shadow-sm hover:shadow-green-500/40 hover:from-green-600 hover:to-green-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-10 text-base"
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-[bounce_1s_ease-in-out_infinite]",
        wiggle: "hover:animate-[wiggle_.3s_ease-in-out]",
        shine: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-white/20 before:animate-[shine_2s_infinite] before:transform before:skew-x-12",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animation?: "none" | "pulse" | "bounce" | "wiggle" | "shine"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
