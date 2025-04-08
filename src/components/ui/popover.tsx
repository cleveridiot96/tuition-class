
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      onOpenAutoFocus={(event) => {
        // Always prevent default focus behavior to avoid issues
        event.preventDefault();
        if (props.onOpenAutoFocus) {
          props.onOpenAutoFocus(event);
        }
      }}
      onCloseAutoFocus={(event) => {
        // Always prevent default focus behavior to avoid issues
        event.preventDefault();
        if (props.onCloseAutoFocus) {
          props.onCloseAutoFocus(event);
        }
      }}
      onEscapeKeyDown={(event) => {
        // Stop propagation to prevent other handlers from interfering
        event.stopPropagation();
        if (props.onEscapeKeyDown) {
          props.onEscapeKeyDown(event);
        }
      }}
      onInteractOutside={(event) => {
        // Handle outside clicks more reliably
        event.preventDefault(); 
        if (props.onInteractOutside) {
          props.onInteractOutside(event);
        }
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
