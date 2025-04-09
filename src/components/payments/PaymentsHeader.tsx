
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface PaymentsHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({ 
  onRefresh,
  isRefreshing 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Payment Entries</h1>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh data"
          className="mr-2"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
        </Button>
        <DialogTrigger asChild>
          <Button>
            <Plus size={18} className="mr-1" /> Add Payment
          </Button>
        </DialogTrigger>
      </div>
    </div>
  );
};

export default PaymentsHeader;
