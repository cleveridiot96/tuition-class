
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { Button } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { seedInitialData, getPurchases, getInventory, getSales, clearAllData, exportDataBackup } from "@/services/storageService";
import { format, parseISO } from "date-fns";
import BackupRestoreControls from "@/components/BackupRestoreControls";
import ProfitLossStatement from "@/components/ProfitLossStatement";
import DashboardSummary from "@/components/DashboardSummary";

interface ProfitData {
  purchase: number;
  sale: number;
  profit: number;
  date: string;
  quantity: number;
  netWeight: number;
}

interface MonthlyProfitData {
  month: string;
  profit: number;
}

const Index = () => {
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState({
    purchases: { amount: 0, bags: 0, kgs: 0 },
    sales: { amount: 0, bags: 0, kgs: 0 },
    stock: { mumbai: 0, chiplun: 0, sawantwadi: 0 }
  });
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  const [profitByTransaction, setProfitByTransaction] = useState<ProfitData[]>([]);
  const [profitByMonth, setProfitByMonth] = useState<MonthlyProfitData[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const loadDashboardData = () => {
    setIsRefreshing(true);
    
    // Ensure initial data is seeded
    seedInitialData();
    
    const purchases = getPurchases() || [];
    const sales = getSales() || [];
    
    const inventory = getInventory() || [];
    const mumbaiStock = inventory.filter(item => item.location === "Mumbai");
    const chiplunStock = inventory.filter(item => item.location === "Chiplun");
    const sawantwadiStock = inventory.filter(item => item.location === "Sawantwadi");
    
    console.log("Purchases data loaded:", purchases);
    console.log("Sales data loaded:", sales);
    
    // Calculate profits by transaction
    const transactionProfits: ProfitData[] = sales.map(sale => {
      const relatedPurchase = purchases.find(p => p.lotNumber === sale.lotNumber && !p.isDeleted);
      const purchaseCost = relatedPurchase ? relatedPurchase.totalAfterExpenses : 0;
      const purchaseCostPerKg = relatedPurchase ? purchaseCost / relatedPurchase.netWeight : 0;
      
      // Calculate purchase cost for this sale's quantity
      const effectivePurchaseCost = purchaseCostPerKg * sale.netWeight;
      
      // Calculate sale revenue considering brokerage (1%)
      const saleRevenue = sale.totalAmount || 0;
      const brokerage = sale.broker ? saleRevenue * 0.01 : 0;
      const netSaleRevenue = saleRevenue - brokerage;
      
      // Calculate profit
      const profit = Math.round(netSaleRevenue - effectivePurchaseCost);
      
      return {
        purchase: effectivePurchaseCost,
        sale: netSaleRevenue,
        profit: profit,
        date: sale.date,
        quantity: sale.quantity,
        netWeight: sale.netWeight
      };
    });
    
    // Calculate profits by month
    const profitsByMonth: Record<string, { profit: number; display: string }> = {};
    transactionProfits.forEach(transaction => {
      if (!transaction.date) return;
      
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
    });
    
    const monthlyProfits: MonthlyProfitData[] = Object.entries(profitsByMonth).map(([key, data]) => ({
      month: data.display,
      profit: data.profit
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    setProfitByTransaction(transactionProfits);
    setProfitByMonth(monthlyProfits);
    setTotalProfit(transactionProfits.reduce((sum, item) => sum + item.profit, 0));
    
    setSummaryData({
      purchases: {
        amount: purchases.reduce((sum, p) => sum + (p.totalAfterExpenses || 0), 0),
        bags: purchases.reduce((sum, p) => sum + (p.quantity || 0), 0),
        kgs: purchases.reduce((sum, p) => sum + (p.netWeight || 0), 0)
      },
      sales: {
        amount: sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
        bags: sales.reduce((sum, s) => sum + (s.quantity || 0), 0),
        kgs: sales.reduce((sum, s) => sum + (s.netWeight || 0), 0)
      },
      stock: {
        mumbai: mumbaiStock.reduce((sum, item) => sum + (item.quantity || 0), 0),
        chiplun: chiplunStock.reduce((sum, item) => sum + (item.quantity || 0), 0),
        sawantwadi: sawantwadiStock.reduce((sum, item) => sum + (item.quantity || 0), 0)
      }
    });
    
    setIsRefreshing(false);
  };
  
  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 300ms
    const intervalId = setInterval(() => {
      loadDashboardData();
    }, 300);
    
    window.addEventListener('focus', loadDashboardData);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', loadDashboardData);
    };
  }, []);

  const handleFormatClick = () => {
    setIsFormatDialogOpen(true);
  };

  const handleFormatConfirm = () => {
    try {
      const backupData = exportDataBackup(true);
      if (backupData) {
        localStorage.setItem('preFormatBackup', backupData);
        clearAllData();
        seedInitialData(true);
        loadDashboardData();
        
        toast({
          title: "Data Formatted",
          description: "All data has been successfully formatted. A backup was automatically created.",
        });
      }
    } catch (error) {
      console.error("Error during formatting:", error);
      toast({
        title: "Format Error",
        description: "There was a problem formatting the data.",
        variant: "destructive",
      });
    }
    
    setIsFormatDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation 
        title="Dashboard" 
        showFormatButton={true}
        onFormatClick={handleFormatClick}
      />
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ag-brown-dark">
            Business Management Software
          </h2>
          <p className="text-lg text-ag-brown mt-2">
            Agricultural Business Management System
          </p>
          
          <BackupRestoreControls 
            onRefresh={loadDashboardData} 
            isRefreshing={isRefreshing} 
          />
        </div>
        
        <DashboardMenu />
        
        <DashboardSummary summaryData={summaryData} />
        
        <ProfitLossStatement 
          profitByTransaction={profitByTransaction}
          profitByMonth={profitByMonth}
          totalProfit={totalProfit}
        />
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-ag-brown-dark mb-2">Offline Mode</h3>
          <p className="text-ag-brown">
            This app works completely offline. All your data is securely stored on your computer.
            Remember to take regular backups.
          </p>
        </div>
      </div>

      <FormatConfirmationDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
        onConfirm={handleFormatConfirm}
      />
    </div>
  );
};

export default Index;
