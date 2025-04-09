
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PropsWithChildren } from "react";

// Use the correct type for attribute
interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string | "class" | "data-theme";
  value?: Record<string, string>;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  forcedTheme?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
