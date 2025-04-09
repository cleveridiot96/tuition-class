
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SimilarPartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  similarParty: any;
  enteredPartyName: string;
  useSuggestedParty: () => void;
}

/**
 * Enhanced SimilarPartyDialog with improved error handling and fallbacks
 */
const SimilarPartyDialog: React.FC<SimilarPartyDialogProps> = ({
  open,
  onOpenChange,
  similarParty,
  enteredPartyName,
  useSuggestedParty,
}) => {
  // Don't render at all if we shouldn't show the dialog
  if (!open) {
    return null;
  }
  
  // Always provide fallbacks for potentially undefined values
  const partyName = similarParty?.name || 'Unknown';
  const safeEnteredName = enteredPartyName || 'Unknown';
  
  // Safe handlers with proper error handling
  const handleClose = React.useCallback((e?: React.MouseEvent) => {
    try {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      console.error("Error closing similar party dialog:", error);
      // Still try to close even if there's an error
      try { onOpenChange && onOpenChange(false); } catch {}
    }
  }, [onOpenChange]);
  
  const handleUseSuggested = React.useCallback((e?: React.MouseEvent) => {
    try {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (useSuggestedParty) useSuggestedParty();
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      console.error("Error using suggested party:", error);
      handleClose();
    }
  }, [useSuggestedParty, onOpenChange, handleClose]);
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        try {
          if (onOpenChange) onOpenChange(newOpen);
        } catch (error) {
          console.error("Error changing dialog state:", error);
          // Try to force close in case of error
          try { onOpenChange && onOpenChange(false); } catch {}
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md z-[100] bg-background shadow-md border" 
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          handleClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>Similar Party Name Found</DialogTitle>
          <DialogDescription>
            <span className="block mt-2">Did you mean "{partyName}"?</span>
            <span className="block mt-1">You've entered a similar name: "{safeEnteredName}"</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            type="button"
          >
            Use My Entry
          </Button>
          <Button 
            onClick={handleUseSuggested}
            type="button"
          >
            Use "{partyName}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarPartyDialog;
