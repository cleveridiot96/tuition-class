
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, getYear, getMonth } from 'date-fns';

interface UsePeriodSelectionProps {
  onChange?: (month: number, year: number) => void;
  initialMonth?: number;
  initialYear?: number;
}

export function usePeriodSelection({
  onChange,
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear()
}: UsePeriodSelectionProps = {}) {
  const [currentDate, setCurrentDate] = useState(new Date(initialYear, initialMonth));
  
  useEffect(() => {
    if (onChange) {
      onChange(getMonth(currentDate), getYear(currentDate));
    }
  }, [currentDate, onChange]);
  
  const goToPreviousPeriod = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const goToNextPeriod = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const formattedPeriod = format(currentDate, 'MMMM yyyy');
  
  return {
    currentMonth: getMonth(currentDate),
    currentYear: getYear(currentDate),
    formattedPeriod,
    goToPreviousPeriod,
    goToNextPeriod,
    setCurrentDate
  };
}

export default usePeriodSelection;
