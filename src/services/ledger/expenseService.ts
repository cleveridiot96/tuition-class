
import { v4 as uuidv4 } from 'uuid';
import { LedgerEntry, ManualExpense } from './types';
import { getItem, setItem } from '../storageService';
import { addLedgerEntry } from './ledgerService';

const EXPENSES_STORAGE_KEY = 'expenses';

export const expenseService = {
  getExpenses: (): ManualExpense[] => {
    const expenses = getItem(EXPENSES_STORAGE_KEY);
    if (!expenses) {
      setItem(EXPENSES_STORAGE_KEY, []);
      return [];
    }
    return expenses;
  },

  addManualExpense: (expense: ManualExpense): void => {
    // Add expense to expenses storage
    const expenses = expenseService.getExpenses() || [];
    expenses.push({
      ...expense,
      id: expense.id || uuidv4()
    });
    setItem(EXPENSES_STORAGE_KEY, expenses);

    // Add corresponding entries to the ledger
    const ledgerEntry: LedgerEntry = {
      id: uuidv4(),
      date: expense.date,
      accountId: 'cash',  // Assuming expenses are paid from cash by default
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
  }
};

export const {
  getExpenses,
  addManualExpense
} = expenseService;
