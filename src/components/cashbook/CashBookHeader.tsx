
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet, Download } from "lucide-react";

interface CashBookHeaderProps {
  onPrint: () => void;
  onExportToExcel: () => void;
  onBackupData: () => void;
}

const CashBookHeader = ({ onPrint, onExportToExcel, onBackupData }: CashBookHeaderProps) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h2 className="text-xl font-bold">Cash Book</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your cash transactions and expenses
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrint}
        >
          <Printer size={16} className="mr-2" />
          Print
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onExportToExcel}
        >
          <FileSpreadsheet size={16} className="mr-2" />
          Export
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onBackupData}
        >
          <Download size={16} className="mr-2" />
          Backup All Data
        </Button>
      </div>
    </div>
  );
};

export default CashBookHeader;
