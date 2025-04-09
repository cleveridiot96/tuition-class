
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Enhanced error boundary with better logging and recovery
class CommandErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName?: string },
  { hasError: boolean; errorInfo: string }
> {
  constructor(props: { children: React.ReactNode; componentName?: string }) {
    super(props);
    this.state = { 
      hasError: false, 
      errorInfo: ""
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced logging with component name and detailed error info
    console.error(
      `Command component error in ${this.props.componentName || 'unknown'}:`, 
      error,
      '\nComponent Stack:', 
      errorInfo.componentStack
    );
    this.setState({
      errorInfo: errorInfo.componentStack || error.message
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          <p className="font-medium">Component Error</p>
          <p className="text-xs mt-1">UI component failed to render</p>
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

// Safe children conversion utility
const safeChildrenToArray = (children: React.ReactNode): React.ReactNode[] => {
  if (children === undefined || children === null) {
    return [];
  }
  
  try {
    return React.Children.toArray(children);
  } catch (error) {
    console.error("Failed to convert children to array:", error);
    return [];
  }
};

// Enhanced Command component with error boundary
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
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
))
Command.displayName = CommandPrimitive.displayName

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
  )
}

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
))

CommandInput.displayName = CommandPrimitive.Input.displayName

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
))

CommandList.displayName = CommandPrimitive.List.displayName

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
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

// Completely rebuilt CommandGroup with deep error handling and validation
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, children, ...props }, ref) => {
  // Enhanced validation and processing of children with detailed logging
  const processedChildren = React.useMemo(() => {
    try {
      // Log initial children state for debugging
      console.log("CommandGroup children type:", typeof children);
      
      // Handle null/undefined case
      if (children == null) {
        console.log("CommandGroup received null/undefined children");
        return null;
      }
      
      // If single child React element, validate and return it
      if (React.isValidElement(children)) {
        return children;
      }
      
      // Safely convert to array with detailed logging
      const childArray = safeChildrenToArray(children);
      console.log("CommandGroup children count:", childArray.length);
      
      if (childArray.length === 0) {
        console.log("CommandGroup has no children after processing");
        return null;
      }
      
      // Check individual children for validity
      const validChildren = childArray.filter(child => {
        if (!child) {
          console.warn("CommandGroup detected invalid child item");
          return false;
        }
        return true;
      });
      
      return validChildren.length > 0 ? validChildren : null;
    } catch (error) {
      console.error("Error processing CommandGroup children:", error);
      return null;
    }
  }, [children]);

  // Explicit fallback for empty or invalid children
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

CommandGroup.displayName = CommandPrimitive.Group.displayName

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
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

// Enhanced CommandItem with better error handling and data attribute alignment
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => {
  const safeProps = React.useMemo(() => {
    try {
      // Create a safe onSelect handler to prevent crashes
      const safeOnSelect = (value: string) => {
        try {
          if (props.onSelect) {
            props.onSelect(value);
          }
        } catch (error) {
          console.error("Error in CommandItem onSelect:", error);
        }
      };
      
      // Return a safe version of props
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
})

CommandItem.displayName = CommandPrimitive.Item.displayName

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
  )
}
CommandShortcut.displayName = "CommandShortcut"

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
}
