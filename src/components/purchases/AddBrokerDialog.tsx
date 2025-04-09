
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

interface AddBrokerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newBrokerName: string;
  setNewBrokerName: (name: string) => void;
  newBrokerAddress: string;
  setNewBrokerAddress: (address: string) => void;
  newBrokerRate: number;
  setNewBrokerRate: (rate: number) => void;
  handleAddNewBroker: () => void;
}

const AddBrokerDialog: React.FC<AddBrokerDialogProps> = ({
  open,
  onOpenChange,
  newBrokerName,
  setNewBrokerName,
  newBrokerAddress,
  setNewBrokerAddress,
  newBrokerRate,
  setNewBrokerRate,
  handleAddNewBroker,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Broker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Broker Name</FormLabel>
            <Input
              placeholder="Enter broker name"
              value={newBrokerName}
              onChange={(e) => setNewBrokerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Address (Optional)</FormLabel>
            <Textarea
              placeholder="Enter address (optional)"
              value={newBrokerAddress}
              onChange={(e) => setNewBrokerAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Default Commission Rate (%)</FormLabel>
            <Input
              type="number"
              placeholder="Enter default commission rate"
              value={newBrokerRate}
              onChange={(e) => setNewBrokerRate(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddNewBroker}>Add Broker</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBrokerDialog;
