
import React, { createContext, useEffect, useState } from "react";
import { memoryState, listeners, dispatch } from "./reducer";
import { State, ToastContextType } from "./types";
import { toast, dismissToast } from "./toast-utils";

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ ...state, toast, dismiss: dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}
