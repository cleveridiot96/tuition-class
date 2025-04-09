
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
  // Safety check to avoid rendering with null or undefined props
  if (!similarParty || !enteredPartyName) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Similar Party Name Found</DialogTitle>
          <DialogDescription>
            <span className="block mt-2">Did you mean "{similarParty?.name}"?</span>
            <span className="block mt-1">You've entered a similar name: "{enteredPartyName}"</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              // Prevent any potential undefined errors
              try {
                onOpenChange(false);
              } catch (error) {
                console.error("Error closing dialog:", error);
              }
            }}
          >
            Use My Entry
          </Button>
          <Button 
            onClick={() => {
              // Prevent any potential undefined errors
              try {
                useSuggestedParty();
              } catch (error) {
                console.error("Error using suggested party:", error);
              }
            }}
          >
            Use "{similarParty?.name || ''}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarPartyDialog;
