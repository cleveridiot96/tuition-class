import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardSummary from "@/components/DashboardSummary";
import DashboardMenu from "@/components/DashboardMenu";
import { seedInitialData } from '@/services/storageUtils';
import { initializeFinancialYears } from "@/services/financialYearService";
import { getSales, getPurchases, getPayments, getReceipts } from "@/services/storageService";

const Index = () => {
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalPayments: 0,
    totalReceipts: 0
  });

  useEffect(() => {
    // Initialize data on first load if needed
    seedInitialData();
    initializeFinancialYears();

    // Load summary data
    const loadSummaryData = () => {
      try {
        const sales = getSales();
        const purchases = getPurchases();
        const payments = getPayments();
        const receipts = getReceipts();
        
        const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
        const totalPurchases = purchases.reduce((sum, purchase) => sum + (purchase.totalAmount || 0), 0);
        const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalReceipts = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

        setSummaryData({ totalSales, totalPurchases, totalPayments, totalReceipts });
      } catch (error) {
        console.error("Error loading summary data:", error);
      }
    };

    loadSummaryData();
    
    // Listen for storage events
    window.addEventListener('storage', loadSummaryData);
    return () => window.removeEventListener('storage', loadSummaryData);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Dashboard" />
      <div className="container mx-auto p-4 md:p-6">
        <DashboardSummary summaryData={summaryData} />
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
