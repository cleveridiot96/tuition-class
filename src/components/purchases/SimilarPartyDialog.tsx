
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

const SimilarPartyDialog: React.FC<SimilarPartyDialogProps> = ({
  open,
  onOpenChange,
  similarParty,
  enteredPartyName,
  useSuggestedParty,
}) => {
  // Prevent rendering if essential props are missing
  if (!similarParty || typeof onOpenChange !== 'function' || !useSuggestedParty) {
    return null;
  }
  
  // Always provide fallbacks for potentially undefined values
  const partyName = similarParty?.name || '';
  const safeEnteredName = enteredPartyName || '';
  
  // Safe handlers with error boundaries
  const handleClose = (e?: React.MouseEvent) => {
    try {
      if (e) e.stopPropagation();
      onOpenChange(false);
    } catch (error) {
      console.error("Error closing dialog:", error);
    }
  };
  
  const handleUseSuggested = (e?: React.MouseEvent) => {
    try {
      if (e) e.stopPropagation();
      useSuggestedParty();
      onOpenChange(false);
    } catch (error) {
      console.error("Error using suggested party:", error);
      handleClose();
    }
  };
  
  return (
    <Dialog 
      open={!!open} 
      onOpenChange={(newOpen) => {
        try {
          // Stop propagation before changing state
          onOpenChange(newOpen);
        } catch (error) {
          console.error("Error changing dialog state:", error);
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          // Prevent event bubbling issues
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent escape key issues
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
