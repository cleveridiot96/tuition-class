
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Cache frequently used class combinations
const classCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

export function cn(...inputs: ClassValue[]): string {
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
}

// Add debounce utility to improve performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Add throttle utility for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
