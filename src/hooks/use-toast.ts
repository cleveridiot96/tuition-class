
// This file should only export the hook and re-export from toast context
import { useContext } from "react";
import { ToastContext } from "./toast/toast-context";
import { ToastContextType } from "./toast/types";
import { toast, dismissToast } from "./toast/toast-utils";

// Hook for consuming the toast context - only use inside React components
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

// Re-export the toast functions and provider for convenience
export { ToastProvider } from "./toast/toast-context";
export { toast, dismissToast as dismiss } from "./toast/toast-utils";
