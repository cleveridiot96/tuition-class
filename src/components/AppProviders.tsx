
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import { ContextMenuProvider } from "@/components/custom-context-menu/context-menu-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EnhancedErrorBoundary from "@/components/EnhancedErrorBoundary";
import { GlobalMasterDialogProvider } from "@/context/GlobalMasterDialogContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <EnhancedErrorBoundary>
        <ErrorBoundary>
          <ContextMenuProvider>
            <KeyboardShortcutsProvider>
              <GlobalMasterDialogProvider>
                {children}
              </GlobalMasterDialogProvider>
            </KeyboardShortcutsProvider>
          </ContextMenuProvider>
        </ErrorBoundary>
      </EnhancedErrorBoundary>
    </ThemeProvider>
  );
}
