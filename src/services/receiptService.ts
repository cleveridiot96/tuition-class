
import { Receipt } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getReceipts = (): Receipt[] => {
  return getYearSpecificStorageItem<Receipt[]>('receipts') || [];
};

export const addReceipt = (receipt: Receipt): void => {
  // Ensure backward compatibility fields
  const receiptWithCompat = {
    ...receipt,
    reference: receipt.referenceNumber,
    paymentMethod: receipt.mode,
    customer: receipt.customerName // For backward compatibility
  };
  
  const receipts = getReceipts();
  receipts.push(receiptWithCompat);
  saveYearSpecificStorageItem('receipts', receipts);
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  if (index !== -1) {
    // Ensure backward compatibility fields
    const receiptWithCompat = {
      ...updatedReceipt,
      reference: updatedReceipt.referenceNumber,
      paymentMethod: updatedReceipt.mode,
      customer: updatedReceipt.customerName // For backward compatibility
    };
    
    receipts[index] = receiptWithCompat;
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
