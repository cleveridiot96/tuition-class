
import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassmorphismButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'purple' | 'blue' | 'orange' | 'green';
}

const GlassmorphismButton = React.forwardRef<HTMLButtonElement, GlassmorphismButtonProps>(
  ({ className, variant = 'purple', ...props }, ref) => {
    const baseStyles = "relative overflow-hidden rounded-lg px-4 py-2 font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-lg border border-white/20"
    
    const variantStyles = {
      purple: "bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 hover:shadow-[#9b87f5]/20",
      blue: "bg-[#1EAEDB]/10 text-[#1EAEDB] hover:bg-[#1EAEDB]/20 hover:shadow-[#1EAEDB]/20",
      orange: "bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 hover:shadow-[#F97316]/20",
      green: "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 hover:shadow-[#10B981]/20"
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)

GlassmorphismButton.displayName = "GlassmorphismButton"

export { GlassmorphismButton }
