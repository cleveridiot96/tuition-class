
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely converts a value to a number
 * @param value Value to convert to number
 * @param defaultValue Default value to return if conversion fails (defaults to 0)
 * @returns Number value or default value if conversion fails
 */
export function safeNumber(value: unknown, defaultValue: number = 0): number {
  // If value is null, undefined, or empty string, return default value
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  // If value is already a number, return it
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  // Try to convert the value to a number
  const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  // Return parsed value if valid, otherwise return default value
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
}
