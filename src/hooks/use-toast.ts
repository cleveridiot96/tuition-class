
import { useContext } from "react";
import { ToastContext } from "./toast/toast-context";
import { toast, dismissToast } from "./toast/toast-utils";
import { ToastContextType } from "./toast/types";

// Hook for consuming the toast context
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

// Re-export the toast functions and provider
export { ToastProvider } from "./toast/toast-context";
export { toast, dismissToast as dismiss } from "./toast/toast-utils";
