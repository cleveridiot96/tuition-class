
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Similar Party Name Found</DialogTitle>
          <DialogDescription>
            <span className="block mt-2">Did you mean "{similarParty?.name}"?</span>
            <span className="block mt-1">You've entered a similar name: "{enteredPartyName}"</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Use My Entry
          </Button>
          <Button onClick={useSuggestedParty}>
            Use "{similarParty?.name}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarPartyDialog;
