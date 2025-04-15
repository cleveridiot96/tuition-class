
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from '../storageUtils';
import { LedgerEntry, Account } from './types';
import { getAccountById, updateAccount } from './accountService';

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

// Helper function to determine balance type
export const determineBalanceType = (balance: number): 'debit' | 'credit' => {
  return balance >= 0 ? 'credit' : 'debit';
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
