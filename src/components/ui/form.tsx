
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// Enhanced version to handle null context and edge cases
const useFormField = () => {
  // Get contexts but don't destructure immediately to allow null checks
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  
  // Create safe defaults that work without any context
  const defaultValues = {
    id: itemContext?.id || "",
    name: fieldContext?.name || "",
    formItemId: itemContext?.id ? `${itemContext.id}-form-item` : "",
    formDescriptionId: itemContext?.id ? `${itemContext.id}-form-item-description` : "",
    formMessageId: itemContext?.id ? `${itemContext.id}-form-item-message` : "",
    isLoading: false,
    isDirty: false,
    isValid: false,
    isSubmitted: false,
    isTouched: false,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValidating: false,
    error: undefined,
  };
  
  // If missing field context and we're in development, log a warning
  if (!fieldContext) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("useFormField should be used within <FormField>");
    }
    return defaultValues;
  }
  
  // Get form context - might be null if used outside FormProvider
  const formContext = useFormContext();
  
  // If no form context available, return safe defaults that don't cause crashes
  if (!formContext) {
    return defaultValues;
  }
  
  // Safely extract needed properties from form context with null checks at each step
  try {
    const { getFieldState, formState } = formContext;
    
    // Only call getFieldState if it's a function and formState exists
    const fieldState = typeof getFieldState === 'function' && formState
      ? getFieldState(fieldContext.name, formState)
      : { error: undefined, isDirty: false, isTouched: false };
    
    // Extract id safely
    const { id } = itemContext || { id: "" };
    
    // Return combined state
    return {
      id,
      name: fieldContext.name,
      formItemId: id ? `${id}-form-item` : "",
      formDescriptionId: id ? `${id}-form-item-description` : "",
      formMessageId: id ? `${id}-form-item-message` : "",
      ...fieldState,
      ...(formState && {
        isLoading: formState.isLoading || false,
        isSubmitted: formState.isSubmitted || false,
        isSubmitting: formState.isSubmitting || false,
        isSubmitSuccessful: formState.isSubmitSuccessful || false,
        isValidating: formState.isValidating || false,
        isValid: formState.isValid || false,
      }),
    };
  } catch (error) {
    // If any exceptions occur during extraction, fail gracefully
    console.error("Error in useFormField:", error);
    return defaultValues;
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    optional?: boolean;
  }
>(({ className, children, optional, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {optional && <span className="ml-1 text-muted-foreground text-xs">(Optional)</span>}
    </Label>
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

// Extra form helper components
const FormRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    columns?: number;
  }
>(({ className, columns = 2, children, ...props }, ref) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  }[columns as 1 | 2 | 3 | 4] || "grid-cols-1 md:grid-cols-2";

  return (
    <div 
      ref={ref}
      className={cn(`grid ${columnClasses} gap-4`, className)} 
      {...props}
    >
      {children}
    </div>
  );
});
FormRow.displayName = "FormRow";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormRow,
}
