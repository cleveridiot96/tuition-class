
import { v4 as uuidv4 } from 'uuid';
import { LedgerEntry, ManualExpense } from './types';
import { getStorageItem, saveStorageItem } from '../storageUtils';
import { addLedgerEntry } from './ledgerService';

const EXPENSES_STORAGE_KEY = 'expenses';

export const expenseService = {
  getExpenses: (): ManualExpense[] => {
    const expenses = getStorageItem(EXPENSES_STORAGE_KEY, []);
    if (!expenses) {
      saveStorageItem(EXPENSES_STORAGE_KEY, []);
      return [];
    }
    return expenses;
  },

  addManualExpense: (expense: ManualExpense): ManualExpense => {
    // Add expense to expenses storage
    const expenses = expenseService.getExpenses();
    const newExpense = {
      ...expense,
      id: expense.id || uuidv4()
    };
    expenses.push(newExpense);
    saveStorageItem(EXPENSES_STORAGE_KEY, expenses);

    // Add corresponding entries to the ledger
    const ledgerEntry: LedgerEntry = {
      id: uuidv4(),
      date: expense.date,
      accountId: expense.paymentMode === 'bank' ? 'bank' : 'cash',  // Use payment mode to determine account
      reference: expense.reference || 'Expense',
      referenceId: expense.id,
      narration: expense.description,
      debit: expense.amount,
      credit: 0,
      balance: 0,
      balanceType: 'debit'
    };

    addLedgerEntry(ledgerEntry);

    // Also add entry for the expense account
    const expenseLedgerEntry: LedgerEntry = {
      id: uuidv4(),
      date: expense.date,
      accountId: expense.expenseAccount || 'expenses',
      reference: expense.reference || 'Expense',
      referenceId: expense.id,
      narration: expense.description,
      debit: 0,
      credit: expense.amount,
      balance: 0,
      balanceType: 'credit'
    };

    addLedgerEntry(expenseLedgerEntry);
    return newExpense;
  }
};

export const {
  getExpenses,
  addManualExpense
} = expenseService;
