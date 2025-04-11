
import React from 'react';
import { Button } from "@/components/ui/button";
import YearSelector from "@/components/YearSelector";
import { Settings } from "lucide-react";

interface DashboardHeaderProps {
  onOpeningBalancesClick: () => void;
}

const DashboardHeader = ({ onOpeningBalancesClick }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h2 className="text-4xl font-bold text-ag-brown-dark">
        Business Management Software
      </h2>
      <div className="flex items-center space-x-4">
        <YearSelector />
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onOpeningBalancesClick}
          className="text-lg"
        >
          <Settings className="h-5 w-5 mr-2" />
          Opening Balances
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
