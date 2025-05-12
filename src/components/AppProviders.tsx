
import React from "react";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import { ContextMenuProvider } from "@/components/custom-context-menu/context-menu-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EnhancedErrorBoundary from "@/components/EnhancedErrorBoundary";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <EnhancedErrorBoundary>
        <ErrorBoundary>
          <ContextMenuProvider>
            <KeyboardShortcutsProvider>
              {children}
            </KeyboardShortcutsProvider>
          </ContextMenuProvider>
        </ErrorBoundary>
      </EnhancedErrorBoundary>
    </ThemeProvider>
  );
}
