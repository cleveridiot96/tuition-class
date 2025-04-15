
// Helper functions for data generation

// Generate a trader's name for demo data
export function generateTraderName(): string {
  const prefixes = ['Shree', 'Shri', 'Sri', 'Jai', 'Om', 'New', 'Modern', 'Royal'];
  const nameParts = [
    'Krishna', 'Ganesh', 'Shiva', 'Ram', 'Lakshmi', 'Mahalaxmi', 
    'Balaji', 'Sai', 'Durga', 'Vishnu', 'Hanuman'
  ];
  const suffixes = [
    'Traders', 'Trading Company', 'Enterprises', 'Agency', 'Industries',
    'Merchants', 'Bros', 'Sons', 'Corporation', 'Company'
  ];

  const usePrefix = Math.random() > 0.3;
  const useSuffix = Math.random() > 0.1;

  let name = '';
  if (usePrefix) name += getRandomItem(prefixes) + ' ';
  name += getRandomItem(nameParts);
  if (useSuffix) name += ' ' + getRandomItem(suffixes);

  return name;
}

// Generate a broker's name for demo data
export function generateBrokerName(): string {
  const firstNames = [
    'Rajesh', 'Mukesh', 'Ramesh', 'Suresh', 'Mahesh',
    'Dinesh', 'Kamlesh', 'Jignesh', 'Bhavesh', 'Nilesh',
    'Prakash', 'Anil', 'Sunil', 'Ajay', 'Vijay', 'Sanjay'
  ];
  
  const lastNames = [
    'Sharma', 'Patel', 'Verma', 'Singh', 'Gupta',
    'Shah', 'Modi', 'Jain', 'Mehta', 'Desai',
    'Kumar', 'Trivedi', 'Agarwal', 'Joshi', 'Pandey', 'Mishra'
  ];
  
  return `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
}

// Generate an Indian lot number
export function generateIndianLotNumber(): string {
  const prefixes = ['KC', 'MH', 'GJ', 'UP', 'MP', 'DL', 'RJ', 'TN', 'KT', 'AP'];
  const year = new Date().getFullYear().toString().substring(2);
  const serialNumber = Math.floor(Math.random() * 9000) + 1000;
  
  return `${getRandomItem(prefixes)}/${year}-${serialNumber}`;
}

// Generate a Vakkal number (receipt or bill number)
export function generateVakkalNumber(): string {
  const prefix = Math.random() > 0.5 ? 'V' : 'B';
  const year = new Date().getFullYear().toString().substring(2);
  const serialNumber = Math.floor(Math.random() * 900) + 100;
  
  return `${prefix}/${year}/${serialNumber}`;
}

// Generate approximate weight based on quantity
export function generateApproximateWeight(quantity: number): number {
  const avgWeightPerUnit = 75 + Math.random() * 25; // 75-100kg per unit
  return Math.round(quantity * avgWeightPerUnit * 100) / 100; // Round to 2 decimal places
}

// Get a random item from an array
export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Convert string to title case
export function titleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// Generate a random date within a range
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate random number within a range
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random boolean with probability
export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}
