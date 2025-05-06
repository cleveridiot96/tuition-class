
import React from "react";
import { EnhancedSearchableSelect } from './enhanced-searchable-select';
import { SelectOption } from './enhanced-select/types';

interface EnhancedSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  masterType?: string;
}

export { EnhancedSearchableSelect } from './enhanced-searchable-select';

// Export the types for easy access
export type { SelectOption } from './enhanced-select/types';
export type { EnhancedSearchableSelectProps } from './enhanced-select/types';
