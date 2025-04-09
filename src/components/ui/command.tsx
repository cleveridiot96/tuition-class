
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

/**
 * Safely converts React children to an array with comprehensive error handling
 * Returns an empty array if children are invalid instead of throwing an error
 */
export const safeChildrenToArray = (children: React.ReactNode): React.ReactNode[] => {
  // Handle null/undefined case early
  if (children === undefined || children === null) {
    return [];
  }
  
  try {
    // Use React's built-in method to safely convert children to array
    const result = React.Children.toArray(children);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Failed to convert children to array:", error);
    return [];
  }
};

/**
 * Silent error boundary with detailed internal logging but user-friendly fallback
 */
class CommandErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; componentName: string }) {
    super(props);
    this.state = { 
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error with detailed component context - but only internally
    console.error(
      `Command component error in ${this.props.componentName}:`, 
      error,
      '\nComponent Stack:', 
      errorInfo.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      // Render a silent fallback UI without explicit error messages
      return (
        <div className="p-2 text-sm text-muted-foreground">
          No options available
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Command component with error boundary
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <CommandErrorBoundary componentName="Command">
      <CommandPrimitive
        ref={ref}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className
        )}
        {...props}
      />
    </CommandErrorBoundary>
  );
});

Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <CommandErrorBoundary componentName="CommandDialog">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            {children}
          </Command>
        </CommandErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

// Safe input with silent error handling
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <CommandErrorBoundary componentName="CommandInput">
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  </CommandErrorBoundary>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

// Safe list with error handling
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandErrorBoundary componentName="CommandList">
    <CommandPrimitive.List
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  </CommandErrorBoundary>
));

CommandList.displayName = CommandPrimitive.List.displayName;

// Safe empty state with error handling
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandErrorBoundary componentName="CommandEmpty">
    <CommandPrimitive.Empty
      ref={ref}
      className="py-6 text-center text-sm"
      {...props}
    />
  </CommandErrorBoundary>
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

/**
 * Completely rebuilt CommandGroup with ultra-safe child processing and fallback UI.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, children, ...props }, ref) => {
  // Ultra-safe processing of children with silent failure handling
  const processedChildren = React.useMemo(() => {
    try {
      // Handle null/undefined case early with fallback UI
      if (children === null || children === undefined) {
        return (
          <div className="py-2 px-2 text-sm text-muted-foreground">
            No options available
          </div>
        );
      }
      
      // Safe conversion to array with silent fallback
      const childArray = safeChildrenToArray(children);
      
      if (childArray.length === 0) {
        return (
          <div className="py-2 px-2 text-sm text-muted-foreground">
            No options available
          </div>
        );
      }
      
      // Pre-check each child before returning the array
      return childArray.filter(child => child !== null && child !== undefined);
      
    } catch (error) {
      console.error("Error processing CommandGroup children:", error);
      // Return fallback UI without exposing error
      return (
        <div className="py-2 px-2 text-sm text-muted-foreground">
          No options available
        </div>
      );
    }
  }, [children]);

  // Skip rendering if no valid children and return silent fallback UI
  const hasValidChildren = Array.isArray(processedChildren) && processedChildren.length > 0;
  
  if (!hasValidChildren && !React.isValidElement(processedChildren)) {
    return (
      <div className="py-2 px-2 text-sm text-muted-foreground">
        No options available
      </div>
    );
  }

  return (
    <CommandErrorBoundary componentName="CommandGroup">
      <CommandPrimitive.Group
        ref={ref}
        className={cn(
          "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {processedChildren}
      </CommandPrimitive.Group>
    </CommandErrorBoundary>
  );
});

CommandGroup.displayName = CommandPrimitive.Group.displayName;

// Safe separator with error handling
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandErrorBoundary componentName="CommandSeparator">
    <CommandPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  </CommandErrorBoundary>
));

CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

/**
 * Enhanced CommandItem with safe callback handling
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => {
  // Create safe props with error-protected callbacks
  const safeProps = React.useMemo(() => {
    try {
      // Create a safe onSelect handler that won't crash the application
      const safeOnSelect = props.onSelect ? (value: string) => {
        try {
          props.onSelect?.(value);
        } catch (error) {
          console.error("Error in CommandItem onSelect handler:", error);
        }
      } : undefined;
      
      return {
        ...props,
        onSelect: safeOnSelect
      };
    } catch (error) {
      console.error("Error preparing CommandItem props:", error);
      return { ...props };
    }
  }, [props]);

  return (
    <CommandErrorBoundary componentName="CommandItem">
      <CommandPrimitive.Item
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled='true']:pointer-events-none data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground data-[disabled='true']:opacity-50",
          className
        )}
        {...safeProps}
      />
    </CommandErrorBoundary>
  );
});

CommandItem.displayName = CommandPrimitive.Item.displayName;

// Simple component
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandErrorBoundary,
};
