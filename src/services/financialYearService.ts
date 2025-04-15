
import { v4 as uuidv4 } from 'uuid';
import { format, addYears, parse, parseISO } from 'date-fns';
import { FinancialYear, OpeningBalance } from './types';
import { getStorageItem, saveStorageItem, getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

// Key for storing financial years in localStorage
const FINANCIAL_YEARS_KEY = 'financialYears';
const OPENING_BALANCES_KEY = 'openingBalances';
const ACTIVE_YEAR_KEY = 'activeFinancialYear';

// Get all financial years
export const getFinancialYears = (): FinancialYear[] => {
  return getStorageItem<FinancialYear[]>(FINANCIAL_YEARS_KEY, []);
};

// Get active financial year
export const getActiveFinancialYear = (): FinancialYear | null => {
  const years = getFinancialYears();
  const activeYear = years.find(year => year.isActive);
  return activeYear || null;
};

// Get current financial year string (e.g., "2023-24")
export const getCurrentFinancialYear = (): string => {
  const activeYear = getActiveFinancialYear();
  return activeYear ? activeYear.name : generateDefaultFinancialYear().name;
};

// Generate a default financial year based on current date
export const generateDefaultFinancialYear = (): FinancialYear => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // In India, financial year typically runs from April 1 to March 31
  let startYear = currentYear;
  if (currentMonth < 4) { // If before April, we're in previous year's financial year
    startYear = currentYear - 1;
  }
  
  return {
    id: uuidv4(),
    name: `${startYear}-${(startYear + 1).toString().slice(2, 4)}`,
    startDate: `${startYear}-04-01`,
    endDate: `${startYear + 1}-03-31`,
    isActive: true,
    isSetup: false
  };
};

// Generate the next financial year based on the given year
export const generateNextFinancialYear = (currentYearId?: string): FinancialYear => {
  const years = getFinancialYears();
  let startDate, endDate, name;
  
  if (currentYearId && years.length > 0) {
    const currentYear = years.find(y => y.id === currentYearId);
    if (currentYear) {
      const currentEndDate = parseISO(currentYear.endDate);
      startDate = format(addDays(currentEndDate, 1), 'yyyy-MM-dd');
      endDate = format(addYears(parseISO(startDate), 1), 'yyyy-MM-dd');
      
      const startYearNum = parseInt(format(parseISO(startDate), 'yyyy'), 10);
      name = `${startYearNum}-${(startYearNum + 1).toString().slice(2, 4)}`;
    } else {
      return generateDefaultFinancialYear();
    }
  } else {
    return generateDefaultFinancialYear();
  }
  
  return {
    id: uuidv4(),
    name,
    startDate,
    endDate,
    isActive: false,
    isSetup: false
  };
};

// Add a new financial year
export const addFinancialYear = (year: Omit<FinancialYear, 'id'>): FinancialYear => {
  const newYear: FinancialYear = {
    ...year,
    id: uuidv4()
  };
  
  const years = getFinancialYears();
  
  // If this is set to active, deactivate all others
  if (newYear.isActive) {
    years.forEach(y => y.isActive = false);
    saveStorageItem(ACTIVE_YEAR_KEY, newYear.id);
  }
  
  years.push(newYear);
  saveStorageItem(FINANCIAL_YEARS_KEY, years);
  
  return newYear;
};

// Set active financial year
export const setActiveFinancialYear = (yearId: string): boolean => {
  const years = getFinancialYears();
  const yearExists = years.some(y => y.id === yearId);
  
  if (!yearExists) return false;
  
  years.forEach(y => y.isActive = (y.id === yearId));
  saveStorageItem(FINANCIAL_YEARS_KEY, years);
  saveStorageItem(ACTIVE_YEAR_KEY, yearId);
  
  return true;
};

// Initialize financial years if not exists
export const initializeFinancialYears = (): void => {
  const years = getFinancialYears();
  
  if (years.length === 0) {
    const defaultYear = generateDefaultFinancialYear();
    years.push(defaultYear);
    saveStorageItem(FINANCIAL_YEARS_KEY, years);
    saveStorageItem(ACTIVE_YEAR_KEY, defaultYear.id);
  }
};

// Get financial year key prefix (for year-specific storage)
export const getFinancialYearKeyPrefix = (yearName: string): string => {
  return `fy_${yearName}_`;
};

// Get opening balances for a specific year
export const getOpeningBalances = (yearId: string): OpeningBalance | null => {
  const balances = getStorageItem<Record<string, OpeningBalance>>(OPENING_BALANCES_KEY, {});
  return balances[yearId] || null;
};

// Save opening balances for a specific year
export const saveOpeningBalances = (openingBalance: OpeningBalance): boolean => {
  if (!openingBalance.id) {
    openingBalance.id = uuidv4();
  }
  
  const balances = getStorageItem<Record<string, OpeningBalance>>(OPENING_BALANCES_KEY, {});
  if (!openingBalance.yearId) {
    const activeYear = getActiveFinancialYear();
    if (!activeYear) return false;
    openingBalance.yearId = activeYear.id;
  }
  
  balances[openingBalance.yearId] = openingBalance;
  saveStorageItem(OPENING_BALANCES_KEY, balances);
  
  // Mark the year as set up
  const years = getFinancialYears();
  const yearIndex = years.findIndex(y => y.id === openingBalance.yearId);
  if (yearIndex >= 0) {
    years[yearIndex].isSetup = true;
    saveStorageItem(FINANCIAL_YEARS_KEY, years);
  }
  
  return true;
};

// Get closing balances from previous year to use as opening balances for new year
export const getClosingBalancesFromPreviousYear = (previousYearId: string): OpeningBalance | null => {
  return getOpeningBalances(previousYearId);
};

// Helper function for other services to get year-specific storage key
export const getYearSpecificKey = (baseKey: string, year?: string): string => {
  const currentYear = year || getCurrentFinancialYear();
  return getFinancialYearKeyPrefix(currentYear) + baseKey;
};
