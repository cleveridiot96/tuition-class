
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "../button"

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {}

export interface SelectTriggerProps extends 
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export interface SelectContentProps extends 
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  searchable?: boolean
}

export interface SelectItemProps extends 
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  asChild?: boolean
}
