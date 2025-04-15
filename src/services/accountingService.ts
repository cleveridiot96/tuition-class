import { v4 as uuidv4 } from 'uuid';
import {
  getFinancialYear,
  getActiveFinancialYear,
  saveFinancialYear,
  getYearSpecificStorageItem,
  saveYearSpecificStorageItem,
} from './financialYearService';
import {
  getAgents,
  getCustomers,
  getSuppliers,
  getBrokers,
  getTransporters,
  saveStorageItem,
  getStorageItem,
} from './storageService';
import {
  FinancialYear,
  Agent,
  Customer,
  Supplier,
  Broker,
  Transporter,
  Payment,
  Receipt,
} from './types';

// Define types for accounts and ledger entries
export interface Account {
  id: string;
  name: string;
  type: 'agent' | 'customer' | 'supplier' | 'broker' | 'transporter' | 'cash' | 'bank' | 'stock';
  openingBalance: number;
  openingBalanceType: 'debit' | 'credit';
  isDeleted?: boolean;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  date: string;
  reference: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: 'debit' | 'credit';
}

// Helper function to determine balance type
const determineBalanceType = (balance: number): 'debit' | 'credit' => {
  return balance >= 0 ? 'credit' : 'debit';
};

// Initialize accounts if they don't exist
export const initializeAccounts = () => {
  if (!getStorageItem('accounts')) {
    saveStorageItem('accounts', []);
  }
};

// Function to get all accounts
export const getAccounts = (): Account[] => {
  initializeAccounts();
  return getStorageItem('accounts') || [];
};

// Function to get an account by ID
export const getAccountById = (id: string): Account | null => {
  const accounts = getAccounts();
  return accounts.find(account => account.id === id) || null;
};

// Function to add a new account
export const addAccount = (account: Account) => {
  const accounts = getAccounts();
  account.id = uuidv4();
  accounts.push(account);
  saveStorageItem('accounts', accounts);
};

// Function to update an existing account
export const updateAccount = (updatedAccount: Account) => {
  const accounts = getAccounts();
  const updatedAccounts = accounts.map(account =>
    account.id === updatedAccount.id ? updatedAccount : account
  );
  saveStorageItem('accounts', updatedAccounts);
};

// Function to delete an account
export const deleteAccount = (id: string) => {
  const accounts = getAccounts();
  const updatedAccounts = accounts.filter(account => account.id !== id);
  saveStorageItem('accounts', updatedAccounts);
};

// Initialize ledger if it doesn't exist
export const initializeLedger = () => {
  if (!getStorageItem('ledger')) {
    saveStorageItem('ledger', []);
  }
};

// Function to get all ledger entries
export const getLedger = (): LedgerEntry[] => {
  initializeLedger();
  return getStorageItem('ledger') || [];
};

// Function to get ledger entries for a specific account
export const getAccountLedger = (accountId: string): LedgerEntry[] => {
  const ledger = getLedger();
  return ledger.filter(entry => entry.accountId === accountId);
};

// Function to add a ledger entry
export const addLedgerEntry = (entry: LedgerEntry) => {
  const ledger = getLedger();
  ledger.push(entry);
  saveStorageItem('ledger', ledger);
};

// Function to process opening balance
export const processOpeningBalance = (accountId: string, amount: number, balanceType: 'debit' | 'credit') => {
  const account = getAccountById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }

  // Initialize ledger if it doesn't exist
  initializeLedger();

  // Check if an opening balance entry already exists for this account
  const ledger = getLedger();
  const existingOpeningBalanceEntry = ledger.find(
    entry => entry.accountId === accountId && entry.reference === 'Opening Balance'
  );

  if (existingOpeningBalanceEntry) {
    // Update the existing opening balance entry
    existingOpeningBalanceEntry.debit = balanceType === 'debit' ? amount : 0;
    existingOpeningBalanceEntry.credit = balanceType === 'credit' ? amount : 0;
    existingOpeningBalanceEntry.balance = amount;
    existingOpeningBalanceEntry.balanceType = balanceType;

    // Save the updated ledger
    saveStorageItem('ledger', ledger);
  } else {
    // Create a new ledger entry for the opening balance
    const newEntry: LedgerEntry = {
      id: uuidv4(),
      accountId: accountId,
      date: new Date().toISOString().split('T')[0], // Use current date
      reference: 'Opening Balance',
      narration: 'Opening Balance',
      debit: balanceType === 'debit' ? amount : 0,
      credit: balanceType === 'credit' ? amount : 0,
      balance: amount,
      balanceType: balanceType,
    };

    // Add the new entry to the ledger
    addLedgerEntry(newEntry);
  }

  // Update the account's opening balance
  account.openingBalance = amount;
  account.openingBalanceType = balanceType;
  updateAccount(account);
};

// Function to process a payment
export const processPayment = (payment: Payment) => {
  const account = getAccountById(payment.partyId);
  if (!account) {
    throw new Error('Account not found');
  }

  const newEntry: LedgerEntry = {
    id: uuidv4(),
    accountId: payment.partyId,
    date: payment.date,
    reference: payment.reference || 'Payment',
    narration: payment.notes || 'Payment',
    debit: payment.amount,
    credit: 0,
    balance: 0,
    balanceType: 'debit',
  };

  addLedgerEntry(newEntry);

  // Update account balance
  const ledger = getAccountLedger(payment.partyId);
  let balance = account.openingBalance || 0;
  let balanceType: 'debit' | 'credit' = account.openingBalanceType || 'credit';

  ledger.forEach(entry => {
    if (entry.debit > 0) {
      balance -= entry.debit;
    } else if (entry.credit > 0) {
      balance += entry.credit;
    }
  });

  newEntry.balance = balance;
  newEntry.balanceType = determineBalanceType(balance);
  updateAccountBalance(payment.partyId, balance, newEntry.balanceType);
};

// Function to process a receipt
export const processReceipt = (receipt: Receipt) => {
  const account = getAccountById(receipt.customerId);
  if (!account) {
    throw new Error('Account not found');
  }

  const newEntry: LedgerEntry = {
    id: uuidv4(),
    accountId: receipt.customerId,
    date: receipt.date,
    reference: receipt.reference || 'Receipt',
    narration: receipt.notes || 'Receipt',
    debit: 0,
    credit: receipt.amount,
    balance: 0,
    balanceType: 'credit',
  };

  addLedgerEntry(newEntry);

  // Update account balance
  const ledger = getAccountLedger(receipt.customerId);
  let balance = account.openingBalance || 0;
  let balanceType: 'debit' | 'credit' = account.openingBalanceType || 'credit';

  ledger.forEach(entry => {
    if (entry.debit > 0) {
      balance -= entry.debit;
    } else if (entry.credit > 0) {
      balance += entry.credit;
    }
  });

  newEntry.balance = balance;
  newEntry.balanceType = determineBalanceType(balance);
  updateAccountBalance(receipt.customerId, balance, newEntry.balanceType);
};

// Function to update account balance
export const updateAccountBalance = (accountId: string, balance: number, balanceType: 'debit' | 'credit') => {
  const account = getAccountById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }

  account.openingBalance = balance;
  account.openingBalanceType = balanceType;
  updateAccount(account);
};

// Seed initial data
export const seedInitialData = () => {
  initializeAccounts();
  initializeLedger();

  // Create default accounts for cash and bank if they don't exist
  if (!getAccountById('cash')) {
    addAccount({
      id: 'cash',
      name: 'Cash Account',
      type: 'cash',
      openingBalance: 0,
      openingBalanceType: 'credit',
    });
  }

  if (!getAccountById('bank')) {
    addAccount({
      id: 'bank',
      name: 'Bank Account',
      type: 'bank',
      openingBalance: 0,
      openingBalanceType: 'credit',
    });
  }
};

// Call seedInitialData when the module is loaded
seedInitialData();
