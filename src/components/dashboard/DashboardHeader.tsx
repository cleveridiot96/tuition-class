
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, Download, Upload } from "lucide-react";
import PortableAppButton from "@/components/dashboard/PortableAppButton";
import { generateSampleData } from "@/utils/dataGeneratorUtils";
import { toast } from "sonner";
import { getCurrentFinancialYear } from "@/services/financialYearService";
import { exportDataBackup, importDataBackup } from "@/services/storageUtils";

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
      
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error("Failed to generate sample data. Please try again.", {
        id: "generate-sample-data"
      });
    }
  };
  
  const handleBackup = () => {
    try {
      exportDataBackup();
      toast.success("Backup file downloaded successfully!");
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to create backup. Please try again.");
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            const success = importDataBackup(content);
            if (success) {
              window.dispatchEvent(new Event('storage'));
              toast.success("Data restored successfully!");
            }
          } catch (error) {
            console.error("Import error:", error);
            toast.error("Failed to restore data. Invalid backup file.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleRefresh = () => {
    window.dispatchEvent(new Event('storage'));
    toast.success("Data refreshed successfully!");
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ag-green">Kisan Khata Sahayak</h1>
          <p className="text-gray-600">Financial Year: {financialYear?.toString()}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleBackup}
          >
            <Download size={18} />
            <span>Backup</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRestore}
          >
            <Upload size={18} />
            <span>Restore</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onOpeningBalancesClick}
          >
            <Database size={18} />
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
