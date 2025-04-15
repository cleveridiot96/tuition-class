
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { 
  getFinancialYears, 
  getActiveFinancialYear, 
  setActiveFinancialYear
} from '@/services/financialYearService';
import NewFinancialYearDialog from './NewFinancialYearDialog';
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { FinancialYear } from '@/services/types';

const YearSelector = () => {
  const { toast } = useToast();
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [activeYear, setActiveYear] = useState<FinancialYear | null>(null);
  const [isNewYearDialogOpen, setIsNewYearDialogOpen] = useState(false);

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = () => {
    const allYears = getFinancialYears();
    setYears(allYears || []);
    
    const active = getActiveFinancialYear();
    setActiveYear(active || null);
  };

  const handleYearChange = (yearId: string) => {
    if (setActiveFinancialYear(yearId)) {
      const selectedYear = years.find(y => y.id === yearId);
      setActiveYear(selectedYear || null);
      
      toast({
        title: "Financial Year Changed",
        description: `Switched to financial year ${selectedYear?.name}`,
      });
      
      // Force a page reload to ensure all data is refreshed
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: "Failed to change financial year",
        variant: "destructive"
      });
    }
  };

  const handleNewYearCreated = () => {
    loadYears();
    setIsNewYearDialogOpen(false);
  };

  const formatYearLabel = (year: FinancialYear) => {
    try {
      const start = format(parseISO(year.startDate), 'dd MMM yyyy');
      const end = format(parseISO(year.endDate), 'dd MMM yyyy');
      return `${year.name} (${start} - ${end})`;
    } catch (error) {
      return year.name;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="mr-2 text-sm text-muted-foreground">Financial Year:</span>
      </div>
      
      <Select value={activeYear?.id} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Year">
            {activeYear ? activeYear.name : "Select Year"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(years || []).map(year => (
            <SelectItem key={year.id} value={year.id}>
              {formatYearLabel(year)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsNewYearDialogOpen(true)}
        title="Create New Financial Year"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
      
      <NewFinancialYearDialog 
        isOpen={isNewYearDialogOpen}
        onClose={() => setIsNewYearDialogOpen(false)}
        onYearCreated={handleNewYearCreated}
      />
    </div>
  );
};

export default YearSelector;
