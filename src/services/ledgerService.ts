
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

// Add party
export const addParty = (party: Party): void => {
  const parties = getParties();
  parties.push(party);
  localStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
};

// Update party
export const updateParty = (updatedParty: Party): void => {
  const parties = getParties();
  const index = parties.findIndex(p => p.id === updatedParty.id);
  if (index !== -1) {
    parties[index] = updatedParty;
    localStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
  }
};

// Delete party
export const deleteParty = (id: string): void => {
  let parties = getParties();
  parties = parties.filter(p => p.id !== id);
  localStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
};

// Add transaction
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Update transaction
export const updateTransaction = (updatedTransaction: Transaction): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === updatedTransaction.id);
  if (index !== -1) {
    transactions[index] = updatedTransaction;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};

// Delete transaction
export const deleteTransaction = (id: string): void => {
  let transactions = getTransactions();
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Add these functions to export them from ledgerService
export const addParties = (parties: Party[]) => {
  localStorage.setItem(PARTIES_KEY, JSON.stringify(parties));
};

export const addTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};
