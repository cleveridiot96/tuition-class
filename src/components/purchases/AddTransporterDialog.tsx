
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
  // Safely handle form submission with error boundary
  const safelyHandleAddNewTransporter = () => {
    try {
      handleAddNewTransporter();
    } catch (error) {
      console.error("Error adding new transporter:", error);
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
          <DialogTitle>Add New Transporter</DialogTitle>
          <DialogDescription>Enter the details for the new transporter</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Transporter Name</FormLabel>
            <Input
              placeholder="Enter transporter name"
              value={newTransporterName}
              onChange={(e) => {
                try {
                  setNewTransporterName(e.target.value);
                } catch (error) {
                  console.error("Error setting transporter name:", error);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Address (Optional)</FormLabel>
            <Textarea
              placeholder="Enter address (optional)"
              value={newTransporterAddress}
              onChange={(e) => {
                try {
                  setNewTransporterAddress(e.target.value);
                } catch (error) {
                  console.error("Error setting address:", error);
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
          <Button onClick={safelyHandleAddNewTransporter}>Add Transporter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransporterDialog;
