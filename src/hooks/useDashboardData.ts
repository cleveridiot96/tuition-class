
import { useEffect, useState } from 'react';
import { getPurchases, getSales, getStorageItem } from '@/services/storageService';

export interface DashboardSummaryData {
  totalPurchases: number;
  totalSales: number;
  totalInventory: number;
  cashBalance: number;
}

export const useDashboardData = () => {
  const [summaryData, setSummaryData] = useState<DashboardSummaryData>({
    totalPurchases: 0,
    totalSales: 0,
    totalInventory: 0,
    cashBalance: 0
  });

  useEffect(() => {
    // Get purchases data
    const purchases = getPurchases();
    const totalPurchases = purchases.reduce((total, purchase) => {
      if (!purchase.isDeleted) {
        return total + (purchase.totalAfterExpenses || 0);
      }
      return total;
    }, 0);

    // Get sales data
    const sales = getStorageItem<any[]>('sales') || [];
    const totalSales = sales.reduce((total, sale) => {
      if (!sale.isDeleted) {
        return total + (sale.totalAmount || 0);
      }
      return total;
    }, 0);

    // Get inventory data
    const inventory = getStorageItem<any[]>('inventory') || [];
    const totalInventory = inventory.reduce((total, item) => {
      if (!item.isDeleted && item.remainingQuantity > 0) {
        return total + (item.remainingQuantity * item.rate || 0);
      }
      return total;
    }, 0);

    // Get cash balance
    const payments = getStorageItem<any[]>('payments') || [];
    const receipts = getStorageItem<any[]>('receipts') || [];
    
    const totalPayments = payments.reduce((total, payment) => {
      if (!payment.isDeleted) {
        return total + (payment.amount || 0);
      }
      return total;
    }, 0);
    
    const totalReceipts = receipts.reduce((total, receipt) => {
      if (!receipt.isDeleted) {
        return total + (receipt.amount || 0);
      }
      return total;
    }, 0);
    
    const cashBalance = totalReceipts - totalPayments;

    setSummaryData({
      totalPurchases,
      totalSales,
      totalInventory,
      cashBalance
    });
  }, []);

  return { summaryData };
};

export default useDashboardData;
