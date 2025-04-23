
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
import { useHotkeys } from '@/hooks/useHotkeys';
import { GlassmorphismButton } from '@/components/ui/glassmorphism-button';

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { summaryData, isLoading } = useDashboardData(selectedMonth, selectedYear);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation 
        title="Kirana Retail" 
        showFormatButton 
        onFormatClick={handleFormatClick}
      />

      <main className="container mx-auto px-4 py-4 animate-fade-in">
        <section className="w-full mb-6 transform transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="backdrop-blur-xl bg-white/30 p-6 rounded-xl border border-white/20 shadow-xl">
            <DashboardMenu />
          </div>
        </section>

        <section className="w-full mb-6 transform transition-all duration-500 hover:scale-[1.01]">
          <BackupRestoreControls
            onRefresh={handleRefreshData}
            isRefreshing={isRefreshing}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
            <GlassmorphismButton 
              variant="purple"
              size="lg"
              className="w-full md:w-auto flex items-center justify-center gap-2 text-base py-4"
              onClick={handleCreatePortable}
            >
              <Download size={20} />
              Export to Portable Version
            </GlassmorphismButton>
            <div className="text-sm text-gray-600 italic">
              Storage Manager: View, export, or import app data
            </div>
          </div>
        </section>

        <section className="w-full mb-6 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="backdrop-blur-xl bg-white/30 p-4 rounded-xl border border-white/20 shadow-xl">
            <MonthSelector 
              selectedMonth={selectedMonth} 
              selectedYear={selectedYear} 
              onChange={handleMonthChange} 
            />
          </div>
        </section>
        
        <section className="w-full mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => navigate('/sales')}
              className="cursor-pointer"
            >
              <SalesSummaryCard 
                amount={summaryData.sales.amount}
                bags={summaryData.sales.bags}
                kgs={summaryData.sales.kgs}
              />
            </div>
            <div 
              onClick={() => navigate('/purchases')}
              className="cursor-pointer"
            >
              <PurchaseSummaryCard 
                amount={summaryData.purchases.amount}
                bags={summaryData.purchases.bags}
                kgs={summaryData.purchases.kgs}
              />
            </div>
            <div 
              onClick={() => navigate('/stock')}
              className="cursor-pointer"
            >
              <StockSummaryCard 
                mumbai={summaryData.stock.mumbai}
                chiplun={summaryData.stock.chiplun}
                sawantwadi={summaryData.stock.sawantwadi}
              />
            </div>
          </div>
        </section>

        <section className="w-full mb-6 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="backdrop-blur-xl bg-white/30 p-6 rounded-xl border border-white/20 shadow-xl">
            <ProfitSection 
              selectedMonth={selectedMonth} 
              selectedYear={selectedYear} 
            />
          </div>
        </section>

        {showFormatter && (
          <FormatDataHandler onFormatComplete={() => setShowFormatter(false)} />
        )}
      </main>
    </div>
  );
};

export default Index;
