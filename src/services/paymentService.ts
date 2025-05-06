import { Payment, Receipt } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getPayments = (): Payment[] => {
  return getStorageItem<Payment[]>('payments') || [];
};

export const getReceipts = (): Receipt[] => {
  return getStorageItem<Receipt[]>('receipts') || [];
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  saveStorageItem('payments', payments);
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  if (index !== -1) {
    payments[index] = updatedPayment;
    saveStorageItem('payments', payments);
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === id);
  if (index !== -1) {
    payments[index] = { ...payments[index], isDeleted: true };
    saveStorageItem('payments', payments);
  }
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  saveStorageItem('receipts', receipts);
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  if (index !== -1) {
    receipts[index] = updatedReceipt;
    saveStorageItem('receipts', receipts);
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  if (index !== -1) {
    receipts[index] = { ...receipts[index], isDeleted: true };
    saveStorageItem('receipts', receipts);
  }
};
