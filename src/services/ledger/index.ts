
import { accountService } from './accountService';
import { ledgerService } from './ledgerService';
import { expenseService } from './expenseService';
import { cashBookService } from './cashBookService';

// Re-export all services
export * from './types';
export * from './accountService';
export * from './ledgerService';
export * from './expenseService';
export * from './cashBookService';

// Initialize the system
export const initializeAccounting = () => {
  accountService.initializeAccounts();
  ledgerService.initializeLedger();
  
  // Create default accounts for cash and bank if they don't exist
  if (!accountService.getAccountById('cash')) {
    accountService.addAccount({
      id: 'cash',
      name: 'Cash Account',
      type: 'cash',
      openingBalance: 0,
      openingBalanceType: 'credit',
      isSystemAccount: true,
    });
  }

  if (!accountService.getAccountById('bank')) {
    accountService.addAccount({
      id: 'bank',
      name: 'Bank Account',
      type: 'bank',
      openingBalance: 0,
      openingBalanceType: 'credit',
      isSystemAccount: true,
    });
  }
};

// Initialize when the module is loaded
initializeAccounting();
