
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ManualExpenseForm from "@/components/ManualExpenseForm";
import PaymentForm from "@/components/PaymentForm";
import ReceiptForm from "@/components/ReceiptForm";

interface TransactionDialogsProps {
  expenseDialogOpen: boolean;
  setExpenseDialogOpen: (open: boolean) => void;
  paymentDialogOpen: boolean;
  setPaymentDialogOpen: (open: boolean) => void;
  receiptDialogOpen: boolean;
  setReceiptDialogOpen: (open: boolean) => void;
  handleManualExpenseAdded: () => void;
  handlePaymentAdded: () => void;
  handleReceiptAdded: () => void;
}

const TransactionDialogs = ({
  expenseDialogOpen,
  setExpenseDialogOpen,
  paymentDialogOpen,
  setPaymentDialogOpen,
  receiptDialogOpen,
  setReceiptDialogOpen,
  handleManualExpenseAdded,
  handlePaymentAdded,
  handleReceiptAdded,
}: TransactionDialogsProps) => {
  return (
    <>
      {/* Manual Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Manual Expense</DialogTitle>
            <DialogDescription>
              Record a cash expense or withdrawal for your business.
            </DialogDescription>
          </DialogHeader>
          <ManualExpenseForm 
            onSubmit={handleManualExpenseAdded}
            onCancel={() => setExpenseDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              Record a payment made to a party.
            </DialogDescription>
          </DialogHeader>
          <PaymentForm
            onSubmit={handlePaymentAdded}
            onCancel={() => setPaymentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Receipt</DialogTitle>
            <DialogDescription>
              Record a receipt from a party.
            </DialogDescription>
          </DialogHeader>
          <ReceiptForm
            onSubmit={handleReceiptAdded}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionDialogs;
