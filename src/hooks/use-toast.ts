
// Import directly from the toast-utils instead of the index to avoid circular references
import { toast as toastFn, dismiss as dismissFn } from './toast/toast-utils';
import { memoryState } from './toast/reducer';

// Extend the useToast hook to include the toast function
export function useToast() {
  return {
    toast: toastFn,
    dismiss: dismissFn,
    toasts: memoryState.toasts
  };
}

// Re-export toast and dismiss for convenience
export const toast = toastFn;
export const dismiss = dismissFn;
