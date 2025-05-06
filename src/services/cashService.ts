
// Simple cash transaction service

export interface CashTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
}

const CASH_TRANSACTIONS_KEY = 'cash_transactions';

// Get all cash transactions
export const getCashTransactions = (): CashTransaction[] => {
  const transactions = localStorage.getItem(CASH_TRANSACTIONS_KEY);
  return transactions ? JSON.parse(transactions) : [];
};

// Add a new cash transaction
export const addCashTransaction = (transaction: CashTransaction): void => {
  const transactions = getCashTransactions();
  transactions.push(transaction);
  localStorage.setItem(CASH_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Delete a cash transaction by id
export const deleteCashTransaction = (id: string): void => {
  let transactions = getCashTransactions();
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem(CASH_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Update a cash transaction
export const updateCashTransaction = (transaction: CashTransaction): void => {
  let transactions = getCashTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  if (index !== -1) {
    transactions[index] = transaction;
    localStorage.setItem(CASH_TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};
