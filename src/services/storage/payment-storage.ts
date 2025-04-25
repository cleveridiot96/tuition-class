
import { getStorageItem, saveStorageItem } from '../core/storageCore';

export const getPayments = () => getStorageItem<any[]>('payments') || [];
export const getReceipts = () => getStorageItem<any[]>('receipts') || [];

export const addPayment = (payment: any) => {
  const payments = getPayments();
  payments.push(payment);
  saveStorageItem('payments', payments);
};

export const updatePayment = (paymentId: string, updatedPayment: any) => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === paymentId);
  if (index !== -1) {
    payments[index] = updatedPayment;
    saveStorageItem('payments', payments);
  }
};

export const deletePayment = (paymentId: string) => {
  const payments = getPayments().filter(p => p.id !== paymentId);
  saveStorageItem('payments', payments);
};

export const getNextPaymentNumber = () => {
  const payments = getPayments();
  return `PAY-${payments.length + 1}`;
};

export const getNextReceiptNumber = () => {
  const receipts = getReceipts();
  return `RCP-${receipts.length + 1}`;
};
