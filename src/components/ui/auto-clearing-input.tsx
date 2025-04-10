
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface AutoClearingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  clearOnFocus?: boolean;
}

const AutoClearingInput = React.forwardRef<HTMLInputElement, AutoClearingInputProps>(
  ({ clearOnFocus = true, value, onChange, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // Clear value if it's "0" or "0.00" or similar
      if (clearOnFocus && 
          typeof value === 'string' && 
          (value === '0' || value === '0.0' || value === '0.00')) {
        
        // Create a synthetic event with empty value to trigger onChange
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: ''
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        if (onChange) {
          onChange(syntheticEvent);
        }
      }
      
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // If the field is empty on blur, reset to "0"
      if (value === '' && onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: '0'
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(syntheticEvent);
      }
      
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

AutoClearingInput.displayName = "AutoClearingInput";

export { AutoClearingInput };
