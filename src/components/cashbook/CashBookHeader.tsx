
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet, Save } from "lucide-react";

interface CashBookHeaderProps {
  onPrint?: () => void;
  onExportToExcel?: () => void;
  onBackupData?: () => void;
}

const CashBookHeader: React.FC<CashBookHeaderProps> = ({
  onPrint,
  onExportToExcel,
  onBackupData
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-semibold">Cash Book</h2>
      
      <div className="flex gap-2">
        {onPrint && (
          <Button 
            variant="outline" 
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        )}
        
        {onExportToExcel && (
          <Button 
            variant="outline" 
            onClick={onExportToExcel}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}
        
        {onBackupData && (
          <Button 
            variant="default" 
            onClick={onBackupData}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CashBookHeader;
