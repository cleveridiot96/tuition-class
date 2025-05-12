
import { useContext } from "react";

export function useSafeContext<T>(context: React.Context<T | null | undefined>, contextName: string = "Context"): T {
  const contextValue = useContext(context);
  
  if (contextValue === null || contextValue === undefined) {
    throw new Error(`${contextName} must be used inside its Provider`);
  }
  
  return contextValue;
}
