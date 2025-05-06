
import React from "react";
import { Input, InputProps } from "@/components/ui/input";

interface NumericInputProps extends Omit<InputProps, "onChange"> {
  value: number | string;
  onChange: (value: number) => void;
  allowNegative?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  className?: string;
}

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, allowNegative = false, min, max, step = "any", className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Allow empty input (will be converted to 0 or min value later)
      if (newValue === "") {
        onChange(min !== undefined ? min : 0);
        return;
      }
      
      // Parse the value as a number
      const numValue = parseFloat(newValue);
      
      // Check if it's a valid number
      if (isNaN(numValue)) {
        return;
      }
      
      // Apply min/max constraints
      let finalValue = numValue;
      
      if (min !== undefined && finalValue < min) {
        finalValue = min;
      }
      
      if (max !== undefined && finalValue > max) {
        finalValue = max;
      }
      
      // Check if negative values are allowed
      if (!allowNegative && finalValue < 0) {
        finalValue = 0;
      }
      
      onChange(finalValue);
    };

    // Ensure value is always a valid string for the input
    const inputValue = value === null || value === undefined ? "" : value.toString();

    return (
      <Input
        ref={ref}
        type="number"
        value={inputValue}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
        className={className}
        {...props}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";
