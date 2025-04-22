import React from 'react';
import ReceiptForm from './ReceiptForm';
import PaymentForm from './PaymentForm';
import { useDisclosure } from '@mantine/hooks';

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
}) => {
  return (
    <>
      <ReceiptForm 
        onSubmit={() => {}} 
        onCancel={() => setShowReceiptDialog(false)}
      />
      <PaymentForm 
        onSubmit={() => {}} 
        onCancel={() => setShowPaymentDialog(false)}
      />
    </>
  );
};

export default TransactionDialogs;
