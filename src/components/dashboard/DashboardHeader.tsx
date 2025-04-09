
import React from 'react';
import { Button } from "@/components/ui/button";
import YearSelector from "@/components/YearSelector";
import { Settings } from "lucide-react";

interface DashboardHeaderProps {
  onOpeningBalancesClick: () => void;
}

const DashboardHeader = ({ onOpeningBalancesClick }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-ag-brown-dark">
        Business Management Software
      </h2>
      <div className="flex items-center space-x-4">
        <YearSelector />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onOpeningBalancesClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Opening Balances
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
