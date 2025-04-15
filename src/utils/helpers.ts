import { format } from "date-fns";

/**
 * Format a date string to a localized format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Format a number as Indian currency
 */
export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `₹ ${amount.toFixed(2)}`;
  }
}

/**
 * Format a balance with DR/CR indicator
 */
export function formatBalance(amount: number, balanceType: string): string {
  try {
    const formattedAmount = formatCurrency(Math.abs(amount));
    
    if (amount === 0) return formattedAmount;
    
    // For accounting display (DR/CR)
    if (balanceType === "debit" || balanceType === "dr") {
      return `${formattedAmount} DR`;
    } else if (balanceType === "credit" || balanceType === "cr") {
      return `${formattedAmount} CR`;
    }
    
    // Fallback to sign-based display
    return amount >= 0 ? formattedAmount : `(${formattedAmount})`;
  } catch (error) {
    console.error("Error formatting balance:", error);
    return `₹ ${Math.abs(amount).toFixed(2)} ${amount >= 0 ? "DR" : "CR"}`;
  }
}

/**
 * Generate a unique voucher number with prefix
 */
export function generateVoucherNumber(prefix: string, year?: string): string {
  const currentYear = year || new Date().getFullYear().toString().slice(-2);
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}/${currentYear}/${randomPart}`;
}

/**
 * Generate a realistic invoice/lot number for Indian agricultural trade
 */
export function generateIndianLotNumber(): string {
  const prefix = "LOT";
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const seq = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}/${year}${month}/${seq}`;
}

/**
 * Generate a realistic vakkal number (transport slip)
 */
export function generateVakkalNumber(): string {
  // Two letters followed by slash and two numbers
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 90 + 10);
  
  return `${letter1}${letter2}/${numbers}`;
}

/**
 * Generate a realistic Indian agricultural trader name
 */
export function generateTraderName(): string {
  const firstNames = [
    "Rajesh", "Sunil", "Anil", "Prakash", "Mahesh", "Dinesh", "Rakesh", "Ramesh",
    "Naresh", "Kamlesh", "Mukesh", "Nilesh", "Yogesh", "Hitesh", "Bhavesh", "Paresh",
    "Jignesh", "Mangesh", "Umesh", "Ritesh"
  ];
  
  const lastNames = [
    "Patel", "Sharma", "Desai", "Mehta", "Shah", "Joshi", "Patil", "Shinde",
    "Dalvi", "Kulkarni", "Jain", "Thakur", "Singh", "Chauhan", "Verma", "Agarwal"
  ];
  
  const suffixes = [
    "Traders", "Merchants", "Sons", "Brothers", "Trading Co", "Agro", "Store",
    "Enterprise", "& Co", "Industries", "Suppliers", "Agency", "Associates"
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Either "FirstName LastName Suffix" or just "LastName Suffix"
  return Math.random() > 0.5 
    ? `${firstName} ${lastName} ${suffix}` 
    : `${lastName} ${suffix}`;
}

/**
 * Generate a realistic broker name
 */
export function generateBrokerName(): string {
  const brokerNames = [
    "DS", "RS", "LB", "AR", "MK", "JP", "VB", "KD", "SK", "RG",
    "Ashok Jain", "Rajesh Kumar", "Pravin Dalal", "Manish Shah", "Lalit Broker",
    "Dharmesh Agency", "Ashish Commission Agent", "Krishna Trading",
    "Narayan Agency", "Mahavir Commission Agent"
  ];
  
  return brokerNames[Math.floor(Math.random() * brokerNames.length)];
}

/**
 * Generate a realistic weight value that's close to a target but not exact
 */
export function generateApproximateWeight(targetWeight: number, variationPercent = 2): number {
  const variation = (targetWeight * variationPercent) / 100;
  const delta = (Math.random() * variation * 2) - variation;
  return Math.round((targetWeight + delta) * 100) / 100;
}

/**
 * Get a random element from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Capitalize the first letter of each word in a string
 */
export function titleCase(str: string): string {
  return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract sale ID from URL search params
 * @returns Sale ID if present in URL
 */
export function getSaleIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('edit');
}
