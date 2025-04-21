
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardSummary from '@/components/DashboardSummary';
import DashboardMenu from '@/components/DashboardMenu';
import { FormatDataHandler } from '@/components/dashboard/FormatDataHandler';
import { useDashboardData } from '@/hooks/useDashboardData';
import ProfitSection from '@/components/dashboard/ProfitSection';
import MonthSelector from '@/components/dashboard/MonthSelector';

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Fetch dashboard data
  const { summaryData, isLoading } = useDashboardData(selectedMonth, selectedYear);

  const handleFormatClick = () => {
    setShowFormatter(true);
    return true; // Indicate that we're handling the format click
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation 
        title="KKS - Kisan Khata Sahayak" 
        showFormatButton 
        onFormatClick={handleFormatClick} 
        showHomeButton
      />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-ag-brown-dark">
          Kisan Khata Sahayak
        </h1>
        
        {/* Quick Access Panel - Now moved to the top */}
        <div className="mb-8">
          <DashboardMenu />
        </div>
        
        {/* Month Selector */}
        <div className="mb-6">
          <MonthSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={handleMonthChange} 
          />
        </div>
        
        {/* Summary Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <DashboardSummary summaryData={summaryData} />
        )}
        
        {/* Profit Section */}
        <div className="mt-8">
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
