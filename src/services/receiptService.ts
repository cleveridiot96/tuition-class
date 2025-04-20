import { Receipt } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { v4 as uuidv4 } from 'uuid';

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
