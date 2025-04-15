
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem, getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { FinancialYear, OpeningBalance, StockOpeningBalance, PartyOpeningBalance } from './types';
import { add, format, addYears, parseISO } from 'date-fns'; // Using date-fns add instead of addDays

// Storage key for financial years
const FINANCIAL_YEARS_KEY = 'financialYears';
const ACTIVE_FINANCIAL_YEAR_KEY = 'activeFinancialYear';
const OPENING_BALANCES_KEY = 'openingBalances';
const CLOSING_BALANCES_KEY = 'closingBalances';

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

// Generate next financial year based on latest year
export function generateNextFinancialYear(): FinancialYear {
  const years = getFinancialYears();
  let startDate: Date;
  let endDate: Date;
  
  if (years.length === 0) {
    // Default to April 1st of current year
    const now = new Date();
    startDate = new Date(now.getFullYear(), 3, 1); // April 1st
    
    // If current date is before April, use previous year's April 1
    if (now < startDate) {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    endDate = addYears(startDate, 1);
    endDate.setDate(endDate.getDate() - 1); // March 31st
  } else {
    // Find the latest year by end date
    const latestYear = years.reduce((latest, year) => 
      new Date(year.endDate) > new Date(latest.endDate) ? year : latest
    , years[0]);
    
    // New year starts the day after the latest year ends
    startDate = new Date(latestYear.endDate);
    startDate.setDate(startDate.getDate() + 1);
    
    // New year ends a year after it starts
    endDate = addYears(startDate, 1);
    endDate.setDate(endDate.getDate() - 1);
  }
  
  // Generate year name (e.g., "FY 2023-24")
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const yearName = `FY ${startYear}-${String(endYear).substring(2, 4)}`;
  
  return {
    id: uuidv4(),
    name: yearName,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: false,
    isSetup: false
  };
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

// Get financial year key prefix
export function getFinancialYearKeyPrefix(): string {
  const activeYear = getActiveFinancialYear();
  return activeYear ? `year_${activeYear.id}_` : '';
}

// Save opening balances for a financial year
export function saveOpeningBalances(openingBalance: OpeningBalance): boolean {
  try {
    const yearId = openingBalance.yearId;
    const allOpeningBalances = getStorageItem(OPENING_BALANCES_KEY, []);
    
    // Remove any existing opening balance for this year
    const filteredBalances = allOpeningBalances.filter((bal: OpeningBalance) => bal.yearId !== yearId);
    
    // Add the new opening balance
    filteredBalances.push(openingBalance);
    
    // Save to storage
    saveStorageItem(OPENING_BALANCES_KEY, filteredBalances);
    
    return true;
  } catch (error) {
    console.error("Failed to save opening balances:", error);
    return false;
  }
}

// Get opening balances for a financial year
export function getOpeningBalances(yearId: string): OpeningBalance | null {
  const allOpeningBalances = getStorageItem(OPENING_BALANCES_KEY, []);
  return allOpeningBalances.find((bal: OpeningBalance) => bal.yearId === yearId) || null;
}

// Get closing balances from a previous year
export function getClosingBalancesFromPreviousYear(yearId: string): OpeningBalance | null {
  // In a simple implementation, closing balances are the same as opening balances
  // In a real app, you would calculate them based on transactions
  return getOpeningBalances(yearId);
}
