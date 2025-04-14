
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPartyName: string;
  setNewPartyName: (name: string) => void;
  newPartyAddress: string;
  setNewPartyAddress: (address: string) => void;
  handleAddNewParty: () => void;
}

const AddPartyDialog = ({
  open,
  onOpenChange,
  newPartyName,
  setNewPartyName,
  newPartyAddress,
  setNewPartyAddress,
  handleAddNewParty,
}: AddPartyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Party</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="partyName">Party Name</Label>
            <Input
              id="partyName"
              placeholder="Enter party name"
              value={newPartyName}
              onChange={(e) => setNewPartyName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partyAddress">Address (Optional)</Label>
            <Input
              id="partyAddress"
              placeholder="Enter address"
              value={newPartyAddress}
              onChange={(e) => setNewPartyAddress(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNewParty}>Add Party</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartyDialog;
