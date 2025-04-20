
import { v4 as uuidv4 } from 'uuid';
import { Receipt } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { performAutoSave } from './storageService';

// Get all non-deleted receipts
export const getReceipts = (): Receipt[] => {
  const receipts = getYearSpecificStorageItem<Receipt[]>('receipts') || [];
  // Filter out deleted receipts
  return receipts.filter(receipt => !receipt.isDeleted);
};

// Get all receipts including deleted ones
export const getAllReceipts = (): Receipt[] => {
  return getYearSpecificStorageItem<Receipt[]>('receipts') || [];
};

// Add new receipt and trigger auto-save
export const addReceipt = (receipt: Receipt): void => {
  // Ensure ID is present
  const newReceipt = {
    ...receipt,
    id: receipt.id || uuidv4(),
    isDeleted: false,
    // Ensure backward compatibility fields
    reference: receipt.referenceNumber,
    paymentMethod: receipt.mode,
    customer: receipt.customerName, // For backward compatibility
    // Make sure we have date as string
    date: typeof receipt.date === 'object' ? receipt.date.toISOString() : receipt.date
  };
  
  const receipts = getAllReceipts();
  receipts.push(newReceipt);
  saveYearSpecificStorageItem('receipts', receipts);
  
  // Add to cashbook as well for double entry
  addReceiptToCashbook(newReceipt);
  
  // Auto-save after adding
  performAutoSave();
};

// Update existing receipt
export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getAllReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  
  if (index !== -1) {
    // Ensure backward compatibility fields
    const receiptWithCompat = {
      ...updatedReceipt,
      reference: updatedReceipt.referenceNumber,
      paymentMethod: updatedReceipt.mode,
      customer: updatedReceipt.customerName, // For backward compatibility
      // Make sure we have date as string
      date: typeof updatedReceipt.date === 'object' ? updatedReceipt.date.toISOString() : updatedReceipt.date
    };
    
    receipts[index] = receiptWithCompat;
    saveYearSpecificStorageItem('receipts', receipts);
    
    // Update in cashbook
    updateReceiptInCashbook(receiptWithCompat);
    
    // Auto-save after update
    performAutoSave();
  }
};

// Soft delete receipt
export const deleteReceipt = (id: string): void => {
  const receipts = getAllReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  
  if (index !== -1) {
    receipts[index] = { ...receipts[index], isDeleted: true };
    saveYearSpecificStorageItem('receipts', receipts);
    
    // Remove from cashbook
    removeReceiptFromCashbook(receipts[index]);
    
    // Auto-save after deletion
    performAutoSave();
  }
};

// Restore a previously deleted receipt
export const restoreReceipt = (id: string): void => {
  const receipts = getAllReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  
  if (index !== -1 && receipts[index].isDeleted) {
    receipts[index] = { ...receipts[index], isDeleted: false };
    saveYearSpecificStorageItem('receipts', receipts);
    
    // Add back to cashbook
    addReceiptToCashbook(receipts[index]);
    
    // Auto-save after restoration
    performAutoSave();
  }
};

// Function to synchronize receipts with cashbook
export const syncReceiptsWithCashbook = (): void => {
  const receipts = getReceipts();
  
  // First get the cashbook entries
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  
  // Remove existing receipt entries
  const filteredCashbook = cashbook.filter(entry => 
    entry.type !== 'receipt' && !entry.receiptId
  );
  
  // Add all non-deleted receipts to the cashbook
  receipts.forEach(receipt => {
    filteredCashbook.push({
      id: `receipt_${receipt.id}`,
      date: receipt.date,
      type: 'receipt',
      receiptId: receipt.id,
      description: `Receipt from ${receipt.customerName || receipt.partyName}`,
      amount: receipt.amount,
      inflow: receipt.amount,
      outflow: 0,
      notes: receipt.notes || '',
      isDeleted: false
    });
  });
  
  // Save the updated cashbook
  saveYearSpecificStorageItem('cashbook', filteredCashbook);
};

// Helper functions for cashbook integration
const addReceiptToCashbook = (receipt: Receipt): void => {
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  
  cashbook.push({
    id: `receipt_${receipt.id}`,
    date: receipt.date,
    type: 'receipt',
    receiptId: receipt.id,
    description: `Receipt from ${receipt.customerName || receipt.partyName}`,
    amount: receipt.amount,
    inflow: receipt.amount,
    outflow: 0,
    notes: receipt.notes || '',
    isDeleted: false
  });
  
  saveYearSpecificStorageItem('cashbook', cashbook);
};

const updateReceiptInCashbook = (receipt: Receipt): void => {
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  const index = cashbook.findIndex(entry => entry.receiptId === receipt.id);
  
  if (index !== -1) {
    cashbook[index] = {
      ...cashbook[index],
      date: receipt.date,
      description: `Receipt from ${receipt.customerName || receipt.partyName}`,
      amount: receipt.amount,
      inflow: receipt.amount,
      notes: receipt.notes || '',
      isDeleted: false
    };
    
    saveYearSpecificStorageItem('cashbook', cashbook);
  } else {
    // If not found, add it as new
    addReceiptToCashbook(receipt);
  }
};

const removeReceiptFromCashbook = (receipt: Receipt): void => {
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  const index = cashbook.findIndex(entry => entry.receiptId === receipt.id);
  
  if (index !== -1) {
    cashbook[index] = { ...cashbook[index], isDeleted: true };
    saveYearSpecificStorageItem('cashbook', cashbook);
  }
};
