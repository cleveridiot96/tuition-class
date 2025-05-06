
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface LedgerActionsProps {
  onPrint: () => void;
  onExport: () => void;
}

const LedgerActions = ({ onPrint, onExport }: LedgerActionsProps) => {
  return (
    <div className="mt-4 flex justify-end space-x-2 print:hidden">
      <Button variant="outline" onClick={onPrint} className="flex items-center gap-2">
        <Printer size={16} />
        Print
      </Button>
      <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
        <FileSpreadsheet size={16} />
        Export to Excel
      </Button>
    </div>
  );
};

export default LedgerActions;
