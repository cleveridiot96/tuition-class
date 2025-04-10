
import React, { createContext, useState } from "react";
import { State, ToastContextType } from "./types";
import { toast, dismissToast } from "./toast-utils";
import { memoryState } from "./reducer";

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(memoryState);

  // Create the value for the context with proper type
  const contextValue: ToastContextType = {
    ...state,
    toast,
    dismiss: dismissToast
  };

  // Register this setState in the listeners from reducer
  React.useEffect(() => {
    // Import the listeners from the reducer
    const { listeners } = require("./reducer");
    
    // Add this setState to the listeners
    listeners.push(setState);
    
    // Cleanup function
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}
