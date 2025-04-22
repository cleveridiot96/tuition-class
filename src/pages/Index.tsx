
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardSummary from '@/components/DashboardSummary';
import { FormatDataHandler } from '@/components/dashboard/FormatDataHandler';
import { useDashboardData } from '@/hooks/useDashboardData';
import ProfitSection from '@/components/dashboard/ProfitSection';
import MonthSelector from '@/components/dashboard/MonthSelector';
import SalesSummaryCard from '@/components/dashboard/SalesSummaryCard';
import PurchaseSummaryCard from '@/components/dashboard/PurchaseSummaryCard';
import StockSummaryCard from '@/components/dashboard/StockSummaryCard';

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { summaryData, isLoading } = useDashboardData(selectedMonth, selectedYear);

  const handleFormatClick = () => {
    setShowFormatter(true);
    return true;
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation 
        title="Kirana Retail" 
        showFormatButton 
        onFormatClick={handleFormatClick} 
        showHomeButton
      />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
          Kirana Retail
        </h1>
        
        {/* Month Selector */}
        <div className="mb-6">
          <MonthSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={handleMonthChange} 
          />
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => navigate('/sales')} 
            className="transition-transform hover:-translate-y-1 cursor-pointer md-ripple"
          >
            <SalesSummaryCard 
              amount={summaryData.sales.amount}
              bags={summaryData.sales.bags}
              kgs={summaryData.sales.kgs}
            />
          </div>
          
          <div 
            onClick={() => navigate('/purchases')} 
            className="transition-transform hover:-translate-y-1 cursor-pointer md-ripple"
          >
            <PurchaseSummaryCard 
              amount={summaryData.purchases.amount}
              bags={summaryData.purchases.bags}
              kgs={summaryData.purchases.kgs}
            />
          </div>
          
          <div 
            onClick={() => navigate('/stock')} 
            className="transition-transform hover:-translate-y-1 cursor-pointer md-ripple"
          >
            <StockSummaryCard 
              mumbai={summaryData.stock.mumbai}
              chiplun={summaryData.stock.chiplun}
              sawantwadi={summaryData.stock.sawantwadi}
            />
          </div>
        </div>
        
        {/* Profit Section */}
        <div className="mb-8">
          <ProfitSection 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
          />
        </div>
        
        {showFormatter && (
          <FormatDataHandler onFormatComplete={() => setShowFormatter(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
