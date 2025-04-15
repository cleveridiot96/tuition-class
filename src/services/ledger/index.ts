
export * from './types';
export * from './accountService';
export * from './ledgerService';
export * from './expenseService';
export * from './cashBookService';

// Initialize the system
export const initializeAccounting = () => {
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
      isSystemAccount: true,
    });
  }

  if (!getAccountById('bank')) {
    addAccount({
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
