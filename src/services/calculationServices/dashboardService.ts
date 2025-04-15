
import { getPurchases, getSales, getPayments, getReceipts } from '@/services/storageService';

export function getDashboardSummary() {
  const purchases = getPurchases();
  const sales = getSales();
  const payments = getPayments();
  const receipts = getReceipts();
  
  // Calculate total purchases
  const totalPurchases = purchases
    .filter(p => !p.isDeleted)
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  
  // Calculate total sales
  const totalSales = sales
    .filter(s => !s.isDeleted)
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  
  // Calculate total payments
  const totalPayments = payments
    .filter(p => !p.isDeleted)
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate total receipts
  const totalReceipts = receipts
    .filter(r => !r.isDeleted)
    .reduce((sum, r) => sum + r.amount, 0);
  
  // Calculate gross profit
  const grossProfit = totalSales - totalPurchases;
  
  // Calculate cash balance
  const cashBalance = totalReceipts - totalPayments;
  
  return {
    totalPurchases,
    totalSales,
    totalPayments,
    totalReceipts,
    grossProfit,
    cashBalance,
    transactionCounts: {
      purchases: purchases.filter(p => !p.isDeleted).length,
      sales: sales.filter(s => !s.isDeleted).length,
      payments: payments.filter(p => !p.isDeleted).length,
      receipts: receipts.filter(r => !r.isDeleted).length
    }
  };
}
