
import React, { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { Button } from "@/components/ui/button";
import { Download, Upload, Home } from "lucide-react";
import { exportDataBackup, importDataBackup, seedInitialData, getPurchases, getSales, getInventoryByLocation } from "@/services/storageService";
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
  
  useEffect(() => {
    // Seed initial data when the app first loads
    seedInitialData();
    
    // Load summary data
    const purchases = getPurchases();
    const sales = getSales();
    const mumbaiStock = getInventoryByLocation("Mumbai");
    const chiplunStock = getInventoryByLocation("Chiplun");
    const sawantwadiStock = getInventoryByLocation("Sawantwadi");
    
    setSummaryData({
      purchases: {
        amount: purchases.reduce((sum, p) => sum + p.totalAfterExpenses, 0),
        bags: purchases.reduce((sum, p) => sum + p.quantity, 0),
        kgs: purchases.reduce((sum, p) => sum + p.netWeight, 0)
      },
      sales: {
        amount: sales.reduce((sum, s) => sum + s.amount, 0),
        bags: sales.reduce((sum, s) => sum + s.quantity, 0),
        kgs: sales.reduce((sum, s) => sum + (s.netWeight || 0), 0)
      },
      stock: {
        mumbai: mumbaiStock.reduce((sum, item) => sum + item.quantity, 0),
        chiplun: chiplunStock.reduce((sum, item) => sum + item.quantity, 0),
        sawantwadi: sawantwadiStock.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
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
          title: "डेटा इम्पोर्ट सफल",
          description: "सभी डेटा सफलतापूर्वक इम्पोर्ट किया गया",
        });
      } else {
        toast({
          title: "इम्पोर्ट विफल",
          description: "डेटा इम्पोर्ट करने में समस्या आई",
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="होम (Home)" showHomeButton />
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ag-brown-dark">
            किसान खाता सहायक
          </h2>
          <p className="text-lg text-ag-brown mt-2">
            आपका कृषि व्यापार प्रबंधन सॉफ्टवेयर
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={exportDataBackup}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download size={20} />
              बैकअप (Backup)
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Upload size={20} />
              रिस्टोर (Restore)
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
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">खरीदी सारांश (Purchase Summary)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-sm text-ag-brown">राशि (Amount)</p>
                <p className="text-xl font-bold">{formatCurrency(summaryData.purchases.amount)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">बैग (Bags)</p>
                <p className="text-xl font-bold">{summaryData.purchases.bags}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">किलो (Kgs)</p>
                <p className="text-xl font-bold">{summaryData.purchases.kgs}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">बिक्री सारांश (Sales Summary)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-sm text-ag-brown">राशि (Amount)</p>
                <p className="text-xl font-bold">{formatCurrency(summaryData.sales.amount)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">बैग (Bags)</p>
                <p className="text-xl font-bold">{summaryData.sales.bags}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-ag-brown">किलो (Kgs)</p>
                <p className="text-xl font-bold">{summaryData.sales.kgs}</p>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="mt-6 p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">स्टॉक सारांश (Stock Summary)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-ag-brown">Mumbai</p>
              <p className="text-xl font-bold">{summaryData.stock.mumbai} बैग</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ag-brown">Chiplun</p>
              <p className="text-xl font-bold">{summaryData.stock.chiplun} बैग</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ag-brown">Sawantwadi</p>
              <p className="text-xl font-bold">{summaryData.stock.sawantwadi} बैग</p>
            </div>
          </div>
        </Card>
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-ag-brown-dark mb-2">ऑफलाइन मोड (Offline Mode)</h3>
          <p className="text-ag-brown">
            यह ऐप पूरी तरह से ऑफ़लाइन काम करता है। आपका सारा डेटा आपके कंप्यूटर में सुरक्षित है।
            नियमित रूप से बैकअप लें।
          </p>
          <p className="text-ag-brown mt-2">
            This app works completely offline. All your data is securely stored on your computer.
            Remember to take regular backups.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
