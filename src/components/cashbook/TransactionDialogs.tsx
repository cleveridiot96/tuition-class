
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import PaymentForm from "@/components/PaymentForm";
import ReceiptForm from "@/components/ReceiptForm";

interface TransactionDialogsProps {
  showReceiptDialog: boolean;
  setShowReceiptDialog: (show: boolean) => void;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (show: boolean) => void;
}

const TransactionDialogs = ({
  showReceiptDialog,
  setShowReceiptDialog,
  showPaymentDialog,
  setShowPaymentDialog,
}: TransactionDialogsProps) => {
  return (
    <>
      {showReceiptDialog && (
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Receipt</DialogTitle>
            </DialogHeader>
            <ReceiptForm 
              onSubmit={() => setShowReceiptDialog(false)} 
              onCancel={() => setShowReceiptDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showPaymentDialog && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm 
              onSubmit={() => setShowPaymentDialog(false)} 
              onCancel={() => setShowPaymentDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TransactionDialogs;
