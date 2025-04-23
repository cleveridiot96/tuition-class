
import React, { createContext, useContext, ReactNode } from 'react';
import { useKeyboardShortcuts, ShortcutGroup } from '@/hooks/useKeyboardShortcuts';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

interface KeyboardShortcutsContextType {
  showKeyboardHelp: () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({
  showKeyboardHelp: () => {}
});

export const useKeyboardShortcutsContext = () => useContext(KeyboardShortcutsContext);

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProviderProps> = ({ children }) => {
  const { showHelp, setShowHelp, shortcutGroups } = useKeyboardShortcuts();

  const showKeyboardHelp = () => {
    setShowHelp(true);
  };

  return (
    <KeyboardShortcutsContext.Provider value={{ showKeyboardHelp }}>
      {children}
      <KeyboardShortcutsHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        shortcutGroups={shortcutGroups}
      />
    </KeyboardShortcutsContext.Provider>
  );
};
