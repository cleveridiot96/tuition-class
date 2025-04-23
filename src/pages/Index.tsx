
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardMenu from '@/components/DashboardMenu';
import BackupRestoreControls from '@/components/BackupRestoreControls';
import { FormatDataHandler } from '@/components/dashboard/FormatDataHandler';
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

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { summaryData, isLoading } = useDashboardData(selectedMonth, selectedYear);

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
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleCreatePortable = async () => {
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

      <main className="w-full md:max-w-md mx-auto px-0 md:px-0 py-0">
        {/* Quick Actions - front and center, very tap-friendly */}
        <section className="w-full px-2 pt-2 md:pt-4">
          <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-blue-800 text-center">
            Quick Actions
          </h2>
          <div>
            <DashboardMenu />
          </div>
        </section>

        {/* Backup/Restore Panel - bold & prominent */}
        <section className="w-full px-2 mt-4">
          <BackupRestoreControls
            onRefresh={handleRefreshData}
            isRefreshing={isRefreshing}
          />
          <div className="flex flex-col items-stretch md:flex-row md:items-center md:justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full md:w-auto flex items-center justify-center gap-2 text-base md:text-lg py-4"
              onClick={handleCreatePortable}
            >
              <Download size={20} />
              Export to Portable Version
            </Button>
            <StorageDebugger />
          </div>
        </section>

        {/* Month Selector */}
        <section className="w-full px-2 mt-4">
          <MonthSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={handleMonthChange} 
          />
        </section>
        
        {/* Summary Cards - one column for mobile */}
        <section className="w-full px-2 mt-4">
          <div className="grid grid-cols-1 gap-4">
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
        <section className="w-full px-2 mt-4">
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

