
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ShortcutConfig {
  key: string;
  description: string;
  action: () => void;
  requiresCtrl?: boolean;
  requiresShift?: boolean;
  requiresAlt?: boolean;
  global?: boolean;
}

export interface ShortcutGroup {
  name: string;
  shortcuts: ShortcutConfig[];
}

export const useKeyboardShortcuts = (customShortcuts?: ShortcutConfig[]) => {
  const [showHelp, setShowHelp] = useState(false);
  const { toast } = useToast();
  
  // Safe navigate implementation
  let navigate: ReturnType<typeof useNavigate>;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("useNavigate failed — likely used outside a Router context");
    // Provide a fallback function that does nothing
    navigate = () => {};
  }
  
  // Core system shortcuts
  const systemShortcuts: ShortcutConfig[] = [
    {
      key: 'F1',
      description: 'Show keyboard shortcuts help',
      action: () => setShowHelp(true),
      global: true
    },
    {
      key: 'Escape',
      description: 'Close modals/dialogs',
      action: () => setShowHelp(false),
      global: true
    }
  ];
  
  // Navigation shortcuts
  const navigationShortcuts: ShortcutConfig[] = [
    {
      key: 'h',
      description: 'Go to Dashboard',
      action: () => navigate('/'),
      requiresAlt: true,
    },
    {
      key: 'p',
      description: 'Go to Purchases',
      action: () => navigate('/purchases'),
      requiresAlt: true,
    },
    {
      key: 's',
      description: 'Go to Sales',
      action: () => navigate('/sales'),
      requiresAlt: true,
    },
    {
      key: 'i',
      description: 'Go to Inventory',
      action: () => navigate('/inventory'),
      requiresAlt: true,
    },
    {
      key: 'l',
      description: 'Go to Ledger',
      action: () => navigate('/ledger'),
      requiresAlt: true,
    },
    {
      key: 'm',
      description: 'Go to Master',
      action: () => navigate('/master'),
      requiresAlt: true,
    },
    {
      key: 'c',
      description: 'Go to Cash Book',
      action: () => navigate('/cashbook'),
      requiresAlt: true,
    }
  ];

  // Common form shortcuts
  const formShortcuts: ShortcutConfig[] = [
    {
      key: 'Enter',
      description: 'Save form',
      action: () => {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          (submitButton as HTMLButtonElement).click();
        }
      },
      requiresCtrl: true,
    },
    {
      key: 'Escape',
      description: 'Cancel/Close form',
      action: () => {
        const cancelButton = document.querySelector('button[type="button"][class*="cancel"]');
        if (cancelButton) {
          (cancelButton as HTMLButtonElement).click();
        }
      }
    }
  ];

  // Tally-like shortcuts
  const tallyShortcuts: ShortcutConfig[] = [
    {
      key: 'F2',
      description: 'New Entry',
      action: () => {
        const newButton = document.querySelector('button[class*="new"]') || 
                         document.querySelector('button:has(svg[class*="plus"])');
        if (newButton) {
          (newButton as HTMLButtonElement).click();
        }
      }
    },
    {
      key: 'F8',
      description: 'Print Entry',
      action: () => {
        const printButton = document.querySelector('button:has(svg[class*="print"])');
        if (printButton) {
          (printButton as HTMLButtonElement).click();
        }
      }
    },
    {
      key: 'F10',
      description: 'Save Entry',
      action: () => {
        const saveButton = document.querySelector('button[type="submit"]');
        if (saveButton) {
          (saveButton as HTMLButtonElement).click();
        }
      }
    },
    {
      key: 'F12',
      description: 'Cancel Entry',
      action: () => {
        const cancelButton = document.querySelector('button[class*="cancel"]');
        if (cancelButton) {
          (cancelButton as HTMLButtonElement).click();
        }
      }
    }
  ];

  // Merge all shortcuts
  const allShortcuts = [
    ...systemShortcuts,
    ...navigationShortcuts,
    ...formShortcuts,
    ...tallyShortcuts,
    ...(customShortcuts || [])
  ];

  // Organize shortcuts into groups for the help dialog
  const shortcutGroups: ShortcutGroup[] = [
    { name: 'System', shortcuts: systemShortcuts },
    { name: 'Navigation', shortcuts: navigationShortcuts },
    { name: 'Forms', shortcuts: formShortcuts },
    { name: 'Tally-like', shortcuts: tallyShortcuts }
  ];

  // Handler for keydown events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if we're in an input, textarea, or contenteditable element
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        // Allow Escape and F1 even in inputs
        if (e.key !== 'Escape' && e.key !== 'F1') {
          return;
        }
      }

      // Check all shortcuts
      for (const shortcut of allShortcuts) {
        if (
          e.key === shortcut.key && 
          (!shortcut.requiresCtrl || e.ctrlKey) &&
          (!shortcut.requiresShift || e.shiftKey) &&
          (!shortcut.requiresAlt || e.altKey)
        ) {
          e.preventDefault();
          shortcut.action();
          
          // Show toast feedback for non-global shortcuts
          if (!shortcut.global) {
            toast({
              title: `Shortcut: ${getShortcutDisplayName(shortcut)}`,
              description: shortcut.description,
              duration: 2000,
            });
          }
          
          break;
        }
      }
    };

    // Get display name for a shortcut
    const getShortcutDisplayName = (shortcut: ShortcutConfig): string => {
      const parts: string[] = [];
      if (shortcut.requiresCtrl) parts.push('Ctrl');
      if (shortcut.requiresAlt) parts.push('Alt');
      if (shortcut.requiresShift) parts.push('Shift');
      parts.push(shortcut.key);
      return parts.join('+');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [allShortcuts, toast]);

  return { showHelp, setShowHelp, shortcutGroups };
};
