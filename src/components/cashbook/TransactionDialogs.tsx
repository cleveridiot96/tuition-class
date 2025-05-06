
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransactionDialogsProps {
  showReceiptDialog: boolean;
  setShowReceiptDialog: (show: boolean) => void;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (show: boolean) => void;
  onSubmitReceipt?: (data: any) => void;
  onSubmitPayment?: (data: any) => void;
}

const TransactionDialogs = ({
  showReceiptDialog,
  setShowReceiptDialog,
  showPaymentDialog,
  setShowPaymentDialog,
  onSubmitReceipt,
  onSubmitPayment,
}: TransactionDialogsProps) => {
  return (
    <>
      {showReceiptDialog && (
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Add New Receipt</DialogTitle>
            </DialogHeader>
            <ReceiptForm 
              onSubmit={(data) => {
                if (onSubmitReceipt) onSubmitReceipt(data);
                setShowReceiptDialog(false);
              }} 
              onCancel={() => setShowReceiptDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showPaymentDialog && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Add New Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm 
              onSubmit={(data) => {
                if (onSubmitPayment) onSubmitPayment(data);
                setShowPaymentDialog(false);
              }} 
              onCancel={() => setShowPaymentDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TransactionDialogs;
