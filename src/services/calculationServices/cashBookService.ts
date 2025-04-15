
import { getPayments, getReceipts } from '@/services/storageService';

export function getCashBookSummary() {
  const payments = getPayments();
  const receipts = getReceipts();
  
  // Calculate total payments
  const totalPayments = payments
    .filter(p => !p.isDeleted && p.paymentMode === 'cash')
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate total receipts
  const totalReceipts = receipts
    .filter(r => !r.isDeleted && r.paymentMode === 'cash')
    .reduce((sum, r) => sum + r.amount, 0);
  
  // Calculate balance
  const balance = totalReceipts - totalPayments;
  
  return {
    totalPayments,
    totalReceipts,
    balance,
    balanceType: balance >= 0 ? 'credit' : 'debit'
  };
}
