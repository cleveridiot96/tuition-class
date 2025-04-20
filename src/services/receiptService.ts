
import { Receipt } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { v4 as uuidv4 } from 'uuid';
import { createDoubleEntry } from './accountingService';

export const getReceipts = (): Receipt[] => {
  return getYearSpecificStorageItem<Receipt[]>('receipts') || [];
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  
  // Ensure receipt.date is not null
  const receiptWithDefaults = {
    ...receipt,
    id: receipt.id || uuidv4(),
    date: receipt.date || new Date().toISOString().split('T')[0],
  };
  
  receipts.push(receiptWithDefaults);
  saveYearSpecificStorageItem('receipts', receipts);
  
  // Create double entry for accounting system
  if (receipt.customerId) {
    // Create accounting entry for cash receipt
    try {
      createDoubleEntry(
        receipt.date,
        receipt.paymentMethod === 'bank' ? 'acc-bank' : 'acc-cash', // Debit Cash or Bank
        `acc-customer-${receipt.customerId}`, // Credit Customer Account
        receipt.amount,
        receipt.reference || receipt.receiptNumber || '',
        `Receipt from ${receipt.customerName || 'customer'}`,
        'receipt',
        receipt.id
      );
    } catch (err) {
      console.error("Error creating accounting entry:", err);
    }
  }
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  
  if (index !== -1) {
    // Ensure updatedReceipt.date is not null
    const receiptWithDefaults = {
      ...updatedReceipt,
      date: updatedReceipt.date || receipts[index].date || new Date().toISOString().split('T')[0],
    };
    
    receipts[index] = receiptWithDefaults;
    saveYearSpecificStorageItem('receipts', receipts);
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  if (index !== -1) {
    receipts[index] = { ...receipts[index], isDeleted: true };
    saveYearSpecificStorageItem('receipts', receipts);
  }
};

export const saveReceipts = (receipts: Receipt[]): void => {
  saveYearSpecificStorageItem('receipts', receipts);
};
