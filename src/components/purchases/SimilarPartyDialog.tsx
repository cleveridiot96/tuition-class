
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
  // Extra safety: ensure the dialog only renders with valid props and doesn't attempt to use undefined values
  if (!similarParty || !enteredPartyName || !useSuggestedParty || typeof onOpenChange !== 'function') {
    console.log("SimilarPartyDialog missing required props:", { 
      hasSimilarParty: !!similarParty, 
      hasEnteredName: !!enteredPartyName, 
      hasUseFunction: !!useSuggestedParty,
      hasChangeFunction: typeof onOpenChange === 'function'
    });
    return null;
  }
  
  // Always provide a fallback for party name
  const partyName = similarParty?.name || '';
  
  // Safe handler for closing dialog
  const handleClose = () => {
    try {
      onOpenChange(false);
    } catch (error) {
      console.error("Error closing dialog:", error);
    }
  };
  
  // Safe handler for using the suggested party
  const handleUseSuggested = () => {
    try {
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
          onOpenChange(newOpen);
        } catch (error) {
          console.error("Error changing dialog state:", error);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Similar Party Name Found</DialogTitle>
          <DialogDescription>
            <span className="block mt-2">Did you mean "{partyName}"?</span>
            <span className="block mt-1">You've entered a similar name: "{enteredPartyName}"</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Use My Entry
          </Button>
          <Button onClick={handleUseSuggested}>
            Use "{partyName}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarPartyDialog;
