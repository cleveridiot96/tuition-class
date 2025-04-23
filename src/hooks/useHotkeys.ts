
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Hotkey {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: () => void;
  description?: string;
}

export function useHotkeys(hotkeys: Hotkey[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      for (const hotkey of hotkeys) {
        if (
          e.key.toLowerCase() === hotkey.key.toLowerCase() &&
          (hotkey.ctrl === undefined || e.ctrlKey === hotkey.ctrl) &&
          (hotkey.alt === undefined || e.altKey === hotkey.alt) &&
          (hotkey.shift === undefined || e.shiftKey === hotkey.shift)
        ) {
          e.preventDefault();
          hotkey.handler();
          
          // Show toast notification when shortcut is used
          const modifiers = [
            hotkey.ctrl && 'Ctrl',
            hotkey.alt && 'Alt',
            hotkey.shift && 'Shift'
          ].filter(Boolean).join('+');
          
          const keyCombo = modifiers ? `${modifiers}+${hotkey.key.toUpperCase()}` : hotkey.key;
          
          toast.info(`Shortcut: ${keyCombo}`, {
            description: hotkey.description || "Shortcut activated"
          });
          
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys]);
}

// Create a function to show available shortcuts
export const showAvailableShortcuts = () => {
  const shortcuts = [
    { keys: 'Ctrl+P', description: 'Go to Purchases' },
    { keys: 'Ctrl+S', description: 'Go to Sales' },
    { keys: 'Ctrl+I', description: 'Go to Inventory' },
    { keys: 'Ctrl+T', description: 'Go to Location Transfer' },
    { keys: 'Ctrl+H', description: 'Go to Home' },
    { keys: 'Ctrl+M', description: 'Go to Master Data' },
    { keys: 'Ctrl+L', description: 'Go to Ledger' },
    { keys: 'Ctrl+B', description: 'Create portable version' },
    { keys: 'F1', description: 'Show Help / Shortcuts' },
    { keys: 'Escape', description: 'Return to Home' },
    { keys: 'Ctrl+R', description: 'Refresh current page' },
    { keys: 'Alt+N', description: 'Add New Item' },
    { keys: 'Alt+S', description: 'Save Form' },
    { keys: 'Alt+C', description: 'Cancel / Close Form' },
    { keys: 'Alt+P', description: 'Print' },
    { keys: 'Alt+D', description: 'Delete Item' },
    { keys: 'Alt+E', description: 'Edit Item' },
    { keys: 'F2', description: 'Show Financial Year' },
  ];

  // Display shortcut list in a toast
  toast.info("Available Keyboard Shortcuts", {
    description: shortcuts
      .map(shortcut => `${shortcut.keys}: ${shortcut.description}`)
      .join('\n'),
    duration: 8000
  });
};

// Add Tally Prime-style keyboard navigation for forms
export function useFormHotkeys(formProps: {
  onSave?: () => void;
  onCancel?: () => void;
  onNew?: () => void;
  onPrint?: () => void;
  onDelete?: () => void;
}) {
  const { onSave, onCancel, onNew, onPrint, onDelete } = formProps;
  
  useHotkeys([
    // Form submission shortcuts
    { key: 's', alt: true, handler: () => onSave && onSave(), description: 'Save form' },
    { key: 'c', alt: true, handler: () => onCancel && onCancel(), description: 'Cancel form' },
    { key: 'n', alt: true, handler: () => onNew && onNew(), description: 'New item' },
    { key: 'p', alt: true, handler: () => onPrint && onPrint(), description: 'Print' },
    { key: 'd', alt: true, handler: () => onDelete && onDelete(), description: 'Delete item' },
  ]);
}

// Export shortcuts for global navigation
export function useGlobalHotkeys(navigate: (path: string) => void) {
  useHotkeys([
    // Global navigation shortcuts
    { key: 'p', ctrl: true, handler: () => navigate('/purchases'), description: 'Go to Purchases' },
    { key: 's', ctrl: true, handler: () => navigate('/sales'), description: 'Go to Sales' },
    { key: 'i', ctrl: true, handler: () => navigate('/inventory'), description: 'Go to Inventory' },
    { key: 't', ctrl: true, handler: () => navigate('/location-transfer'), description: 'Go to Transfers' },
    { key: 'h', ctrl: true, handler: () => navigate('/'), description: 'Go to Home' },
    { key: 'm', ctrl: true, handler: () => navigate('/master'), description: 'Go to Master Data' },
    { key: 'l', ctrl: true, handler: () => navigate('/ledger'), description: 'Go to Ledger' },
    // Show help
    { key: 'F1', handler: () => showAvailableShortcuts(), description: 'Show Help' },
    // Go home
    { key: 'Escape', handler: () => navigate('/'), description: 'Return Home' },
    // Refresh page
    { key: 'r', ctrl: true, handler: () => window.location.reload(), description: 'Refresh' },
  ]);
}
