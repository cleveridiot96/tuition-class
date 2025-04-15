
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Database, RefreshCw } from "lucide-react";
import PortableAppButton from "@/components/dashboard/PortableAppButton";
import { generateSampleData } from "@/utils/dataGeneratorUtils";
import { toast } from "sonner";
import { getCurrentFinancialYear } from "@/services/financialYearService";

interface DashboardHeaderProps {
  onOpeningBalancesClick: () => void;
}

const DashboardHeader = ({ onOpeningBalancesClick }: DashboardHeaderProps) => {
  const financialYear = getCurrentFinancialYear();
  
  const handleGenerateData = async () => {
    try {
      toast.info("Generating 200 sample transactions...", {
        duration: 0,
        id: "generate-sample-data"
      });
      
      const stats = await generateSampleData();
      
      toast.success(`Successfully generated ${stats.totalCount} transactions!`, {
        id: "generate-sample-data"
      });
      
      window.dispatchEvent(new Event('data-updated'));
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error("Failed to generate sample data. Please try again.", {
        id: "generate-sample-data"
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ag-green">Kisan Khata Sahayak</h1>
          <p className="text-gray-600">Financial Year: {financialYear?.toString()}</p>
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
          
          <Button
            onClick={handleGenerateData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Database size={16} />
            Generate Sample Data
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 my-6">
        <PortableAppButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
