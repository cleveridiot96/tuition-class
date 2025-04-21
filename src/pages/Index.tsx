
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardSummary from '@/components/DashboardSummary';
import DashboardMenu from '@/components/DashboardMenu';
import { FormatDataHandler } from '@/components/dashboard/FormatDataHandler';
import { useDashboardData } from '@/hooks/useDashboardData';

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  // Fetch dashboard data
  const { summaryData } = useDashboardData();

  const handleFormatClick = () => {
    setShowFormatter(true);
    return true; // Indicate that we're handling the format click
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="KKS - Kisan Khata Sahayak" showFormatButton onFormatClick={handleFormatClick} />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Kisan Khata Sahayak</h1>
        
        <DashboardSummary summaryData={summaryData} />
        
        <div className="mt-8">
          <DashboardMenu />
        </div>
        
        {showFormatter && (
          <FormatDataHandler onFormatComplete={() => setShowFormatter(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
