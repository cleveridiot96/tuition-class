
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import YearSelector from "@/components/YearSelector";
import { Settings, Home } from "lucide-react";
import { Link } from 'react-router-dom';
import { usePortableApp } from '@/hooks/usePortableApp';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  onOpeningBalancesClick: () => void;
}

const DashboardHeader = ({ onOpeningBalancesClick }: DashboardHeaderProps) => {
  // Initialize portable app support
  const { isPortableMode } = usePortableApp();
  
  useEffect(() => {
    // Show notification for portable mode
    if (isPortableMode) {
      toast.success("Portable mode activated");
    }
  }, [isPortableMode]);
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold text-ag-brown-dark">
          Business Management Software
        </h2>
        <Link to="/" className="ml-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>
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
