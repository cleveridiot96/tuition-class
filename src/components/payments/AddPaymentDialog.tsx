
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PaymentForm from "@/components/PaymentForm";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Fill in the details to record a new payment
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
          <PaymentForm 
            onSubmit={onSubmit} 
            onCancel={() => onOpenChange(false)} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
