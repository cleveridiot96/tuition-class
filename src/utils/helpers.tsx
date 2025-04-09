import React from "react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

// Create a date formatter with memoization
const createMemoizedDateFormatter = () => {
  const cache = new Map();
  
  return (dateString: string, formatStr: string = 'dd/MM/yy'): string => {
    const cacheKey = `${dateString}_${formatStr}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    try {
      const result = format(parseISO(dateString), formatStr);
      // Limit cache size to prevent memory leaks
      if (cache.size > 1000) {
        // Clear the oldest entries when cache gets too large
        const keysToDelete = Array.from(cache.keys()).slice(0, 100);
        keysToDelete.forEach(key => cache.delete(key));
      }
      cache.set(cacheKey, result);
      return result;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };
};

// Create the memoized formatter
const memoizedDateFormatter = createMemoizedDateFormatter();

/**
 * Format date consistently across the application with memoization
 * @param dateString The date string to format
 * @returns Formatted date string in DD/MM/YY format
 */
export const formatDate = (dateString: string): string => {
  return memoizedDateFormatter(dateString);
};

/**
 * Detect if quantity represents bags or boxes based on weight pattern
 * @param quantity The quantity value
 * @returns "bag" or "box" string
 */
export const detectPackageType = (quantity: number): "bag" | "box" => {
  if (quantity % 50 === 0) {
    return "bag";
  } else if (quantity % 25 === 0) {
    return "box";
  } else {
    return "bag";
  }
};

// Memoize currency formatter to avoid recreating for each call
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const currencyFormatterNoDecimal = new Intl.NumberFormat("en-IN", {
  style: "currency", 
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * Format currency in Indian Rupee format
 * @param amount Amount to format
 * @param decimals Number of decimal places (default 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  if (decimals === 0) {
    return currencyFormatterNoDecimal.format(amount);
  }
  return currencyFormatter.format(amount);
};

/**
 * React hook to confirm deletion with a custom message
 * @returns Object with confirm function
 */
export const useConfirmDelete = () => {
  const { toast } = useToast();

  const confirm = React.useCallback((itemName: string, onConfirm: () => void) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      onConfirm();
    } else {
      toast({
        title: "Deletion cancelled",
        description: `"${itemName}" was not deleted.`,
      });
    }
  }, [toast]);

  return { confirm };
};

// Create a memoized version of numberToWords with a cache
const wordCache = new Map<number, string>();

/**
 * Convert a number to words in Hindi/English
 * @param number Number to convert
 * @returns String representation in words
 */
export const numberToWords = (number: number): string => {
  if (wordCache.has(number)) {
    return wordCache.get(number)!;
  }
  
  const ones = [
    "", "एक", "दो", "तीन", "चार", "पांच", "छह", "सात", "आठ", "नौ",
    "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अट्ठारह", "उन्नीस"
  ];
  
  const tens = [
    "", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"
  ];
  
  let result: string;
  
  if (number < 20) {
    result = ones[number];
  } else if (number < 100) {
    const ten = Math.floor(number / 10);
    const one = number % 10;
    result = one ? `${tens[ten]}-${ones[one]}` : tens[ten];
  } else {
    result = number.toString();
  }
  
  // Limit cache size
  if (wordCache.size > 200) {
    const keysToDelete = Array.from(wordCache.keys()).slice(0, 50);
    keysToDelete.forEach(key => wordCache.delete(key));
  }
  
  wordCache.set(number, result);
  return result;
};

/**
 * Extract sale ID from URL search params
 * @returns Sale ID if present in URL
 */
export const getSaleIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('edit');
};

// Memoized number formatter
const numberFormatter = new Intl.NumberFormat('en-IN');

/**
 * Format a number with indian thousands separator
 * @param num Number to format
 * @returns Formatted string with thousands separators
 */
export const formatNumber = (num: number): string => {
  return numberFormatter.format(num);
};

/**
 * Format a date for database consistency (YYYY-MM-DD)
 * @param date Date object or string to format
 * @returns Formatted date string
 */
export const formatDateForDB = (date: Date | string): string => {
  if (typeof date === 'string') {
    try {
      date = parseISO(date);
    } catch (e) {
      console.error("Error parsing date string:", e);
      return '';
    }
  }
  return format(date, 'yyyy-MM-dd');
};

/**
 * Helper to determine balance type display
 * @param balance Balance amount
 * @param balanceType Balance type (DR/CR)
 * @returns Formatted balance string
 */
export const formatBalance = (balance: number, balanceType: string): string => {
  // Ensure balanceType is either "DR" or "CR"
  const validBalanceType = balanceType === "DR" || balanceType === "CR" ? balanceType : "DR";
  return `${formatCurrency(balance)} ${validBalanceType}`;
};

/**
 * Helper to determine if value is positive
 * @param value Number to check
 * @returns CSS class for text color
 */
export const getValueColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return '';
};
