
import { useEffect, useState } from 'react';
import { getPurchases, getSales, getStorageItem } from '@/services/storageService';

export interface DashboardSummaryData {
  totalPurchases: number;
  totalSales: number;
  totalInventory: number;
  cashBalance: number;
  purchases: {
    amount: number;
    bags: number;
    kgs: number;
  };
  sales: {
    amount: number;
    bags: number;
    kgs: number;
  };
  stock: {
    mumbai: number;
    chiplun: number;
    sawantwadi: number;
  };
}

export const useDashboardData = () => {
  const [summaryData, setSummaryData] = useState<DashboardSummaryData>({
    totalPurchases: 0,
    totalSales: 0,
    totalInventory: 0,
    cashBalance: 0,
    purchases: {
      amount: 0,
      bags: 0,
      kgs: 0
    },
    sales: {
      amount: 0,
      bags: 0,
      kgs: 0
    },
    stock: {
      mumbai: 0,
      chiplun: 0,
      sawantwadi: 0
    }
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

    // Calculate purchase metrics
    const purchaseBags = purchases.reduce((total, purchase) => {
      if (!purchase.isDeleted) {
        return total + (purchase.quantity || 0);
      }
      return total;
    }, 0);

    const purchaseKgs = purchases.reduce((total, purchase) => {
      if (!purchase.isDeleted) {
        return total + (purchase.netWeight || 0);
      }
      return total;
    }, 0);

    // Get sales data
    const sales = getSales();
    const totalSales = sales.reduce((total, sale) => {
      if (!sale.isDeleted) {
        return total + (sale.totalAmount || 0);
      }
      return total;
    }, 0);

    // Calculate sales metrics
    const salesBags = sales.reduce((total, sale) => {
      if (!sale.isDeleted) {
        return total + (sale.quantity || 0);
      }
      return total;
    }, 0);

    const salesKgs = sales.reduce((total, sale) => {
      if (!sale.isDeleted) {
        return total + (sale.netWeight || 0);
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

    // Calculate stock per location
    const mumbaiStock = inventory.reduce((total, item) => {
      if (!item.isDeleted && item.location === "Mumbai" && item.remainingQuantity > 0) {
        return total + (item.remainingQuantity || 0);
      }
      return total;
    }, 0);

    const chiplunStock = inventory.reduce((total, item) => {
      if (!item.isDeleted && item.location === "Chiplun" && item.remainingQuantity > 0) {
        return total + (item.remainingQuantity || 0);
      }
      return total;
    }, 0);

    const sawantwadiStock = inventory.reduce((total, item) => {
      if (!item.isDeleted && item.location === "Sawantwadi" && item.remainingQuantity > 0) {
        return total + (item.remainingQuantity || 0);
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
      cashBalance,
      purchases: {
        amount: totalPurchases,
        bags: purchaseBags,
        kgs: purchaseKgs
      },
      sales: {
        amount: totalSales,
        bags: salesBags,
        kgs: salesKgs
      },
      stock: {
        mumbai: mumbaiStock,
        chiplun: chiplunStock,
        sawantwadi: sawantwadiStock
      }
    });
  }, []);

  return { summaryData };
};

export default useDashboardData;
