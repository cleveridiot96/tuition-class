
// Use toast from the toast module
import { toast, dismiss } from './toast';

// Extend the useToast hook to include the toast function
export function useToast() {
  return {
    toast,
    dismiss,
    toasts: []
  };
}

// Re-export toast for convenience
export { toast, dismiss };
