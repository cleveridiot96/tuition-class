
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onChange: (month: number, year: number) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  selectedMonth,
  selectedYear,
  onChange
}) => {
  const currentDate = new Date(selectedYear, selectedMonth);
  
  const handlePreviousMonth = () => {
    const previousMonth = subMonths(currentDate, 1);
    onChange(previousMonth.getMonth(), previousMonth.getFullYear());
  };
  
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    onChange(nextMonth.getMonth(), nextMonth.getFullYear());
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-100">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePreviousMonth}
        className="md-ripple"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <h3 className="text-lg font-medium text-blue-800">
        {format(currentDate, 'MMMM yyyy')}
      </h3>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleNextMonth}
        className="md-ripple"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MonthSelector;
