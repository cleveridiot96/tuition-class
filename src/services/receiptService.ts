
import { Receipt } from './types';
import { addLedgerEntry } from './ledgerService';
import { addCashbookEntry } from './ledgerService';

// Receipt functions
export const getReceipts = (): Receipt[] => {
  const receipts = localStorage.getItem('receipts');
  return receipts ? JSON.parse(receipts) : [];
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(receipts));
  
  // Also update the ledger for this receipt
  addLedgerEntry({
    id: Date.now().toString(),
    date: receipt.date,
    partyName: receipt.partyName,
    partyType: receipt.partyType,
    description: `Receipt: ${receipt.receiptNumber}`,
    debit: 0,
    credit: receipt.amount,
    balance: 0, // Will be calculated when retrieved
    referenceId: receipt.id,
    referenceType: 'receipt'
  });

  // If payment method is cash, add to cashbook
  if (receipt.paymentMethod === 'cash') {
    addCashbookEntry(
      receipt.date,
      `Receipt: ${receipt.partyName}`,
      0, // Debit
      receipt.amount, // Credit
      receipt.id,
      'receipt'
    );
  }
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === updatedReceipt.id);
  if (index !== -1) {
    receipts[index] = updatedReceipt;
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const updatedReceipts = receipts.filter(r => r.id !== id);
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
};
