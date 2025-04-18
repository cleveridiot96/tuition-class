
// Import the required modules
import { format, parse } from 'date-fns';

// Format currency with Indian Rupee symbol
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date in DD/MM/YYYY format
export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format balance with DR/CR indicator
export const formatBalance = (amount: number, balanceType?: string): string => {
  if (typeof amount !== 'number') return '₹0.00';
  
  const formattedAmount = formatCurrency(Math.abs(amount));
  
  // For print media, don't show DR/CR
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('print').matches) {
    return formattedAmount;
  }
  
  // For screen display, include DR/CR
  if (balanceType) {
    return `${formattedAmount} ${balanceType}`;
  }
  
  return formattedAmount;
};

// Format percentage
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Parse date from DD/MM/YYYY format
export const parseFormattedDate = (dateString: string): Date | null => {
  try {
    if (!dateString) return null;
    return parse(dateString, 'dd/MM/yyyy', new Date());
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

// Debounce function to limit how often a function is called
export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<F>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Truncate text to a specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Generate a financial year string (e.g., "2023-24")
export const getFinancialYearString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // If month is January to March (0-2), it's the previous year's financial year
  const startYear = month <= 2 ? year - 1 : year;
  const endYearShort = (startYear + 1) % 100;
  
  return `${startYear}-${endYearShort.toString().padStart(2, '0')}`;
};

// Calculate days difference between two dates
export const daysBetween = (startDate: Date, endDate: Date): number => {
  const difference = endDate.getTime() - startDate.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};
