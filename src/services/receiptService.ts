
import { Receipt } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getReceipts = (): Receipt[] => {
  return getYearSpecificStorageItem<Receipt>('receipts');
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  saveYearSpecificStorageItem('receipts', receipts);
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  if (index !== -1) {
    receipts[index] = updatedReceipt;
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
