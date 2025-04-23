
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
    { keys: 'Ctrl+B', description: 'Create portable version' },
    { keys: 'Escape', description: 'Return to Home' },
  ];

  // Instead of using JSX, create a string representation of the shortcuts
  const shortcutsText = shortcuts
    .map(shortcut => `${shortcut.keys}: ${shortcut.description}`)
    .join('\n');

  toast.info("Available Keyboard Shortcuts", {
    description: shortcutsText,
    duration: 5000
  });
};
