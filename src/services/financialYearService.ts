
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem, getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { FinancialYear, OpeningBalance } from './types';
import { addDays, format, parseISO, addYears } from 'date-fns';

// Basic financial year management
export function getFinancialYears(): FinancialYear[] {
  return getStorageItem<FinancialYear[]>('financialYears', []);
}

export function addFinancialYear(year: Omit<FinancialYear, 'id'>): FinancialYear {
  const years = getFinancialYears();
  
  const newYear: FinancialYear = {
    ...year,
    id: uuidv4()
  };
  
  years.push(newYear);
  saveStorageItem('financialYears', years);
  
  return newYear;
}

export function updateFinancialYear(year: FinancialYear): void {
  const years = getFinancialYears();
  const index = years.findIndex(y => y.id === year.id);
  
  if (index !== -1) {
    years[index] = year;
    saveStorageItem('financialYears', years);
  }
}

export function getActiveFinancialYear(): FinancialYear | undefined {
  const activeId = getStorageItem<string>('activeFinancialYear', '');
  const years = getFinancialYears();
  
  return years.find(year => year.id === activeId);
}

export function setActiveFinancialYear(yearId: string): boolean {
  const years = getFinancialYears();
  
  if (years.some(year => year.id === yearId)) {
    saveStorageItem('activeFinancialYear', yearId);
    return true;
  }
  
  return false;
}

// Generate next financial year based on the previous one
export function generateNextFinancialYear(previousYearId?: string): FinancialYear {
  const years = getFinancialYears();
  const previousYear = previousYearId 
    ? years.find(y => y.id === previousYearId) 
    : years.length > 0 
      ? years.reduce((latest, y) => new Date(y.endDate) > new Date(latest.endDate) ? y : latest, years[0])
      : null;
  
  if (previousYear) {
    // Calculate the next year's dates based on the previous year's end date
    const endDate = parseISO(previousYear.endDate);
    const startDate = addDays(endDate, 1);
    const nextEndDate = addYears(endDate, 1);
    
    // Try to extract year numbers from the previous name, e.g., "2023-24" -> "2024-25"
    const nameMatch = previousYear.name.match(/(\d{4})-(\d{2})/);
    let nextYearName = '';
    
    if (nameMatch && nameMatch.length >= 3) {
      const currentYear = parseInt(nameMatch[1], 10);
      const currentEndYear = parseInt(nameMatch[2], 10);
      nextYearName = `${currentYear + 1}-${(currentEndYear + 1).toString().padStart(2, '0')}`;
    } else {
      // If no pattern matched, just use the date format
      nextYearName = `${format(startDate, 'yyyy')}-${format(nextEndDate, 'yy')}`;
    }
    
    return {
      id: '',
      name: nextYearName,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(nextEndDate, 'yyyy-MM-dd'),
      isActive: false,
      isSetup: false
    };
  } else {
    // If no previous year, create a new one starting from today
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 3, 1); // April 1st
    const endOfYear = new Date(now.getFullYear() + 1, 2, 31); // March 31st next year
    
    return {
      id: '',
      name: `${format(startOfYear, 'yyyy')}-${format(endOfYear, 'yy')}`,
      startDate: format(startOfYear, 'yyyy-MM-dd'),
      endDate: format(endOfYear, 'yyyy-MM-dd'),
      isActive: false,
      isSetup: false
    };
  }
}

// Opening balance management
export function getOpeningBalances(yearId: string): OpeningBalance | null {
  const key = `openingBalances_${yearId}`;
  return getStorageItem(key, null);
}

export function saveOpeningBalances(balances: OpeningBalance): boolean {
  if (!balances.yearId) {
    console.error("Year ID is required for opening balances");
    return false;
  }
  
  const key = `openingBalances_${balances.yearId}`;
  saveStorageItem(key, balances);
  
  // Mark the financial year as set up
  const years = getFinancialYears();
  const yearIndex = years.findIndex(y => y.id === balances.yearId);
  
  if (yearIndex !== -1) {
    years[yearIndex].isSetup = true;
    saveStorageItem('financialYears', years);
  }
  
  return true;
}

// Closing balance calculation for year transition
export function getClosingBalancesFromPreviousYear(previousYearId: string): OpeningBalance | null {
  return getOpeningBalances(previousYearId);
}
