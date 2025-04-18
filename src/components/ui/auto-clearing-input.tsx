
import * as React from "react";
import { Input } from "@/components/ui/input";

interface AutoClearingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export function AutoClearingInput({
  value,
  onValueChange,
  onFocus,
  onBlur,
  ...props
}: AutoClearingInputProps) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
      onValueChange?.('');
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      e.target.value = '0';
      onValueChange?.('0');
    }
    onBlur?.(e);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="auto-clear-zero"
    />
  );
}
