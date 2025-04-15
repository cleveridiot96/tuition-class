
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { FinancialYear } from './types';
import { add } from 'date-fns'; // Using date-fns add instead of addDays

// Storage key for financial years
const FINANCIAL_YEARS_KEY = 'financialYears';
const ACTIVE_FINANCIAL_YEAR_KEY = 'activeFinancialYear';

// Get all financial years
export function getFinancialYears(): FinancialYear[] {
  return getStorageItem(FINANCIAL_YEARS_KEY, []);
}

// Get active financial year
export function getActiveFinancialYear(): FinancialYear | null {
  const years = getFinancialYears();
  const activeYearId = getStorageItem(ACTIVE_FINANCIAL_YEAR_KEY, '');
  
  if (!activeYearId) {
    return years.find(y => y.isActive) || null;
  }
  
  return years.find(y => y.id === activeYearId) || null;
}

// Get current financial year for dashboard
export function getCurrentFinancialYear(): FinancialYear | null {
  return getActiveFinancialYear();
}

// Set active financial year
export function setActiveFinancialYear(yearId: string): boolean {
  const years = getFinancialYears();
  const yearToActivate = years.find(y => y.id === yearId);
  
  if (!yearToActivate) return false;
  
  saveStorageItem(ACTIVE_FINANCIAL_YEAR_KEY, yearId);
  return true;
}

// Add new financial year
export function addFinancialYear(yearData: Partial<FinancialYear>): FinancialYear {
  const years = getFinancialYears();
  
  // Deactivate all other years
  const updatedYears = years.map(y => ({
    ...y,
    isActive: false
  }));
  
  // Create new year
  const newYear: FinancialYear = {
    id: yearData.id || uuidv4(),
    name: yearData.name || `FY ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    startDate: yearData.startDate || new Date().toISOString(),
    endDate: yearData.endDate || add(new Date(), { days: 365 }).toISOString(), // Using add instead of addDays
    isActive: true,
    isSetup: yearData.isSetup || false
  };
  
  // Add new year to the array
  updatedYears.push(newYear);
  
  // Save updated array
  saveStorageItem(FINANCIAL_YEARS_KEY, updatedYears);
  saveStorageItem(ACTIVE_FINANCIAL_YEAR_KEY, newYear.id);
  
  return newYear;
}

// Initialize financial years if none exist
export function initializeFinancialYears(): void {
  const years = getFinancialYears();
  
  if (years.length === 0) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 3, 1); // April 1st
    
    // If current date is before April, use previous year's April 1
    if (now < startOfYear) {
      startOfYear.setFullYear(startOfYear.getFullYear() - 1);
    }
    
    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(endOfYear.getFullYear() + 1);
    endOfYear.setDate(endOfYear.getDate() - 1); // March 31st
    
    const yearName = `FY ${startOfYear.getFullYear()}-${endOfYear.getFullYear().toString().substr(2, 2)}`;
    
    addFinancialYear({
      name: yearName,
      startDate: startOfYear.toISOString(),
      endDate: endOfYear.toISOString(),
      isActive: true,
      isSetup: false
    });
  }
}

// Update financial year
export function updateFinancialYear(updatedYear: FinancialYear): void {
  const years = getFinancialYears();
  const index = years.findIndex(y => y.id === updatedYear.id);
  
  if (index !== -1) {
    years[index] = updatedYear;
    saveStorageItem(FINANCIAL_YEARS_KEY, years);
  }
}

// Delete financial year
export function deleteFinancialYear(yearId: string): void {
  const years = getFinancialYears();
  const filteredYears = years.filter(y => y.id !== yearId);
  
  if (filteredYears.length > 0 && years.find(y => y.id === yearId)?.isActive) {
    filteredYears[0].isActive = true;
    saveStorageItem(ACTIVE_FINANCIAL_YEAR_KEY, filteredYears[0].id);
  }
  
  saveStorageItem(FINANCIAL_YEARS_KEY, filteredYears);
}

// Mark financial year as setup complete
export function markFinancialYearAsSetup(yearId: string): void {
  const years = getFinancialYears();
  const index = years.findIndex(y => y.id === yearId);
  
  if (index !== -1) {
    years[index].isSetup = true;
    saveStorageItem(FINANCIAL_YEARS_KEY, years);
  }
}

// Get storage key with year prefix
export function getFinancialYearKeyPrefix(): string {
  const activeYear = getActiveFinancialYear();
  return activeYear ? `year_${activeYear.id}_` : '';
}
