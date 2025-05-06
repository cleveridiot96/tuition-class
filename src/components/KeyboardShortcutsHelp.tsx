
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShortcutGroup } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcutGroups: ShortcutGroup[];
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcutGroups
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue={shortcutGroups[0]?.name.toLowerCase() || 'system'}>
            <TabsList className="w-full">
              {shortcutGroups.map((group) => (
                <TabsTrigger 
                  key={group.name}
                  value={group.name.toLowerCase()}
                  className="flex-1"
                >
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {shortcutGroups.map((group) => (
              <TabsContent 
                key={group.name}
                value={group.name.toLowerCase()} 
                className="mt-4"
              >
                <ScrollArea className="h-[50vh] md:h-[40vh]">
                  <div className="space-y-1">
                    {group.shortcuts.map((shortcut, idx) => {
                      const keyCombo = [
                        shortcut.requiresCtrl && 'Ctrl',
                        shortcut.requiresAlt && 'Alt',
                        shortcut.requiresShift && 'Shift',
                        shortcut.key
                      ].filter(Boolean).join('+');
                      
                      return (
                        <div 
                          key={idx}
                          className={`flex justify-between p-2 ${idx % 2 === 0 ? 'bg-muted/50' : ''} rounded-md`}
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <kbd className="px-2 py-1 text-sm font-semibold bg-background border rounded-md">
                            {keyCombo}
                          </kbd>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <DialogFooter>
          <div className="text-xs text-muted-foreground">
            Press F1 anytime to open this help dialog
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
