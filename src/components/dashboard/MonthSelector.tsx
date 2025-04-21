
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    onChange(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    
    onChange(newMonth, newYear);
  };

  return (
    <Card className="bg-gradient-to-r from-sky-100 to-blue-100 p-4 shadow-sm border border-sky-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800">Period Selection</h3>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevMonth}
            className="bg-white hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="px-4 py-2 bg-white rounded-md border border-blue-200 font-medium min-w-[180px] text-center">
            {months[selectedMonth]} {selectedYear}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth}
            className="bg-white hover:bg-blue-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MonthSelector;
