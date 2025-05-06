
import { getStorageItem, saveStorageItem } from './storageUtils';
import { Payment, Receipt } from './types';

// Payment functions
export const getPayments = (): Payment[] => {
  return getStorageItem<Payment[]>('payments') || [];
};

export const savePayments = (payments: Payment[]): void => {
  saveStorageItem('payments', payments);
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  savePayments(payments);
};

export const updatePayment = (payment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === payment.id);
  
  if (index !== -1) {
    payments[index] = payment;
    savePayments(payments);
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === id);
  
  if (index !== -1) {
    payments[index] = { ...payments[index], isDeleted: true };
    savePayments(payments);
  }
};

// Receipt functions
export const getReceipts = (): Receipt[] => {
  return getStorageItem<Receipt[]>('receipts') || [];
};

export const saveReceipts = (receipts: Receipt[]): void => {
  saveStorageItem('receipts', receipts);
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  saveReceipts(receipts);
};

export const updateReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === receipt.id);
  
  if (index !== -1) {
    receipts[index] = receipt;
    saveReceipts(receipts);
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === id);
  
  if (index !== -1) {
    receipts[index] = { ...receipts[index], isDeleted: true };
    saveReceipts(receipts);
  }
};
