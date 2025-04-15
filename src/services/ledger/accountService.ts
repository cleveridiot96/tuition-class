
import { Account } from './types';
import { getStorageItem, saveStorageItem } from '../storageUtils';

const ACCOUNTS_STORAGE_KEY = 'accounts';

export const accountService = {
  initializeAccounts: () => {
    // Initialize accounts if they don't exist in storage
    if (!getStorageItem(ACCOUNTS_STORAGE_KEY)) {
      saveStorageItem(ACCOUNTS_STORAGE_KEY, []);
    }
  },

  getAccounts: (): Account[] => {
    return getStorageItem(ACCOUNTS_STORAGE_KEY) || [];
  },

  getAccountById: (id: string): Account | null => {
    const accounts = accountService.getAccounts();
    return accounts.find(account => account.id === id) || null;
  },

  addAccount: (account: Account): void => {
    const accounts = accountService.getAccounts();
    accounts.push(account);
    saveStorageItem(ACCOUNTS_STORAGE_KEY, accounts);
  },

  updateAccount: (updatedAccount: Account): void => {
    const accounts = accountService.getAccounts();
    const index = accounts.findIndex(account => account.id === updatedAccount.id);
    if (index !== -1) {
      accounts[index] = updatedAccount;
      saveStorageItem(ACCOUNTS_STORAGE_KEY, accounts);
    }
  },

  deleteAccount: (id: string): void => {
    const accounts = accountService.getAccounts();
    const filtered = accounts.filter(account => account.id !== id);
    saveStorageItem(ACCOUNTS_STORAGE_KEY, filtered);
  }
};

export const {
  initializeAccounts,
  getAccounts,
  getAccountById,
  addAccount,
  updateAccount,
  deleteAccount
} = accountService;
