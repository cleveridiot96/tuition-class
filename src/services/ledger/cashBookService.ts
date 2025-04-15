
import { LedgerEntry } from './types';
import { getLedger } from './ledgerService';

export const cashBookService = {
  getCashBookEntries: (startDate?: string, endDate?: string): LedgerEntry[] => {
    const ledger = getLedger();
    
    // Filter for cash accounts
    let entries = ledger.filter(entry => entry.accountId === 'cash');
    
    // Filter by date if provided
    if (startDate) {
      entries = entries.filter(entry => entry.date >= startDate);
    }
    
    if (endDate) {
      entries = entries.filter(entry => entry.date <= endDate);
    }
    
    // Sort by date ascending
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate running balance
    let balance = 0;
    
    entries.forEach(entry => {
      if (entry.debit > 0) {
        balance -= entry.debit;
      } else if (entry.credit > 0) {
        balance += entry.credit;
      }
      entry.balance = balance;
      entry.balanceType = balance >= 0 ? 'credit' : 'debit';
    });
    
    return entries;
  },

  getTodayCashTransactions: () => {
    const today = new Date().toISOString().split('T')[0];
    const ledger = getLedger();
    
    // Filter for today's cash transactions
    const todaysEntries = ledger.filter(
      entry => entry.accountId === 'cash' && entry.date === today
    );
    
    // Calculate totals
    let cashIn = 0;
    let cashOut = 0;
    
    todaysEntries.forEach(entry => {
      if (entry.credit > 0) {
        cashIn += entry.credit;
      }
      if (entry.debit > 0) {
        cashOut += entry.debit;
      }
    });
    
    return { cashIn, cashOut };
  }
};

export const {
  getCashBookEntries,
  getTodayCashTransactions
} = cashBookService;
