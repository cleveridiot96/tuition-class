import { useCallback, useState } from "react";
import { 
  getPurchases, 
  getInventory, 
  getSales, 
  getPayments,
  getReceipts,
  exportDataBackup 
} from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface ProfitData {
  purchase: number;
  sale: number;
  profit: number;
  date: string;
  quantity: number;
  netWeight: number;
  id?: string;
}

interface MonthlyProfit {
  profit: number;
  display: string;
}

interface MonthlyProfits {
  [key: string]: MonthlyProfit;
}

export interface SummaryData {
  purchases: { amount: number; bags: number; kgs: number };
  sales: { amount: number; bags: number; kgs: number };
  stock: { mumbai: number; chiplun: number; sawantwadi: number };
}

export const useDashboardData = () => {
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState<{
    totalSales: number;
    totalPurchases: number;
    totalPayments: number;
    totalReceipts: number;
  }>({
    totalSales: 0,
    totalPurchases: 0,
    totalPayments: 0,
    totalReceipts: 0
  });
  
  const [detailedSummary, setDetailedSummary] = useState<SummaryData>({
    purchases: { amount: 0, bags: 0, kgs: 0 },
    sales: { amount: 0, bags: 0, kgs: 0 },
    stock: { mumbai: 0, chiplun: 0, sawantwadi: 0 }
  });
  
  const [profitByTransaction, setProfitByTransaction] = useState<ProfitData[]>([]);
  const [profitByMonth, setProfitByMonth] = useState<any[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const loadDashboardData = useCallback(() => {
    setIsRefreshing(true);
    
    try {
      localStorage.setItem('lastDataRefresh', Date.now().toString());
      
      const purchases = getPurchases() || [];
      const sales = getSales() || [];
      const payments = getPayments() || [];
      const receipts = getReceipts() || [];
      
      const inventory = getInventory() || [];
      const activeInventory = inventory.filter(item => !item.isDeleted);
      const mumbaiStock = activeInventory.filter(item => item.location === "Mumbai");
      const chiplunStock = activeInventory.filter(item => item.location === "Chiplun");
      const sawantwadiStock = activeInventory.filter(item => item.location === "Sawantwadi");
      
      console.log("Purchases data loaded:", purchases.length);
      console.log("Sales data loaded:", sales.length);
      console.log("Active inventory:", activeInventory.length);
      
      const activePurchases = purchases.filter(p => !p.isDeleted);
      const activeSales = sales.filter(s => !s.isDeleted);
      const activePayments = payments.filter(p => !p.isDeleted);
      const activeReceipts = receipts.filter(r => !r.isDeleted);
      
      setSummaryData({
        totalSales: activeSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
        totalPurchases: activePurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
        totalPayments: activePayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        totalReceipts: activeReceipts.reduce((sum, r) => sum + (r.amount || 0), 0)
      });
      
      const transactionProfits = sales.filter(sale => !sale.isDeleted).map(sale => {
        const relatedPurchase = purchases.find(p => p.lotNumber === sale.lotNumber && !p.isDeleted);
        const purchaseCost = relatedPurchase ? relatedPurchase.totalAfterExpenses : 0;
        const purchaseCostPerKg = relatedPurchase ? purchaseCost / relatedPurchase.netWeight : 0;
        
        const effectivePurchaseCost = purchaseCostPerKg * sale.netWeight;
        
        const saleRevenue = sale.totalAmount || 0;
        const profit = Math.round(saleRevenue - effectivePurchaseCost);
        
        return {
          purchase: effectivePurchaseCost,
          sale: saleRevenue,
          profit: profit,
          date: sale.date,
          quantity: sale.quantity,
          netWeight: sale.netWeight,
          id: sale.id
        };
      });
      
      const profitsByMonth: MonthlyProfits = {};
      transactionProfits.forEach(transaction => {
        if (!transaction.date) return;
        
        try {
          const date = parseISO(transaction.date);
          const monthKey = format(date, 'yyyy-MM');
          const monthDisplay = format(date, 'MMM yyyy');
          
          if (!profitsByMonth[monthKey]) {
            profitsByMonth[monthKey] = {
              profit: 0,
              display: monthDisplay
            };
          }
          
          profitsByMonth[monthKey].profit += transaction.profit;
        } catch (error) {
          console.error("Error processing date:", transaction.date, error);
        }
      });
      
      const monthlyProfits = Object.entries(profitsByMonth).map(([key, data]) => ({
        month: data.display,
        profit: data.profit
      })).sort((a, b) => a.month.localeCompare(b.month));
      
      setProfitByTransaction(transactionProfits);
      setProfitByMonth(monthlyProfits);
      setTotalProfit(transactionProfits.reduce((sum, item) => sum + item.profit, 0));
      
      setDetailedSummary({
        purchases: {
          amount: activePurchases.reduce((sum, p) => sum + (p.totalAfterExpenses || 0), 0),
          bags: activePurchases.reduce((sum, p) => sum + (p.quantity || 0), 0),
          kgs: activePurchases.reduce((sum, p) => sum + (p.netWeight || 0), 0)
        },
        sales: {
          amount: activeSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
          bags: activeSales.reduce((sum, s) => sum + (s.quantity || 0), 0),
          kgs: activeSales.reduce((sum, s) => sum + (s.netWeight || 0), 0)
        },
        stock: {
          mumbai: mumbaiStock.reduce((sum, item) => sum + (item.quantity || 0), 0),
          chiplun: chiplunStock.reduce((sum, item) => sum + (item.quantity || 0), 0),
          sawantwadi: sawantwadiStock.reduce((sum, item) => sum + (item.quantity || 0), 0)
        }
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error Loading Data",
        description: "There was a problem loading the dashboard data. Try refreshing.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  const incrementDataVersion = () => {
    setDataVersion(prev => prev + 1);
  };

  return {
    summaryData,
    detailedSummary,
    profitByTransaction,
    profitByMonth,
    totalProfit,
    isRefreshing,
    dataVersion,
    loadDashboardData,
    incrementDataVersion
  };
};
