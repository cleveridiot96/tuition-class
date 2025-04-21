
import React from "react";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";

interface SalesFormActionsProps {
  initialData?: any;
  onPrint?: () => void;
  isSubmitting?: boolean;
}

const SalesFormActions: React.FC<SalesFormActionsProps> = ({
  initialData,
  onPrint,
  isSubmitting,
}) => (
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    {initialData && onPrint && (
      <Button
        type="button"
        variant="outline"
        onClick={onPrint}
        className="w-full sm:w-auto"
      >
        <PrinterIcon size={16} className="mr-2" />
        Print
      </Button>
    )}
    <Button
      type="submit"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto"
      disabled={isSubmitting}
    >
      {initialData ? "Update Sale" : "Add Sale"}
    </Button>
  </div>
);

export default SalesFormActions;
