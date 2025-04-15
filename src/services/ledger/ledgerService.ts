import { LedgerEntry } from './types';
import { getStorageItem, saveStorageItem } from '../storageUtils';

const LEDGER_STORAGE_KEY = 'ledger';

export const ledgerService = {
  initializeLedger: () => {
    if (!getStorageItem(LEDGER_STORAGE_KEY)) {
      saveStorageItem(LEDGER_STORAGE_KEY, []);
    }
  },

  getLedger: (): LedgerEntry[] => {
    return getStorageItem(LEDGER_STORAGE_KEY) || [];
  },

  getAccountLedger: (accountId: string): LedgerEntry[] => {
    const ledger = ledgerService.getLedger();
    return ledger.filter(entry => entry.accountId === accountId);
  },

  addLedgerEntry: (entry: LedgerEntry): void => {
    const ledger = ledgerService.getLedger();
    ledger.push(entry);
    saveStorageItem(LEDGER_STORAGE_KEY, ledger);
  },

  updateLedgerEntry: (updatedEntry: LedgerEntry): void => {
    const ledger = ledgerService.getLedger();
    const index = ledger.findIndex(entry => entry.id === updatedEntry.id);
    
    if (index !== -1) {
      ledger[index] = updatedEntry;
      saveStorageItem(LEDGER_STORAGE_KEY, ledger);
    }
  },

  deleteLedgerEntry: (id: string): void => {
    const ledger = ledgerService.getLedger();
    const filteredLedger = ledger.filter(entry => entry.id !== id);
    saveStorageItem(LEDGER_STORAGE_KEY, filteredLedger);
  }
};

export const {
  initializeLedger,
  getLedger,
  getAccountLedger,
  addLedgerEntry,
  updateLedgerEntry,
  deleteLedgerEntry
} = ledgerService;
