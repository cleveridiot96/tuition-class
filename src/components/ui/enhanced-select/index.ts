
// Export components explicitly to avoid duplicate export issues
export { EnhancedSelectOption } from './enhanced-select-option';
export { EnhancedSelectSuggestion } from './enhanced-select-suggestion';
export { useEnhancedSelect } from './use-enhanced-select';

// Re-export the types
export type { SelectOption, UseEnhancedSelectReturn, EnhancedSearchableSelectProps } from './types';

// Re-export the searchable select component
export { EnhancedSearchableSelect } from '../enhanced-searchable-select';
