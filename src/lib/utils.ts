
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Cache frequently used class combinations
const classCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

/**
 * Enhanced cn utility with caching and error handling
 */
export function cn(...inputs: ClassValue[]): string {
  try {
    const key = JSON.stringify(inputs);
    
    if (classCache.has(key)) {
      return classCache.get(key)!;
    }
    
    const result = twMerge(clsx(inputs));
    
    if (classCache.size >= MAX_CACHE_SIZE) {
      const firstKey = classCache.keys().next().value;
      classCache.delete(firstKey);
    }
    
    classCache.set(key, result);
    return result;
  } catch (error) {
    console.error("Error in cn utility function:", error);
    // Fallback to basic implementation if cache fails
    return twMerge(clsx(inputs));
  }
}

/**
 * Enhanced debounce utility with error handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    try {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          func(...args);
        } catch (err) {
          console.error("Error in debounced function:", err);
        }
      }, wait);
    } catch (err) {
      console.error("Error setting up debounce:", err);
    }
  };
}

/**
 * Enhanced throttle utility for smooth UI with error handling
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    try {
      if (!inThrottle) {
        try {
          func(...args);
        } catch (err) {
          console.error("Error in throttled function:", err);
        }
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    } catch (err) {
      console.error("Error setting up throttle:", err);
    }
  };
}

/**
 * Safe array utilities for avoiding common iteration errors
 */
export const safeArrayUtils = {
  map<T, R>(arr: T[] | null | undefined, fn: (item: T, index: number) => R): R[] {
    if (!Array.isArray(arr)) return [];
    try {
      return arr.map(fn);
    } catch (err) {
      console.error("Error in safeArrayUtils.map:", err);
      return [];
    }
  },
  
  filter<T>(arr: T[] | null | undefined, fn: (item: T, index: number) => boolean): T[] {
    if (!Array.isArray(arr)) return [];
    try {
      return arr.filter(fn);
    } catch (err) {
      console.error("Error in safeArrayUtils.filter:", err);
      return [];
    }
  },
  
  find<T>(arr: T[] | null | undefined, fn: (item: T, index: number) => boolean): T | undefined {
    if (!Array.isArray(arr)) return undefined;
    try {
      return arr.find(fn);
    } catch (err) {
      console.error("Error in safeArrayUtils.find:", err);
      return undefined;
    }
  }
};

/**
 * Safe number formatter to prevent toFixed() errors
 */
export function safeNumberFormat(value: any, decimals = 2, fallback = '0.00'): string {
  // Check if value is a valid number
  if (value === undefined || value === null) {
    return fallback;
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number after conversion
  if (isNaN(numValue) || typeof numValue !== 'number') {
    return fallback;
  }
  
  try {
    return numValue.toFixed(decimals);
  } catch (e) {
    console.error("Error formatting number:", e);
    return fallback;
  }
}

/**
 * Safe number conversion for calculations
 */
export function safeNumber(value: any, fallback = 0): number {
  if (value === undefined || value === null) {
    return fallback;
  }
  
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  
  return fallback;
}
