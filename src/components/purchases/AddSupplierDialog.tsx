
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPartyName: string;
  setNewPartyName: (name: string) => void;
  newPartyAddress: string;
  setNewPartyAddress: (address: string) => void;
  handleAddNewParty: () => void;
}

const AddSupplierDialog: React.FC<AddSupplierDialogProps> = ({
  open,
  onOpenChange,
  newPartyName,
  setNewPartyName,
  newPartyAddress,
  setNewPartyAddress,
  handleAddNewParty,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newPartyName}
              onChange={(e) => setNewPartyName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={newPartyAddress}
              onChange={(e) => setNewPartyAddress(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddNewParty}>
            Add Supplier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierDialog;
