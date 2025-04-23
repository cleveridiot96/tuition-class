
import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassmorphismButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'purple' | 'blue' | 'orange' | 'green';
  glowIntensity?: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const GlassmorphismButton = React.forwardRef<HTMLButtonElement, GlassmorphismButtonProps>(
  ({ className, variant = 'purple', glowIntensity = 'medium', size = 'md', animated = true, ...props }, ref) => {
    const baseStyles = "relative overflow-hidden rounded-lg font-medium transition-all duration-300 backdrop-blur-lg border border-white/20 disabled:opacity-50"
    
    const variantStyles = {
      purple: "bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 hover:shadow-[#9b87f5]/20 border-[#9b87f5]/30",
      blue: "bg-[#1EAEDB]/10 text-[#1EAEDB] hover:bg-[#1EAEDB]/20 hover:shadow-[#1EAEDB]/20 border-[#1EAEDB]/30",
      orange: "bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 hover:shadow-[#F97316]/20 border-[#F97316]/30",
      green: "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 hover:shadow-[#10B981]/20 border-[#10B981]/30"
    }

    const glowStyles = {
      low: "hover:shadow-sm",
      medium: "hover:shadow-md",
      high: "hover:shadow-lg"
    }

    const sizeStyles = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    }

    const animatedStyles = animated ? "hover:-translate-y-0.5 active:translate-y-0" : ""

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          glowStyles[glowIntensity],
          sizeStyles[size],
          animatedStyles,
          className
        )}
        {...props}
      />
    )
  }
)

GlassmorphismButton.displayName = "GlassmorphismButton"

export { GlassmorphismButton }
