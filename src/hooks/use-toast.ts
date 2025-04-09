
import { ToastContext } from "./toast/toast-context";
import { toast, dismissToast } from "./toast/toast-utils";
import { ToastContextType } from "./toast/types";
import React from "react";

// Hook for consuming the toast context
export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    console.error("useToast called outside of ToastProvider");
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

// Export the ToastProvider and standalone toast function
export { ToastProvider } from "./toast/toast-context";
export { toast };
