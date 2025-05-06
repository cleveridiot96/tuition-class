
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return <Controller {...props} />;
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    optional?: boolean;
  }
>(({ className, optional, children, ...props }, ref) => {
  const formContext = useFormContext();
  const { formState } = formContext || {};
  const errors = formState?.errors;

  return (
    <Label
      ref={ref}
      className={cn(errors && "text-destructive", className)}
      {...props}
    >
      {children}
      {optional && <span className="text-muted-foreground ml-1">(Optional)</span>}
    </Label>
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const formContext = useFormContext();
  const { formState } = formContext || {};
  const errors = formState?.errors;
  const formId = formContext?.formState?.defaultValues?.id || "form";

  return (
    <Slot
      ref={ref}
      id={formId}
      aria-describedby={
        errors
          ? `${formId}-error`
          : `${formId}-description`
      }
      aria-invalid={!!errors}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const formContext = useFormContext();
  const formId = formContext?.formState?.defaultValues?.id || "form";

  return (
    <p
      ref={ref}
      id={`${formId}-description`}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const formContext = useFormContext();
  const { formState } = formContext || {};
  const errors = formState?.errors;
  const formId = formContext?.formState?.defaultValues?.id || "form";
  const body = errors ? String(errors?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={`${formId}-error`}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

const FormRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    columns?: number
  }
>(({ className, columns = 2, ...props }, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn(
        "grid gap-4", 
        columns === 1 ? "grid-cols-1" : 
        columns === 2 ? "grid-cols-1 md:grid-cols-2" :
        columns === 3 ? "grid-cols-1 md:grid-cols-3" :
        "grid-cols-1 md:grid-cols-4",
        className
      )} 
      {...props} 
    />
  );
});
FormRow.displayName = "FormRow";

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormRow,
};
