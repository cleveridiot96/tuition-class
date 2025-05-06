
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

const defaultSummaryData: DashboardSummaryData = {
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
};

export const useDashboardData = (
  selectedMonth: number = new Date().getMonth(), 
  selectedYear: number = new Date().getFullYear()
) => {
  const [summaryData, setSummaryData] = useState<DashboardSummaryData>(defaultSummaryData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Get purchases data
      const purchases = getPurchases();
      
      // Filter purchases by month and year
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of month
      
      const filteredPurchases = purchases.filter(purchase => {
        if (purchase.isDeleted) return false;
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= startDate && purchaseDate <= endDate;
      });
      
      const totalPurchases = filteredPurchases.reduce((total, purchase) => {
        return total + (purchase.totalAfterExpenses || 0);
      }, 0);

      // Calculate purchase metrics
      const purchaseBags = filteredPurchases.reduce((total, purchase) => {
        return total + (purchase.quantity || 0);
      }, 0);

      const purchaseKgs = filteredPurchases.reduce((total, purchase) => {
        return total + (purchase.netWeight || 0);
      }, 0);

      // Get sales data
      const sales = getSales();
      
      // Filter sales by month and year
      const filteredSales = sales.filter(sale => {
        if (sale.isDeleted) return false;
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
      
      const totalSales = filteredSales.reduce((total, sale) => {
        return total + (sale.totalAmount || 0);
      }, 0);

      // Calculate sales metrics
      const salesBags = filteredSales.reduce((total, sale) => {
        return total + (sale.quantity || 0);
      }, 0);

      const salesKgs = filteredSales.reduce((total, sale) => {
        return total + (sale.netWeight || 0);
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
      
      // Filter payments and receipts by month and year
      const filteredPayments = payments.filter(payment => {
        if (payment.isDeleted) return false;
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
      
      const filteredReceipts = receipts.filter(receipt => {
        if (receipt.isDeleted) return false;
        const receiptDate = new Date(receipt.date);
        return receiptDate >= startDate && receiptDate <= endDate;
      });
      
      const totalPayments = filteredPayments.reduce((total, payment) => {
        return total + (payment.amount || 0);
      }, 0);
      
      const totalReceipts = filteredReceipts.reduce((total, receipt) => {
        return total + (receipt.amount || 0);
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
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Ensure we always have valid data even if there's an error
      setSummaryData(defaultSummaryData);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  return { summaryData, isLoading };
};

export default useDashboardData;
