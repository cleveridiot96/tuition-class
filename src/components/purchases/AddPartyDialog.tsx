
import React from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddPartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPartyName: string;
  setNewPartyName: (name: string) => void;
  newPartyAddress: string;
  setNewPartyAddress: (address: string) => void;
  handleAddNewParty: () => void;
}

const AddPartyDialog: React.FC<AddPartyDialogProps> = ({
  open,
  onOpenChange,
  newPartyName,
  setNewPartyName,
  newPartyAddress,
  setNewPartyAddress,
  handleAddNewParty,
}) => {
  // Safely handle form submission with error boundary
  const safelyHandleAddNewParty = () => {
    try {
      handleAddNewParty();
    } catch (error) {
      console.error("Error adding new party:", error);
      // Fallback - close the dialog without crashing
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Party</DialogTitle>
          <DialogDescription>Enter the details for the new party</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Party Name</FormLabel>
            <Input
              placeholder="Enter party name"
              value={newPartyName}
              onChange={(e) => setNewPartyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Address (Optional)</FormLabel>
            <Textarea
              placeholder="Enter address (optional)"
              value={newPartyAddress}
              onChange={(e) => setNewPartyAddress(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={safelyHandleAddNewParty}>Add Party</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartyDialog;
