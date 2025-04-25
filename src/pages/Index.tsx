
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardMenu from '@/components/DashboardMenu';
import BackupRestoreControls from '@/components/BackupRestoreControls';
import FormatDataHandler from '@/components/dashboard/FormatDataHandler';
import { useDashboardData } from '@/hooks/useDashboardData';
import ProfitSection from '@/components/dashboard/ProfitSection';
import MonthSelector from '@/components/dashboard/MonthSelector';
import SalesSummaryCard from '@/components/dashboard/SalesSummaryCard';
import PurchaseSummaryCard from '@/components/dashboard/PurchaseSummaryCard';
import StockSummaryCard from '@/components/dashboard/StockSummaryCard';
import { StorageDebugger } from '@/components/debug/StorageDebugger';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { createPortableVersion } from '@/services/backup/backupService';
import { toast } from 'sonner';
import { useHotkeys } from '@/hooks/useHotkeys';

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { summaryData, isLoading } = useDashboardData(selectedMonth, selectedYear);

  // Register keyboard shortcuts
  useHotkeys([
    { key: 'p', ctrl: true, handler: () => navigate('/purchases') },
    { key: 's', ctrl: true, handler: () => navigate('/sales') },
    { key: 'i', ctrl: true, handler: () => navigate('/inventory') },
    { key: 't', ctrl: true, handler: () => navigate('/location-transfer') },
    { key: 'h', ctrl: true, handler: () => navigate('/') },
    { key: 'm', ctrl: true, handler: () => navigate('/master') },
    { key: 'b', ctrl: true, handler: () => handleCreatePortable() },
    { key: 'Escape', handler: () => navigate('/') },
  ]);

  const handleFormatClick = () => {
    setShowFormatter(true);
    return true;
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    toast.info("Refreshing data...");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleCreatePortable = async () => {
    toast.info("Creating portable version...");
    const result = await createPortableVersion();
    if (result.success) {
      toast.success("Portable version created", { 
        description: "Download started. Save the ZIP file to your preferred location." 
      });
    } else {
      toast.error("Failed to create portable version", { 
        description: result.message 
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-100">
      {/* Always-visible Navigation bar with hamburger */}
      <Navigation 
        title="Kirana Retail" 
        showFormatButton 
        onFormatClick={handleFormatClick}
      />

      <main className="container mx-auto px-4 py-4">
        {/* Quick Actions - front and center, very tap-friendly */}
        <section className="w-full mb-6">
          <h2 className="text-lg md:text-2xl font-bold mb-4 text-blue-800 text-center">
            Quick Actions
          </h2>
          <div>
            <DashboardMenu />
          </div>
        </section>

        {/* Backup/Restore Panel - bold & prominent */}
        <section className="w-full mb-6">
          <BackupRestoreControls
            onRefresh={handleRefreshData}
            isRefreshing={isRefreshing}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full md:w-auto flex items-center justify-center gap-2 text-base py-4"
              onClick={handleCreatePortable}
            >
              <Download size={20} />
              Export to Portable Version
            </Button>
            {/* Help text explaining what Storage Manager does */}
            <div className="text-sm text-gray-600 italic">
              Storage Manager: View, export, or import app data
            </div>
          </div>
        </section>

        {/* Month Selector */}
        <section className="w-full mb-6">
          <MonthSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={handleMonthChange} 
          />
        </section>
        
        {/* Summary Cards - responsive grid */}
        <section className="w-full mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => navigate('/sales')}
              className="cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
            >
              <SalesSummaryCard 
                amount={summaryData.sales.amount}
                bags={summaryData.sales.bags}
                kgs={summaryData.sales.kgs}
              />
            </div>
            <div 
              onClick={() => navigate('/purchases')}
              className="cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
            >
              <PurchaseSummaryCard 
                amount={summaryData.purchases.amount}
                bags={summaryData.purchases.bags}
                kgs={summaryData.purchases.kgs}
              />
            </div>
            <div 
              onClick={() => navigate('/stock')}
              className="cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
            >
              <StockSummaryCard 
                mumbai={summaryData.stock.mumbai}
                chiplun={summaryData.stock.chiplun}
                sawantwadi={summaryData.stock.sawantwadi}
              />
            </div>
          </div>
        </section>

        {/* Profit Section (can be collapsed by user if needed, but always visible by default) */}
        <section className="w-full mb-6">
          <ProfitSection 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
          />
        </section>

        {/* Data format Handler (for advanced users; shown if needed) */}
        {showFormatter && (
          <FormatDataHandler onFormatComplete={() => setShowFormatter(false)} />
        )}
      </main>
    </div>
  );
};

export default Index;
