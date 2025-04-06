import React, { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportDataBackup, importDataBackup, seedInitialData, getPurchases, getInventory, getSales } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
    seedInitialData();
    
    const purchases = getPurchases();
    const sales = getSales() || [];
    
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
    
    window.addEventListener('focus', loadDashboardData);
    
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
