
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
  // Safely handle form submission with error boundary
  const safelyHandleAddNewBroker = () => {
    try {
      handleAddNewBroker();
    } catch (error) {
      console.error("Error adding new broker:", error);
      // Fallback - close the dialog without crashing
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newState) => {
      try {
        onOpenChange(newState);
      } catch (error) {
        console.error("Error changing dialog state:", error);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Broker</DialogTitle>
          <DialogDescription>Enter the details for the new broker</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Broker Name</FormLabel>
            <Input
              placeholder="Enter broker name"
              value={newBrokerName}
              onChange={(e) => {
                try {
                  setNewBrokerName(e.target.value);
                } catch (error) {
                  console.error("Error setting broker name:", error);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Address (Optional)</FormLabel>
            <Textarea
              placeholder="Enter address (optional)"
              value={newBrokerAddress}
              onChange={(e) => {
                try {
                  setNewBrokerAddress(e.target.value);
                } catch (error) {
                  console.error("Error setting address:", error);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Default Commission Rate (%)</FormLabel>
            <Input
              type="number"
              placeholder="Enter default commission rate"
              value={newBrokerRate}
              onChange={(e) => {
                try {
                  setNewBrokerRate(Number(e.target.value));
                } catch (error) {
                  console.error("Error setting commission rate:", error);
                  setNewBrokerRate(0);
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            try {
              onOpenChange(false);
            } catch (error) {
              console.error("Error closing dialog:", error);
            }
          }}>Cancel</Button>
          <Button onClick={safelyHandleAddNewBroker}>Add Broker</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBrokerDialog;
