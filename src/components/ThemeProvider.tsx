
import React from "react";
import { PropsWithChildren } from "react";

interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string | string[];
  value?: Record<string, string>;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  forcedTheme?: string;
}

// Simplified ThemeProvider that always uses light mode
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
