import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export function getReceipts() {
  return getYearSpecificStorageItem('receipts', []);
}

export function saveReceipt(receipt: any): boolean {
  try {
    const receipts = getReceipts();
    receipts.push(receipt);
    saveYearSpecificStorageItem('receipts', receipts);
    return true;
  } catch (error) {
    console.error("Error saving receipt:", error);
    return false;
  }
}

export function updateReceipt(id: string, updatedReceipt: any): boolean {
  try {
    const receipts = getReceipts();
    const index = receipts.findIndex((receipt: any) => receipt.id === id);
    if (index === -1) {
      console.error("Receipt not found:", id);
      return false;
    }
    receipts[index] = { ...receipts[index], ...updatedReceipt };
    saveYearSpecificStorageItem('receipts', receipts);
    return true;
  } catch (error) {
    console.error("Error updating receipt:", error);
    return false;
  }
}

export function deleteReceipt(id: string): boolean {
  try {
    let receipts = getReceipts();
    receipts = receipts.map((receipt: any) => {
      if (receipt.id === id) {
        return { ...receipt, isDeleted: true };
      }
      return receipt;
    });
    saveYearSpecificStorageItem('receipts', receipts);
    return true;
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return false;
  }
}
