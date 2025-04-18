
import React from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AutoClearInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string | number;
  clearValue?: string | number;
  className?: string;
}

export function AutoClearInput({ 
  defaultValue = '0', 
  clearValue = '', 
  className,
  ...props 
}: AutoClearInputProps) {
  const [value, setValue] = React.useState<string | number>(defaultValue);
  const isInitialValue = React.useRef(true);

  React.useEffect(() => {
    if (props.value !== undefined) {
      // Ensure only string or number is set
      setValue(
        typeof props.value === 'string' || typeof props.value === 'number' 
          ? props.value 
          : defaultValue
      );
      isInitialValue.current = String(props.value) === String(defaultValue);
    }
  }, [props.value, defaultValue]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (String(value) === String(defaultValue)) {
      setValue(clearValue);
    }
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '' || String(e.target.value) === String(clearValue)) {
      setValue(defaultValue);
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure only string is set for value
    setValue(String(e.target.value)); 
    isInitialValue.current = false;
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Input
      {...props}
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      className={cn("auto-clear-zero", className)}
    />
  );
}
