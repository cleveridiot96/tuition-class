
import React from "react";
import { memoryState, listeners, dispatch } from "./reducer";
import { State, ToastContextType } from "./types";
import { toast, dismissToast } from "./toast-utils";

// Create context with proper type
export const ToastContext = React.createContext<ToastContextType | null>(null);

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(memoryState);
  
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  const value: ToastContextType = {
    ...state,
    toast,
    dismiss: dismissToast,
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
