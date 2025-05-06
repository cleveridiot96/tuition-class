/**
 * Core storage operations for the application
 * Consolidated and optimized for performance
 */

// Basic storage operations
export const getStorageItem = <T>(key: string): T | null => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return null;
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error(`Error getting item '${key}' from localStorage:`, error);
    return null;
  }
};

export const saveStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
    // Dispatch storage event for any listeners
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error(`Error saving item '${key}' to localStorage:`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
    // Dispatch storage event for any listeners
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error(`Error removing item '${key}' from localStorage:`, error);
  }
};

// Cache to improve performance for frequent requests
const cacheMap = new Map<string, { data: any, timestamp: number }>();
const CACHE_EXPIRY = 30 * 1000; // 30 seconds

/**
 * Gets an item from storage with caching for performance
 * @param key Storage key
 * @param useCache Whether to use cache
 * @returns Stored data or null
 */
export const getCachedStorageItem = <T>(key: string, useCache = true): T | null => {
  // Try cache first if enabled
  if (useCache) {
    const cached = cacheMap.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.data as T;
    }
  }
  
  // Not in cache or cache disabled, get from storage
  const data = getStorageItem<T>(key);
  
  // Update cache
  if (data !== null) {
    cacheMap.set(key, { data, timestamp: Date.now() });
  } else {
    cacheMap.delete(key);
  }
  
  return data;
};

/**
 * Clear the cache entries
 * @param key Optional key to clear specific cache entry
 */
export const clearCache = (key?: string): void => {
  if (key) {
    cacheMap.delete(key);
  } else {
    cacheMap.clear();
  }
};

// Storage event listener to auto-invalidate cache on external changes
window.addEventListener('storage', (event) => {
  if (event.key) {
    cacheMap.delete(event.key);
  } else {
    // If key is null, all storage was cleared
    cacheMap.clear();
  }
});

export const batchStorageUpdate = <T>(updates: Array<{key: string, value: T}>): void => {
  try {
    updates.forEach(({key, value}) => {
      saveStorageItem(key, value);
    });
  } catch (error) {
    console.error("Error performing batch storage update:", error);
  }
};

// Create a performance optimized version of local storage for better offline performance
export class OptimizedStorage {
  private memoryCache = new Map<string, any>();
  private pendingWrites = new Set<string>();
  private writeTimeout: number | null = null;
  private readonly writeDelay = 100; // Milliseconds between batch writes

  constructor() {
    // Preload common keys for faster startup
    this.preloadKeys(['locations', 'agents', 'customers', 'suppliers', 'brokers', 'transporters']);
    // Add event listener to keep cache in sync
    window.addEventListener('storage', this.handleStorageChange);
  }

  private preloadKeys(keys: string[]): void {
    keys.forEach(key => {
      this.memoryCache.set(key, getStorageItem(key));
    });
  }

  private handleStorageChange = (event: StorageEvent): void => {
    // Only update cache if change came from another tab/window
    if (event.key && !this.pendingWrites.has(event.key)) {
      if (event.newValue === null) {
        this.memoryCache.delete(event.key);
      } else {
        try {
          this.memoryCache.set(event.key, JSON.parse(event.newValue));
        } catch {
          this.memoryCache.set(event.key, event.newValue);
        }
      }
    }
  };

  private scheduleSave(): void {
    if (this.writeTimeout === null) {
      this.writeTimeout = window.setTimeout(() => {
        this.flushChanges();
        this.writeTimeout = null;
      }, this.writeDelay);
    }
  }

  public get<T>(key: string): T | null {
    // Try memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // Fall back to storage
    const value = getStorageItem<T>(key);
    this.memoryCache.set(key, value);
    return value;
  }

  public set<T>(key: string, value: T): void {
    this.memoryCache.set(key, value);
    this.pendingWrites.add(key);
    this.scheduleSave();
  }

  public remove(key: string): void {
    this.memoryCache.delete(key);
    this.pendingWrites.add(key);
    this.scheduleSave();
  }

  public flushChanges(): void {
    for (const key of this.pendingWrites) {
      const value = this.memoryCache.get(key);
      if (value === undefined) {
        removeStorageItem(key);
      } else {
        saveStorageItem(key, value);
      }
    }
    this.pendingWrites.clear();
  }

  public clear(): void {
    this.memoryCache.clear();
    this.pendingWrites.clear();
    localStorage.clear();
  }
}

// Export a single instance for app-wide use
export const optimizedStorage = new OptimizedStorage();
