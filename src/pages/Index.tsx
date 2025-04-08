
import React, { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw } from "lucide-react";
import { exportDataBackup, importDataBackup, seedInitialData, getPurchases, getInventory, getSales, clearAllData } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      const relatedPurchase = purchases.find(p => p.lotNumber === sale.lotNumber);
      const purchaseCost = relatedPurchase ? relatedPurchase.totalAfterExpenses : 0;
      
      // Calculate sale revenue considering brokerage (1%)
      const saleRevenue = sale.totalAmount || 0;
      const brokerage = sale.broker ? saleRevenue * 0.01 : 0;
      const netSaleRevenue = saleRevenue - brokerage;
      
      const profit = Math.round(netSaleRevenue - purchaseCost);
      const profitPerKg = profit / (sale.netWeight || 1);
      const totalProfit = profitPerKg * sale.netWeight;
      
      return {
        purchase: purchaseCost,
        sale: netSaleRevenue,
        profit: totalProfit,
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
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importDataBackup(content);
      
      if (success) {
        toast({
          title: "Data Import Successful",
          description: "All data successfully imported",
        });
        loadDashboardData();
      } else {
        toast({
          title: "Import Failed",
          description: "There was a problem importing data",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleExportBackup = () => {
    const jsonData = exportDataBackup();
    if (jsonData) {
      toast({
        title: "Backup Created",
        description: "Data backup successfully downloaded",
      });
    } else {
      toast({
        title: "Backup Failed",
        description: "There was a problem creating the backup",
        variant: "destructive",
      });
    }
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const SummaryCard = ({ 
    title, 
    to, 
    children, 
    className 
  }: { 
    title: string; 
    to: string; 
    children: React.ReactNode; 
    className?: string 
  }) => (
    <Link to={to} className="block hover:opacity-90 transition-opacity">
      <Card className={`p-4 shadow-md hover:shadow-lg transition-shadow ${className || ''}`}>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">{title}</h3>
        {children}
      </Card>
    </Link>
  );

  const SummaryItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="text-center">
      <p className="text-sm text-ag-brown">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );

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
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={handleExportBackup}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download size={20} />
              Backup
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Upload size={20} />
              Restore
            </Button>
            <Button
              onClick={loadDashboardData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
        <DashboardMenu />
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SummaryCard title="Purchase Summary" to="/purchases">
            <div className="grid grid-cols-3 gap-2">
              <SummaryItem label="Amount" value={formatCurrency(summaryData.purchases.amount)} />
              <SummaryItem label="Bags" value={summaryData.purchases.bags} />
              <SummaryItem label="Kgs" value={summaryData.purchases.kgs} />
            </div>
          </SummaryCard>
          
          <SummaryCard title="Sales Summary" to="/sales">
            <div className="grid grid-cols-3 gap-2">
              <SummaryItem label="Amount" value={formatCurrency(summaryData.sales.amount)} />
              <SummaryItem label="Bags" value={summaryData.sales.bags} />
              <SummaryItem label="Kgs" value={summaryData.sales.kgs} />
            </div>
          </SummaryCard>
        </div>
        
        <SummaryCard title="Stock Summary" to="/inventory" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <SummaryItem label="Mumbai" value={`${summaryData.stock.mumbai} bags`} />
            <SummaryItem label="Chiplun" value={`${summaryData.stock.chiplun} bags`} />
            <SummaryItem label="Sawantwadi" value={`${summaryData.stock.sawantwadi} bags`} />
          </div>
        </SummaryCard>
        
        {/* Profit and Loss Section */}
        <Card className="mt-6 p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4 border-b pb-1">Profit & Loss Statement</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction-wise profit */}
            <div>
              <h4 className="font-medium text-ag-brown mb-2">Transaction-wise</h4>
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 grid grid-cols-5 font-medium">
                  <div className="p-2">Date</div>
                  <div className="p-2">Purchase</div>
                  <div className="p-2">Sale</div>
                  <div className="p-2">Qty (kg)</div>
                  <div className="p-2">Profit</div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {profitByTransaction.length === 0 ? (
                    <div className="p-2 text-center text-gray-500">No transaction data available</div>
                  ) : (
                    profitByTransaction.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-5 border-t">
                        <div className="p-2">{format(parseISO(item.date), 'dd/MM/yy')}</div>
                        <div className="p-2">{formatCurrency(item.purchase)}</div>
                        <div className="p-2">{formatCurrency(item.sale)}</div>
                        <div className="p-2">{item.netWeight}</div>
                        <div className={`p-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.profit)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Monthly profit */}
            <div>
              <h4 className="font-medium text-ag-brown mb-2">Month-wise</h4>
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 grid grid-cols-2 font-medium">
                  <div className="p-2">Month</div>
                  <div className="p-2">Profit</div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {profitByMonth.length === 0 ? (
                    <div className="p-2 text-center text-gray-500">No monthly data available</div>
                  ) : (
                    profitByMonth.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-2 border-t">
                        <div className="p-2">{item.month}</div>
                        <div className={`p-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.profit)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Total profit */}
          <div className="mt-4 bg-gray-50 p-3 rounded-md flex justify-between items-center">
            <span className="font-medium">Total Profit/Loss:</span>
            <span className={`font-bold text-xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </span>
          </div>
        </Card>
        
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
