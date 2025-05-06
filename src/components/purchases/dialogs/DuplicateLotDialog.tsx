
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DuplicateLotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicatePurchase: any;
  onContinue: () => void;
}

const DuplicateLotDialog: React.FC<DuplicateLotDialogProps> = ({
  open,
  onOpenChange,
  duplicatePurchase,
  onContinue,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Lot Number</DialogTitle>
          <DialogDescription>
            You've already added this lot number on {duplicatePurchase && format(new Date(duplicatePurchase.date), "dd MMM yyyy")}. 
            Is this the same lot or a different one?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <p>Previous lot details:</p>
            {duplicatePurchase && (
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Party: {duplicatePurchase.party}</li>
                <li>Quantity: {duplicatePurchase.bags || duplicatePurchase.quantity} bags</li>
                <li>Net Weight: {duplicatePurchase.netWeight} kg</li>
                <li>Rate: ₹{duplicatePurchase.rate} per kg</li>
              </ul>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Change Lot Number
          </Button>
          <Button onClick={onContinue}>
            Continue Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateLotDialog;
