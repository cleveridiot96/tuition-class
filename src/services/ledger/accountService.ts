
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from '../storageUtils';
import { Account } from './types';

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
  account.id = account.id || uuidv4();
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
