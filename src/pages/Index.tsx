import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { FormatDataHandler } from "@/components/dashboard/FormatDataHandler";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BackupRestoreControls from "@/components/BackupRestoreControls";
import ProfitLossStatement from "@/components/ProfitLossStatement";
import DashboardSummary from "@/components/DashboardSummary";
import { seedInitialData } from "@/services/storageService";
import { initializeFinancialYears } from "@/services/financialYearService";
import OpeningBalanceSetup from "@/components/OpeningBalanceSetup";
import { toast } from "@/hooks/use-toast"; // Use direct import for toast function

const Index = () => {
  // Remove the useToast() call that's causing the error
  const [showOpeningBalanceSetup, setShowOpeningBalanceSetup] = useState(false);
  
  const {
    summaryData,
    profitByTransaction,
    profitByMonth,
    totalProfit,
    isRefreshing,
    dataVersion,
    loadDashboardData,
    incrementDataVersion
  } = useDashboardData();

  useEffect(() => {
    const handleBackupCreated = (event: CustomEvent) => {
      if (event.detail.success) {
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

    window.addEventListener('backup-created', handleBackupCreated as EventListener);
    
    return () => {
      window.removeEventListener('backup-created', handleBackupCreated as EventListener);
    };
  }, []);
  
  useEffect(() => {
    try {
      initializeFinancialYears();
      seedInitialData();
      loadDashboardData();
    } catch (error) {
      console.error("Error during initialization:", error);
    }
    
    const handleFocus = () => {
      loadDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadDashboardData]);

  useEffect(() => {
    if (dataVersion > 0) {
      loadDashboardData();
    }
  }, [dataVersion, loadDashboardData]);

  useEffect(() => {
    const handleRouteChange = () => {
      loadDashboardData();
    };
    
    handleRouteChange();
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [loadDashboardData]);

  const handleOpeningBalances = () => {
    setShowOpeningBalanceSetup(true);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation 
        title="Dashboard" 
        showFormatButton={true}
        onFormatClick={() => document.dispatchEvent(new Event('format-click'))}
      />
      
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader onOpeningBalancesClick={handleOpeningBalances} />
        
        <p className="text-lg text-ag-brown mt-2 mb-4 text-center">
          Agricultural Business Management System
        </p>
        
        <BackupRestoreControls 
          onRefresh={loadDashboardData} 
          isRefreshing={isRefreshing} 
        />
        
        <DashboardMenu />
        
        <DashboardSummary summaryData={summaryData} />
        
        <ProfitLossStatement 
          profitByTransaction={profitByTransaction}
          profitByMonth={profitByMonth}
          totalProfit={totalProfit}
        />
      </div>
      
      <OpeningBalanceSetup 
        isOpen={showOpeningBalanceSetup}
        onClose={() => setShowOpeningBalanceSetup(false)}
      />
      
      <FormatDataHandler onFormatComplete={loadDashboardData} />
    </div>
  );
};

export default Index;
