
import { v4 as uuidv4 } from 'uuid';

// Types
export interface FinancialYear {
  id: string;
  name: string;  // e.g. "2025-26"
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  isActive: boolean;
  isSetup: boolean;  // Whether opening balances have been set
}

export interface OpeningBalance {
  yearId: string;
  cash: number;
  bank: number;
  stock: StockOpeningBalance[];
  parties: PartyOpeningBalance[];
}

export interface StockOpeningBalance {
  lotNumber: string;
  quantity: number;
  location: string;
  rate: number;
  netWeight: number;
}

export interface PartyOpeningBalance {
  partyId: string;
  partyName: string;
  partyType: 'customer' | 'supplier' | 'agent' | 'broker' | 'transporter';
  amount: number;
  balanceType: 'debit' | 'credit';
}

// Storage keys
const FINANCIAL_YEARS_KEY = 'financialYears';
const OPENING_BALANCES_KEY = 'openingBalances';
const ACTIVE_YEAR_KEY = 'activeFinancialYear';

// Get all financial years
export const getFinancialYears = (): FinancialYear[] => {
  try {
    const years = localStorage.getItem(FINANCIAL_YEARS_KEY);
    return years ? JSON.parse(years) : [];
  } catch (error) {
    console.error('Error getting financial years:', error);
    return [];
  }
};

// Save financial years
export const saveFinancialYears = (years: FinancialYear[]): void => {
  try {
    localStorage.setItem(FINANCIAL_YEARS_KEY, JSON.stringify(years));
  } catch (error) {
    console.error('Error saving financial years:', error);
  }
};

// Add a new financial year
export const addFinancialYear = (year: FinancialYear): FinancialYear => {
  const years = getFinancialYears();
  const newYear = {
    ...year,
    id: year.id || uuidv4()
  };
  years.push(newYear);
  saveFinancialYears(years);
  return newYear;
};

// Get active financial year
export const getActiveFinancialYear = (): FinancialYear | null => {
  try {
    const activeYearId = localStorage.getItem(ACTIVE_YEAR_KEY);
    if (!activeYearId) return null;
    
    const years = getFinancialYears();
    return years.find(year => year.id === activeYearId) || null;
  } catch (error) {
    console.error('Error getting active financial year:', error);
    return null;
  }
};

// Set active financial year
export const setActiveFinancialYear = (yearId: string): boolean => {
  try {
    const years = getFinancialYears();
    const year = years.find(y => y.id === yearId);
    
    if (year) {
      localStorage.setItem(ACTIVE_YEAR_KEY, yearId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error setting active financial year:', error);
    return false;
  }
};

// Get opening balances for a financial year
export const getOpeningBalances = (yearId: string): OpeningBalance | null => {
  try {
    const balancesStr = localStorage.getItem(`${OPENING_BALANCES_KEY}_${yearId}`);
    return balancesStr ? JSON.parse(balancesStr) : null;
  } catch (error) {
    console.error('Error getting opening balances:', error);
    return null;
  }
};

// Save opening balances for a financial year
export const saveOpeningBalances = (balances: OpeningBalance): boolean => {
  try {
    localStorage.setItem(`${OPENING_BALANCES_KEY}_${balances.yearId}`, JSON.stringify(balances));
    
    // Mark the year as setup
    const years = getFinancialYears();
    const yearIndex = years.findIndex(y => y.id === balances.yearId);
    
    if (yearIndex !== -1) {
      years[yearIndex].isSetup = true;
      saveFinancialYears(years);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving opening balances:', error);
    return false;
  }
};

// Generate a new financial year based on the previous one
export const generateNextFinancialYear = (previousYearId?: string): FinancialYear => {
  const years = getFinancialYears();
  
  let startDate: Date;
  let endDate: Date;
  let yearName: string;
  
  if (previousYearId && years.length > 0) {
    const previousYear = years.find(y => y.id === previousYearId);
    
    if (previousYear) {
      startDate = new Date(previousYear.endDate);
      startDate.setDate(startDate.getDate() + 1);
      
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(endDate.getDate() - 1);
      
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      yearName = `${startYear}-${(endYear % 100).toString().padStart(2, '0')}`;
    } else {
      // Default to current financial year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      
      // In India, financial year starts on April 1
      if (currentMonth < 3) { // January to March
        startDate = new Date(currentDate.getFullYear() - 1, 3, 1); // April 1 of previous year
        endDate = new Date(currentDate.getFullYear(), 2, 31); // March 31 of current year
      } else {
        startDate = new Date(currentDate.getFullYear(), 3, 1); // April 1 of current year
        endDate = new Date(currentDate.getFullYear() + 1, 2, 31); // March 31 of next year
      }
      
      yearName = `${startDate.getFullYear()}-${(endDate.getFullYear() % 100).toString().padStart(2, '0')}`;
    }
  } else {
    // No previous year, create the current financial year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // In India, financial year starts on April 1
    if (currentMonth < 3) { // January to March
      startDate = new Date(currentDate.getFullYear() - 1, 3, 1); // April 1 of previous year
      endDate = new Date(currentDate.getFullYear(), 2, 31); // March 31 of current year
    } else {
      startDate = new Date(currentDate.getFullYear(), 3, 1); // April 1 of current year
      endDate = new Date(currentDate.getFullYear() + 1, 2, 31); // March 31 of next year
    }
    
    yearName = `${startDate.getFullYear()}-${(endDate.getFullYear() % 100).toString().padStart(2, '0')}`;
  }
  
  return {
    id: uuidv4(),
    name: yearName,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: false,
    isSetup: false
  };
};

// Initialize financial years if none exist
export const initializeFinancialYears = (): void => {
  const years = getFinancialYears();
  
  if (years.length === 0) {
    // Create current financial year
    const currentYear = generateNextFinancialYear();
    currentYear.isActive = true;
    
    addFinancialYear(currentYear);
    setActiveFinancialYear(currentYear.id);
  }
};

// Get closing balances from the previous year to use as opening balances
export const getClosingBalancesFromPreviousYear = (previousYearId: string): OpeningBalance | null => {
  // This would normally calculate closing balances based on transactions
  // For now, we'll just return the opening balances of the previous year
  return getOpeningBalances(previousYearId);
};

// Utility for getting year-specific storage key
export const getYearSpecificKey = (baseKey: string): string => {
  const activeYear = getActiveFinancialYear();
  return activeYear ? `${baseKey}_${activeYear.id}` : baseKey;
};
