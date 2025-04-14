
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, BarChart, RefreshCw } from "lucide-react";
import PortableAppButton from "@/components/dashboard/PortableAppButton";
import SampleDataGenerator from "@/components/dashboard/SampleDataGenerator";
import { getCurrentFinancialYear } from "@/services/financialYearService";

interface DashboardHeaderProps {
  onOpeningBalancesClick: () => void;
}

const DashboardHeader = ({ onOpeningBalancesClick }: DashboardHeaderProps) => {
  const financialYear = getCurrentFinancialYear();
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ag-green">Kisan Khata Sahayak</h1>
          <p className="text-gray-600">Financial Year: {financialYear}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onOpeningBalancesClick}
          >
            <Calculator size={18} />
            <span className="hidden sm:inline">Opening Balances</span>
            <span className="sm:hidden">Balances</span>
          </Button>
          
          <SampleDataGenerator />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 my-6">
        <PortableAppButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
