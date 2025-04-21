
// Ledger service to handle party transactions

interface Party {
  id: string;
  name: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  balance?: number;
}

interface Transaction {
  id: string;
  partyId: string;
  date: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  reference?: string;
  isDeleted?: boolean;
}

const PARTIES_KEY = 'parties';
const TRANSACTIONS_KEY = 'transactions';

// Get all parties
export const getParties = (): Party[] => {
  const parties = localStorage.getItem(PARTIES_KEY);
  return parties ? JSON.parse(parties) : [];
};

// Get all transactions
export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  return transactions ? JSON.parse(transactions) : [];
};

// Add these functions to storageService.ts
export const addParties = (parties: Party[]) => {
  localStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
};

export const addTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};
