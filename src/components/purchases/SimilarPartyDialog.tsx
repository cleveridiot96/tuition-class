
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface SimilarPartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  similarParty: any;
  onUseParty: () => void;
}

const SimilarPartyDialog: React.FC<SimilarPartyDialogProps> = ({
  open,
  onOpenChange,
  similarParty,
  onUseParty
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Similar Party Found</DialogTitle>
          <DialogDescription>
            A similar party was found in the system. Do you want to use it instead of creating a new one?
          </DialogDescription>
        </DialogHeader>
        {similarParty && (
          <div className="py-4">
            <p><strong>Name:</strong> {similarParty.name}</p>
            {similarParty.address && <p><strong>Address:</strong> {similarParty.address}</p>}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Create New
          </Button>
          <Button onClick={() => {
            onUseParty();
            onOpenChange(false);
          }}>
            Use This Party
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarPartyDialog;
