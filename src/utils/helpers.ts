
// Helper functions for the application

// Get a URL parameter
export function getUrlParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

// Get sale ID from URL
export function getSaleIdFromUrl(): string | null {
  return getUrlParam('id');
}

// Get purchase ID from URL
export function getPurchaseIdFromUrl(): string | null {
  return getUrlParam('id');
}

// Calculate number of days between two dates
export function daysBetween(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
}

// Generate a safe filename from text
export function safeFilename(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

// Format balance with proper positive/negative indicator
export function formatBalance(amount: number): string {
  if (amount === 0) return '₹0.00';
  const formattedAmount = Math.abs(amount).toFixed(2);
  return amount > 0 
    ? `₹${formattedAmount} CR` 
    : `₹${formattedAmount} DR`;
}

// Filter and sort an array by search text
export function filterAndSort<T extends { name: string }>(
  items: T[], 
  searchText: string,
  sortField: keyof T = 'name' as keyof T
): T[] {
  const filtered = searchText 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()))
    : items;
  
  return filtered.sort((a, b) => {
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      return (a[sortField] as string).localeCompare(b[sortField] as string);
    }
    return 0;
  });
}
