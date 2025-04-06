
import { LedgerEntry } from './types';

// Ledger functions
export const getLedgerEntries = (): LedgerEntry[] => {
  const entries = localStorage.getItem('ledger');
  return entries ? JSON.parse(entries) : [];
};

export const getLedgerEntriesByParty = (partyName: string, partyType: string): LedgerEntry[] => {
  const entries = getLedgerEntries();
  const filteredEntries = entries.filter(entry => 
    entry.partyName === partyName && entry.partyType === partyType
  );
  
  // Calculate running balance for each entry
  let runningBalance = 0;
  const entriesWithBalance = filteredEntries.map(entry => {
    runningBalance += entry.credit - entry.debit;
    return { ...entry, balance: runningBalance };
  });
  
  return entriesWithBalance;
};

export const addLedgerEntry = (entry: LedgerEntry): void => {
  const entries = getLedgerEntries();
  entries.push(entry);
  localStorage.setItem('ledger', JSON.stringify(entries));
};

// Function to create a cashbook entry
export const addCashbookEntry = (
  date: string,
  description: string, 
  debit: number = 0, 
  credit: number = 0, 
  referenceId?: string,
  referenceType?: string
): void => {
  const entries = getLedgerEntries();
  
  // Create a new entry with "Cash" as the party
  const newEntry: LedgerEntry = {
    id: Date.now().toString(),
    date,
    partyName: "Cash",
    partyType: "cash",
    description,
    debit,
    credit,
    balance: 0, // Will be calculated when retrieved
    referenceId,
    referenceType
  };
  
  entries.push(newEntry);
  localStorage.setItem('ledger', JSON.stringify(entries));
};
