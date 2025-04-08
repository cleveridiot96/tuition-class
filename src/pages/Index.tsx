
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { seedInitialData, getPurchases, getInventory, getSales, clearAllData, exportDataBackup, getPayments } from "@/services/storageService";
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
  const [dataVersion, setDataVersion] = useState(0); // Add version tracking
  
  const loadDashboardData = () => {
    setIsRefreshing(true);
    
    const purchases = getPurchases() || [];
    const sales = getSales() || [];
    
    const inventory = getInventory() || [];
    const activeInventory = inventory.filter(item => !item.isDeleted);
    const mumbaiStock = activeInventory.filter(item => item.location === "Mumbai");
    const chiplunStock = activeInventory.filter(item => item.location === "Chiplun");
    const sawantwadiStock = activeInventory.filter(item => item.location === "Sawantwadi");
    
    console.log("Purchases data loaded:", purchases);
    console.log("Sales data loaded:", sales);
    console.log("Active inventory:", activeInventory);
    
    const transactionProfits: ProfitData[] = sales.map(sale => {
      const relatedPurchase = purchases.find(p => p.lotNumber === sale.lotNumber && !p.isDeleted);
      const purchaseCost = relatedPurchase ? relatedPurchase.totalAfterExpenses : 0;
      const purchaseCostPerKg = relatedPurchase ? purchaseCost / relatedPurchase.netWeight : 0;
      
      const effectivePurchaseCost = purchaseCostPerKg * sale.netWeight;
      
      const saleRevenue = sale.totalAmount || 0;
      const brokerage = sale.broker ? saleRevenue * 0.01 : 0;
      const netSaleRevenue = saleRevenue - brokerage;
      
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
    
    const activePurchases = purchases.filter(p => !p.isDeleted);
    
    setSummaryData({
      purchases: {
        amount: activePurchases.reduce((sum, p) => sum + (p.totalAfterExpenses || 0), 0),
        bags: activePurchases.reduce((sum, p) => sum + (p.quantity || 0), 0),
        kgs: activePurchases.reduce((sum, p) => sum + (p.netWeight || 0), 0)
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
    // Initialize data on first load
    seedInitialData();
    loadDashboardData();
    
    // Remove the interval that might be causing issues
    // and just rely on window focus events and manual refresh
    
    window.addEventListener('focus', loadDashboardData);
    
    return () => {
      window.removeEventListener('focus', loadDashboardData);
    };
  }, []);

  // Add effect to reload data when version changes
  useEffect(() => {
    if (dataVersion > 0) {
      loadDashboardData();
    }
  }, [dataVersion]);

  const handleFormatClick = () => {
    setIsFormatDialogOpen(true);
  };

  const handleFormatConfirm = async () => {
    try {
      console.log("Format operation starting...");
      toast({
        title: "Format in progress",
        description: "Creating backup and resetting data...",
      });
      
      // Create backup first - important to do before clearing
      const backupData = exportDataBackup(true);
      console.log("Backup created:", backupData ? "Success" : "Failed");
      
      if (backupData) {
        // Store backup in localStorage
        localStorage.setItem('preFormatBackup', backupData);
        
        // Clear everything from storage - CRITICAL STEP
        console.log("Clearing all data...");
        clearAllData();
        
        // Force clear all known storage items individually to be absolutely certain
        const storageKeys = [
          "purchases", "sales", "inventory", "payments", "receipts", 
          "agents", "brokers", "customers", "transporters"
        ];
        
        storageKeys.forEach(key => {
          console.log(`Removing ${key} from localStorage`);
          localStorage.removeItem(key);
        });
        
        // Small delay to ensure clearing is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Explicitly check if data is cleared
        const checkPurchases = getPurchases();
        console.log("Purchases after clear:", checkPurchases);
        
        // Reseed with fresh data - make sure force is true
        console.log("Reseeding with fresh data...");
        seedInitialData(true);
        
        // Another small delay to ensure seeding is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Increment version to trigger data reload
        setDataVersion(prev => prev + 1);
        
        // Force refresh dashboard data immediately
        console.log("Reloading dashboard data...");
        loadDashboardData();
        
        toast({
          title: "Data Formatted Successfully",
          description: "All data has been reset to initial state. A backup was created automatically.",
        });
      } else {
        throw new Error("Failed to create backup data");
      }
    } catch (error) {
      console.error("Error during formatting:", error);
      toast({
        title: "Format Error",
        description: "There was a problem formatting the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormatDialogOpen(false);
    }
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
