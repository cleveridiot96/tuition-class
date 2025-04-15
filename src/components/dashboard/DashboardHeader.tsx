
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw } from "lucide-react";
import PortableAppButton from "@/components/dashboard/PortableAppButton";
import { exportDataBackup, importDataBackup } from "@/services/storageUtils";
import { getCurrentFinancialYear } from "@/services/financialYearService";
import { toast } from "sonner";

interface DashboardHeaderProps {
  onOpeningBalancesClick: () => void;
}

const DashboardHeader = ({ onOpeningBalancesClick }: DashboardHeaderProps) => {
  const financialYear = getCurrentFinancialYear();
  
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
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <PortableAppButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
