
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from '../storageUtils';
import { ManualExpense } from './types';
import { addLedgerEntry } from './ledgerService';

// Function to add manual expense
export const addManualExpense = (expense: ManualExpense): ManualExpense => {
  // Get existing expenses or initialize
  const expenses = getStorageItem('expenses') || [];
  
  // Add new expense with ID if not provided
  const expenseWithId = {
    ...expense,
    id: expense.id || uuidv4()
  };
  expenses.push(expenseWithId);
  
  // Save to storage
  saveStorageItem('expenses', expenses);
  
  // Create and add ledger entry
  addLedgerEntry({
    id: uuidv4(),
    accountId: expense.paymentMode === 'cash' ? 'cash' : 'bank',
    date: expense.date,
    reference: expense.reference || expense.category,
    narration: expense.description,
    debit: expense.amount,
    credit: 0,
    balance: 0,
    balanceType: 'debit'
  });
  
  return expenseWithId;
};

// Function to get expenses
export const getExpenses = (): ManualExpense[] => {
  return getStorageItem('expenses') || [];
};
