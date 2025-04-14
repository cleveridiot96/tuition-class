
import { getStorageItem, saveStorageItem, getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { format, parse, addYears, isBefore } from 'date-fns';

// Types
export interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface OpeningBalance {
  id: string;
  name: string;
  amount: number;
  balanceType: 'debit' | 'credit';
}

export interface PartyOpeningBalance extends OpeningBalance {
  type: 'agent' | 'supplier' | 'customer' | 'broker' | 'transporter';
}

export interface StockOpeningBalance extends OpeningBalance {
  location: string;
  quantity: number;
  rate: number;
}

// Constants
const STORAGE_KEY = 'financial-years';
const DEFAULT_YEAR = {
  id: 'fy-2023-24',
  name: '2023-24',
  startDate: '2023-04-01',
  endDate: '2024-03-31',
  isActive: true
};

/**
 * Initialize financial years if they don't exist yet
 */
export const initializeFinancialYears = () => {
  const years = getStorageItem(STORAGE_KEY);
  
  if (!years || years.length === 0) {
    saveStorageItem(STORAGE_KEY, [DEFAULT_YEAR]);
    return [DEFAULT_YEAR];
  }
  
  return years;
};

/**
 * Get all financial years
 */
export const getFinancialYears = (): FinancialYear[] => {
  return getStorageItem(STORAGE_KEY) || [];
};

/**
 * Get the current financial year
 */
export const getCurrentFinancialYear = (): string => {
  const years = getFinancialYears();
  const activeYear = years.find(year => year.isActive);
  
  if (!activeYear) {
    return DEFAULT_YEAR.name;
  }
  
  return activeYear.name;
};

/**
 * Get the active financial year object
 */
export const getActiveFinancialYear = (): FinancialYear => {
  const years = getFinancialYears();
  const activeYear = years.find(year => year.isActive);
  
  if (!activeYear) {
    return DEFAULT_YEAR;
  }
  
  return activeYear;
};

/**
 * Add a new financial year
 */
export const addFinancialYear = (year: Omit<FinancialYear, 'id'>): FinancialYear => {
  const newYear = {
    id: `fy-${year.name}`,
    ...year
  };
  
  const years = getFinancialYears();
  
  if (year.isActive) {
    // Deactivate any other active years
    const updatedYears = years.map(y => ({
      ...y,
      isActive: false
    }));
    
    saveStorageItem(STORAGE_KEY, [...updatedYears, newYear]);
  } else {
    saveStorageItem(STORAGE_KEY, [...years, newYear]);
  }
  
  return newYear;
};

/**
 * Set active financial year
 */
export const setActiveFinancialYear = (id: string): boolean => {
  const years = getFinancialYears();
  
  const updatedYears = years.map(year => ({
    ...year,
    isActive: year.id === id
  }));
  
  return saveStorageItem(STORAGE_KEY, updatedYears);
};

/**
 * Generate next financial year based on current
 */
export const generateNextFinancialYear = (): FinancialYear => {
  const currentYear = getActiveFinancialYear();
  const startDate = parse(currentYear.startDate, 'yyyy-MM-dd', new Date());
  const nextStartDate = addYears(startDate, 1);
  const nextEndDate = addYears(parse(currentYear.endDate, 'yyyy-MM-dd', new Date()), 1);
  
  // Extract years for the name (e.g., "2024-25")
  const startYear = format(nextStartDate, 'yyyy');
  const endYear = format(nextEndDate, 'yy');
  const name = `${startYear}-${endYear}`;
  
  return {
    id: `fy-${name}`,
    name,
    startDate: format(nextStartDate, 'yyyy-MM-dd'),
    endDate: format(nextEndDate, 'yyyy-MM-dd'),
    isActive: false
  };
};

/**
 * Get opening balances for a financial year
 */
export const getOpeningBalances = (yearId: string): OpeningBalance[] => {
  return getStorageItem(`${yearId}-opening-balances`) || [];
};

/**
 * Save opening balances for a financial year
 */
export const saveOpeningBalances = (yearId: string, balances: OpeningBalance[]): boolean => {
  return saveStorageItem(`${yearId}-opening-balances`, balances);
};

/**
 * Get closing balances from previous year
 */
export const getClosingBalancesFromPreviousYear = (currentYearId: string): OpeningBalance[] => {
  const years = getFinancialYears();
  const currentYearIndex = years.findIndex(y => y.id === currentYearId);
  
  if (currentYearIndex <= 0) {
    return []; // No previous year
  }
  
  const previousYear = years[currentYearIndex - 1];
  const previousOpeningBalances = getOpeningBalances(previousYear.id) || [];
  
  // TODO: Calculate closing balances based on transactions in the previous year
  // For now, just return the opening balances of the previous year
  return previousOpeningBalances;
};

/**
 * Check if a given date is within the active financial year
 */
export const isWithinActiveFinancialYear = (date: Date | string): boolean => {
  const activeYear = getActiveFinancialYear();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const startDate = new Date(activeYear.startDate);
  const endDate = new Date(activeYear.endDate);
  
  return (
    (checkDate >= startDate && checkDate <= endDate) || 
    format(checkDate, 'yyyy-MM-dd') === activeYear.startDate || 
    format(checkDate, 'yyyy-MM-dd') === activeYear.endDate
  );
};

/**
 * Get formatted code for current financial year (e.g., 2324 for 2023-24)
 */
export const getFinancialYearCode = (year?: string): string => {
  const yearName = year || getCurrentFinancialYear();
  // Extract numbers from something like "2023-24"
  const matches = yearName.match(/(\d{2})(\d{2})-(\d{2})/);
  if (matches && matches.length >= 4) {
    return `${matches[2]}${matches[3]}`;
  }
  return yearName.replace(/[^0-9]/g, '');
};
