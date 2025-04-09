
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface TransactionButtonsProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExpenseDialogOpen: () => void;
  onPaymentDialogOpen: () => void;
  onReceiptDialogOpen: () => void;
}

const TransactionButtons = ({
  onRefresh,
  isLoading,
  onExpenseDialogOpen,
  onPaymentDialogOpen,
  onReceiptDialogOpen,
}: TransactionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw size={16} className={isLoading ? "animate-spin mr-2" : "mr-2"} />
        Refresh
      </Button>
      <div className="dropdown">
        <Button size="sm">
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
        <div className="dropdown-content z-50 bg-white border rounded-md shadow-lg mt-2 p-2 w-48">
          <Button
            variant="ghost"
            className="w-full flex justify-start mb-1"
            onClick={onExpenseDialogOpen}
          >
            Add Expense
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start mb-1"
            onClick={onPaymentDialogOpen}
          >
            Add Payment
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start"
            onClick={onReceiptDialogOpen}
          >
            Add Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionButtons;
