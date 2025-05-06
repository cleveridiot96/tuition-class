
import React, { useState, useEffect, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

interface AutoClearingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  defaultClearing?: boolean;
  onValueChange?: (value: string) => void;
}

const AutoClearingInput: React.FC<AutoClearingInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  defaultClearing = true,
  onValueChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string | number | readonly string[] | undefined>(value);
  const [wasFocused, setWasFocused] = useState(false);

  // Update internal state when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setWasFocused(true);
    
    // Clear the field if it's a default value (like 0)
    if (defaultClearing && (e.target.value === "0" || e.target.value === "0.00" || String(e.target.value) === "0")) {
      setInternalValue("");
      
      // If we have a controlled input with onChange handler
      if (onChange) {
        const event = {
          ...e,
          target: {
            ...e.target,
            value: ""
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      
      // If we're using the callback pattern
      if (onValueChange) {
        onValueChange("");
      }
    }
    
    // Call the original onFocus if provided
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If the field was emptied and then left empty, restore the default value of "0"
    if (wasFocused && (e.target.value === "" || e.target.value === undefined)) {
      setInternalValue("0");
      
      // If we have a controlled input with onChange handler
      if (onChange) {
        const event = {
          ...e,
          target: {
            ...e.target,
            value: "0"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      
      // If we're using the callback pattern
      if (onValueChange) {
        onValueChange("0");
      }
    }
    
    setWasFocused(false);
    
    // Call the original onBlur if provided
    if (onBlur) onBlur(e);
  };

  return (
    <Input
      {...props}
      value={internalValue}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default AutoClearingInput;
