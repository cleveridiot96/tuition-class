
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardSummary from "@/components/DashboardSummary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMenu from "@/components/DashboardMenu";
import { seedInitialData } from '@/services/storageUtils';
import { initializeFinancialYears } from "@/services/financialYearService";
import { getDashboardSummary } from "@/services/calculationServices";
import StockReport from "@/components/StockReport";
import ProfitLossStatement from "@/components/ProfitLossStatement";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const [openingBalancesOpen, setOpeningBalancesOpen] = useState(false);
  const {
    summaryData,
    profitByTransaction,
    profitByMonth,
    totalProfit,
    loadDashboardData,
  } = useDashboardData();

  useEffect(() => {
    // Initialize data on first load if needed
    seedInitialData();
    initializeFinancialYears();
    loadDashboardData();

    // Listen for storage events
    window.addEventListener('storage', loadDashboardData);
    return () => window.removeEventListener('storage', loadDashboardData);
  }, [loadDashboardData]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Dashboard" />
      <div className="container mx-auto p-4 md:p-6">
        <DashboardHeader 
          onOpeningBalancesClick={() => setOpeningBalancesOpen(true)} 
        />
        
        <DashboardSummary summaryData={summaryData} />
        
        <div className="grid gap-6">
          <ProfitLossStatement 
            profitByTransaction={profitByTransaction}
            profitByMonth={profitByMonth}
            totalProfit={totalProfit}
          />
          
          <StockReport />
        </div>
        
        <DashboardMenu />
        
        {/* Additional info section at the bottom */}
        <div className="mt-8 p-4 bg-muted rounded-lg border">
          <h3 className="font-medium mb-2">Quick Tips</h3>
          <ul className="space-y-1 text-sm">
            <li>• Go to <Link to="/ledger" className="text-primary underline">Ledger</Link> to view party balances and transaction history</li>
            <li>• Visit <Link to="/cashbook" className="text-primary underline">Cash Book</Link> to track cash flow</li>
            <li>• Create sample data using the generator in Dashboard Header</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
