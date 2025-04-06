
import React, { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportDataBackup, importDataBackup, seedInitialData, getPurchases, getInventory, getSales } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [summaryData, setSummaryData] = useState({
    purchases: { amount: 0, bags: 0, kgs: 0 },
    sales: { amount: 0, bags: 0, kgs: 0 },
    stock: { mumbai: 0, chiplun: 0, sawantwadi: 0 }
  });
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  
  const loadDashboardData = () => {
    // Seed initial data when the app first loads
    seedInitialData();
    
    // Load summary data
    const purchases = getPurchases();
    // Get sales data
    const sales = getSales() || [];
    
    // Get inventory by location
    const inventory = getInventory();
    const mumbaiStock = inventory.filter(item => item.location === "Mumbai");
    const chiplunStock = inventory.filter(item => item.location === "Chiplun");
    const sawantwadiStock = inventory.filter(item => item.location === "Sawantwadi");
    
    setSummaryData({
      purchases: {
        amount: purchases.reduce((sum, p) => sum + p.totalAfterExpenses, 0),
        bags: purchases.reduce((sum, p) => sum + p.quantity, 0),
        kgs: purchases.reduce((sum, p) => sum + p.netWeight, 0)
      },
      sales: {
        amount: sales.reduce((sum, s) => sum + (s.amount || 0), 0),
        bags: sales.reduce((sum, s) => sum + (s.quantity || 0), 0),
        kgs: sales.reduce((sum, s) => sum + (s.netWeight || 0), 0)
      },
      stock: {
        mumbai: mumbaiStock.reduce((sum, item) => sum + item.quantity, 0),
        chiplun: chiplunStock.reduce((sum, item) => sum + item.quantity, 0),
        sawantwadi: sawantwadiStock.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  };
  
  useEffect(() => {
    loadDashboardData();
    
    // Add event listener to refresh the dashboard data when the window gets focus
    window.addEventListener('focus', loadDashboardData);
    
    // Clean up event listener
    return () => {
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
        loadDashboardData(); // Refresh data after import
      } else {
        toast({
          title: "Import Failed",
          description: "There was a problem importing data",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleFormatClick = () => {
    setIsFormatDialogOpen(true);
  };

  const handleFormatConfirm = () => {
    // Create automatic backup before formatting
    try {
      const backupData = exportDataBackup(true); // true means silent mode - no toast
      if (backupData) {
        // Store the backup in localStorage as an additional safety measure
        localStorage.setItem('preFormatBackup', backupData);
        
        // Now proceed with formatting
        seedInitialData(true); // true means force re-seed
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
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={exportDataBackup}
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
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Purchase Summary</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-sm text-ag-brown">Amount</p>
                <p className="text-xl font-bold">{formatCurrency(summaryData.purchases.amount)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">Bags</p>
                <p className="text-xl font-bold">{summaryData.purchases.bags}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">Kgs</p>
                <p className="text-xl font-bold">{summaryData.purchases.kgs}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Sales Summary</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-sm text-ag-brown">Amount</p>
                <p className="text-xl font-bold">{formatCurrency(summaryData.sales.amount)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">Bags</p>
                <p className="text-xl font-bold">{summaryData.sales.bags}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">Kgs</p>
                <p className="text-xl font-bold">{summaryData.sales.kgs}</p>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="mt-6 p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Stock Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-ag-brown">Mumbai</p>
              <p className="text-xl font-bold">{summaryData.stock.mumbai} bags</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ag-brown">Chiplun</p>
              <p className="text-xl font-bold">{summaryData.stock.chiplun} bags</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ag-brown">Sawantwadi</p>
              <p className="text-xl font-bold">{summaryData.stock.sawantwadi} bags</p>
            </div>
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

      {/* Format confirmation dialog */}
      <FormatConfirmationDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
        onConfirm={handleFormatConfirm}
      />
    </div>
  );
};

export default Index;
