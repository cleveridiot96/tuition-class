
import { getStorageItem, saveStorageItem } from './storageUtils';

// Types
interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
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
