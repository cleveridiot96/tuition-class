
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PropsWithChildren } from "react";

// Define the Attribute type as expected by next-themes
type Attribute = string;

// Define our own ThemeProviderProps type
interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme?: string;
  storageKey?: string;
  attribute?: Attribute | Attribute[];
  value?: Record<string, string>;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  forcedTheme?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
