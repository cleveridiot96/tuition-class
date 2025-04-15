
import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { Receipt } from './types';

export function getReceipts(): Receipt[] {
  return getYearSpecificStorageItem('receipts', []);
}

export function saveReceipts(receipts: Receipt[]): void {
  saveYearSpecificStorageItem('receipts', receipts);
}

export function addReceipt(receipt: Receipt): void {
  const receipts = getReceipts();
  receipts.push(receipt);
  saveReceipts(receipts);
}

export function updateReceipt(updatedReceipt: Receipt): void {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  
  if (index !== -1) {
    receipts[index] = updatedReceipt;
    saveReceipts(receipts);
  }
}

export function deleteReceipt(id: string): void {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  
  if (index !== -1) {
    receipts[index] = { ...receipts[index], isDeleted: true };
    saveReceipts(receipts);
  }
}
