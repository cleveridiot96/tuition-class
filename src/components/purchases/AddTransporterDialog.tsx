
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
} from "@/components/ui/dialog";

interface AddTransporterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTransporterName: string;
  setNewTransporterName: (name: string) => void;
  newTransporterAddress: string;
  setNewTransporterAddress: (address: string) => void;
  handleAddNewTransporter: () => void;
}

const AddTransporterDialog: React.FC<AddTransporterDialogProps> = ({
  open,
  onOpenChange,
  newTransporterName,
  setNewTransporterName,
  newTransporterAddress,
  setNewTransporterAddress,
  handleAddNewTransporter,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transporter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Transporter Name</FormLabel>
            <Input
              placeholder="Enter transporter name"
              value={newTransporterName}
              onChange={(e) => setNewTransporterName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Address (Optional)</FormLabel>
            <Textarea
              placeholder="Enter address (optional)"
              value={newTransporterAddress}
              onChange={(e) => setNewTransporterAddress(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddNewTransporter}>Add Transporter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransporterDialog;
