
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

interface EditPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any | null;
  onSubmit: (data: any) => void;
}

const EditPaymentDialog: React.FC<EditPaymentDialogProps> = ({ 
  open, 
  onOpenChange, 
  payment, 
  onSubmit 
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
    }}>
      <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Modify the payment details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
          <PaymentForm 
            onSubmit={onSubmit} 
            onCancel={() => onOpenChange(false)}
            initialData={payment}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentDialog;
