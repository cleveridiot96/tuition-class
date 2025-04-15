
import { LedgerEntry } from './types';
import { getItem, setItem } from '../storageService';

const LEDGER_STORAGE_KEY = 'ledger';

export const ledgerService = {
  initializeLedger: () => {
    // Initialize ledger if it doesn't exist in storage
    if (!getItem(LEDGER_STORAGE_KEY)) {
      setItem(LEDGER_STORAGE_KEY, []);
    }
  },

  getLedger: (): LedgerEntry[] => {
    return getItem(LEDGER_STORAGE_KEY) || [];
  },

  addLedgerEntry: (entry: LedgerEntry): void => {
    const ledger = ledgerService.getLedger();
    ledger.push(entry);
    setItem(LEDGER_STORAGE_KEY, ledger);
  },

  updateLedgerEntry: (updatedEntry: LedgerEntry): void => {
    const ledger = ledgerService.getLedger();
    const index = ledger.findIndex(entry => entry.id === updatedEntry.id);
    
    if (index !== -1) {
      ledger[index] = updatedEntry;
      setItem(LEDGER_STORAGE_KEY, ledger);
    }
  },

  deleteLedgerEntry: (id: string): void => {
    const ledger = ledgerService.getLedger();
    const filteredLedger = ledger.filter(entry => entry.id !== id);
    setItem(LEDGER_STORAGE_KEY, filteredLedger);
  }
};

export const {
  initializeLedger,
  getLedger,
  addLedgerEntry,
  updateLedgerEntry,
  deleteLedgerEntry
} = ledgerService;
