
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardSummary from "@/components/DashboardSummary";
import DashboardMenu from "@/components/DashboardMenu";
import SampleDataGenerator from '@/components/SampleDataGenerator';
import { seedInitialData } from '@/services/storageUtils';
import { initializeFinancialYears } from "@/services/financialYearService";

const Index = () => {
  useEffect(() => {
    // Initialize data on first load if needed
    seedInitialData();
    initializeFinancialYears();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Dashboard" />
      <div className="container mx-auto p-4 md:p-6">
        <SampleDataGenerator />
        <DashboardSummary />
        <DashboardMenu />
        
        {/* Additional info section at the bottom */}
        <div className="mt-8 p-4 bg-muted rounded-lg border">
          <h3 className="font-medium mb-2">Quick Tips</h3>
          <ul className="space-y-1 text-sm">
            <li>• Go to <Link to="/ledger" className="text-primary underline">Ledger</Link> to view party balances and transaction history</li>
            <li>• Visit <Link to="/cashbook" className="text-primary underline">Cash Book</Link> to track cash flow</li>
            <li>• Create sample data using the generator above to see the app in action</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
