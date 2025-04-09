
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
const safeChildrenToArray = (children: React.ReactNode): React.ReactNode[] => {
  // Handle null/undefined case early
  if (children === undefined || children === null) {
    console.log("safeChildrenToArray received null/undefined children");
    return [];
  }
  
  try {
    // Use React's built-in method to safely convert children to array
    return React.Children.toArray(children);
  } catch (error) {
    console.error("Failed to convert children to array:", error);
    return [];
  }
};

/**
 * Error boundary with detailed logging and recovery mechanisms
 */
class CommandErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode; componentName: string }) {
    super(props);
    this.state = { 
      hasError: false, 
      errorMessage: ""
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      errorMessage: error.message || "Unknown error" 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error with detailed component context
    console.error(
      `Command component error in ${this.props.componentName}:`, 
      error,
      '\nComponent Stack:', 
      errorInfo.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI with clear error message
      return (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
          <p className="font-medium">Dropdown error detected</p>
          <p className="text-xs mt-1">{this.state.errorMessage}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded"
          >
            Try to recover
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Command component with error boundary and detailed props logging
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

// Safe input with error boundary
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

// Safe list with error boundary
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

// Safe empty state with error boundary
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
 * Completely rebuilt CommandGroup with deep error handling and data validation.
 * This component safely processes its children with thorough error checks.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, children, ...props }, ref) => {
  // Safe processing of children with extensive error handling and logging
  const processedChildren = React.useMemo(() => {
    try {
      // Handle null/undefined case early
      if (children === null || children === undefined) {
        console.log("CommandGroup received null/undefined children");
        return null;
      }
      
      // Handle single child case directly
      if (React.isValidElement(children)) {
        return children;
      }
      
      // Safe conversion to array with detailed logging
      const childArray = safeChildrenToArray(children);
      
      if (childArray.length === 0) {
        console.log("CommandGroup has empty children array after processing");
        return (
          <div className="py-2 px-2 text-sm text-muted-foreground">
            No items available
          </div>
        );
      }
      
      // Filter out invalid children while maintaining array
      return childArray.filter(child => {
        if (!child) {
          console.warn("CommandGroup detected invalid child item");
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error("Critical error processing CommandGroup children:", error);
      // Return fallback UI in case of error
      return (
        <div className="py-2 px-2 text-sm text-red-500">
          Error loading dropdown items
        </div>
      );
    }
  }, [children]);

  // Skip rendering if all children are invalid and return fallback UI
  if (!processedChildren) {
    return (
      <div className="py-2 px-2 text-sm text-muted-foreground">
        No items available
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

// Safe separator with error boundary
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
 * Enhanced CommandItem with error handling for callbacks and props
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
  safeChildrenToArray,  // Export utility function for reuse
  CommandErrorBoundary, // Export error boundary for reuse
};
