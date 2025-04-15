import { v4 as uuidv4 } from 'uuid';
import { debounce, throttle } from '@/lib/utils';
import { 
  getPurchases, 
  getSales, 
  getPayments, 
  getReceipts,
  getAgents,
  getBrokers,
  getCustomers,
  getTransporters,
  getSuppliers,
  getInventory,
} from './storageService';

export interface AccountEntry {
  id: string;
  date: string;
  accountId: string;
  accountName: string;
  oppositeAccountId: string;
  oppositeAccountName: string;
  amount: number;
  type: 'debit' | 'credit';
  reference: string;
  narration: string;
  transactionId: string;
  transactionType: 'purchase' | 'sale' | 'payment' | 'receipt' | 'commission' | 'opening' | 'expense' | 'other';
  isDeleted?: boolean;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: 'DR' | 'CR';
  transactionCount: number;
}

// Account types
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  isSystemAccount: boolean;
  openingBalance?: number;
  openingBalanceType?: 'debit' | 'credit';
  isDeleted?: boolean;
}

export type AccountType = 
  | 'asset' 
  | 'liability' 
  | 'income' 
  | 'expense' 
  | 'equity'
  | 'customer' 
  | 'supplier' 
  | 'agent' 
  | 'broker' 
  | 'transporter'
  | 'bank' 
  | 'cash';

// Storage keys
const ACCOUNT_ENTRIES_KEY = 'accountEntries';
const ACCOUNTS_KEY = 'accounts';
const MANUAL_EXPENSES_KEY = 'manualExpenses';

// Manual expense entry
export interface ManualExpense {
  id: string;
  date: string;
  amount: number;
  description: string;
  paymentMode: 'cash' | 'bank';
  category: string;
  reference?: string;
  partyId?: string;
  partyName?: string;
  isDeleted?: boolean;
}

// Cache for ledger data to improve performance
const ledgerCache = new Map<string, LedgerEntry[]>();
const accountBalanceCache = new Map<string, AccountBalance>();
const MAX_CACHE_SIZE = 50;

// Helper for cache management
const clearCacheForAccount = (accountId: string) => {
  ledgerCache.delete(accountId);
  accountBalanceCache.delete(accountId);
};

const clearAllCaches = () => {
  ledgerCache.clear();
  accountBalanceCache.clear();
};

// Get all account entries with memoization
export const getAccountEntries = (): AccountEntry[] => {
  try {
    const entries = localStorage.getItem(ACCOUNT_ENTRIES_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting account entries:', error);
    return [];
  }
};

// Save account entries
export const saveAccountEntries = (entries: AccountEntry[]): void => {
  try {
    localStorage.setItem(ACCOUNT_ENTRIES_KEY, JSON.stringify(entries));
    // Clear caches as data has changed
    clearAllCaches();
  } catch (error) {
    console.error('Error saving account entries:', error);
  }
};

// Get all accounts
export const getAccounts = (): Account[] => {
  try {
    const accounts = localStorage.getItem(ACCOUNTS_KEY);
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

// Save accounts
export const saveAccounts = (accounts: Account[]): void => {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    // Clear caches as account data has changed
    clearAllCaches();
  } catch (error) {
    console.error('Error saving accounts:', error);
  }
};

// Get all manual expenses
export const getManualExpenses = (): ManualExpense[] => {
  try {
    const expenses = localStorage.getItem(MANUAL_EXPENSES_KEY);
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error('Error getting manual expenses:', error);
    return [];
  }
};

// Save manual expenses
export const saveManualExpenses = (expenses: ManualExpense[]): void => {
  try {
    localStorage.setItem(MANUAL_EXPENSES_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving manual expenses:', error);
  }
};

// Add a manual expense
export const addManualExpense = (expense: ManualExpense): ManualExpense => {
  const expenses = getManualExpenses();
  const newExpense = {
    ...expense,
    id: expense.id || uuidv4()
  };
  expenses.push(newExpense);
  saveManualExpenses(expenses);
  
  // Create double entry for the expense
  createDoubleEntry(
    expense.date,
    'acc-expenses', // Debit Expenses Account
    expense.paymentMode === 'cash' ? 'acc-cash' : 'acc-bank', // Credit Cash/Bank Account
    expense.amount,
    expense.reference || '',
    expense.description,
    'expense',
    newExpense.id
  );
  
  return newExpense;
};

// Add an account entry
export const addAccountEntry = (entry: AccountEntry): void => {
  const entries = getAccountEntries();
  entries.push({
    ...entry,
    id: entry.id || uuidv4()
  });
  saveAccountEntries(entries);
  
  // Clear cache for affected accounts
  clearCacheForAccount(entry.accountId);
  clearCacheForAccount(entry.oppositeAccountId);
};

// Add an account
export const addAccount = (account: Account): Account => {
  const accounts = getAccounts();
  const newAccount = {
    ...account,
    id: account.id || uuidv4()
  };
  accounts.push(newAccount);
  saveAccounts(accounts);
  
  // If account has opening balance, create opening balance entry
  if (newAccount.openingBalance && newAccount.openingBalance > 0) {
    const oppositeAccountId = newAccount.openingBalanceType === 'debit' 
      ? 'acc-opening-balance-equity' 
      : 'acc-opening-balance-equity';
    
    const oppositeAccount = getAccountById(oppositeAccountId) || 
      addAccount({
        id: 'acc-opening-balance-equity',
        name: 'Opening Balance Equity',
        type: 'equity',
        isSystemAccount: true
      });
    
    // Create opening balance entry
    const entry: AccountEntry = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      accountId: newAccount.id,
      accountName: newAccount.name,
      oppositeAccountId: oppositeAccount.id,
      oppositeAccountName: oppositeAccount.name,
      amount: newAccount.openingBalance,
      type: newAccount.openingBalanceType || 'debit',
      reference: 'Opening Balance',
      narration: `Opening Balance for ${newAccount.name}`,
      transactionId: uuidv4(),
      transactionType: 'opening'
    };
    
    addAccountEntry(entry);
  }
  
  return newAccount;
};

// Update account
export const updateAccount = (account: Account): Account => {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === account.id);
  
  if (index !== -1) {
    const oldAccount = accounts[index];
    accounts[index] = account;
    saveAccounts(accounts);
    
    // Handle opening balance changes
    const oldOpening = oldAccount.openingBalance || 0;
    const newOpening = account.openingBalance || 0;
    
    if (oldOpening !== newOpening || oldAccount.openingBalanceType !== account.openingBalanceType) {
      // Remove existing opening balance entries
      const entries = getAccountEntries();
      const filtered = entries.filter(entry => 
        !(entry.accountId === account.id && entry.transactionType === 'opening')
      );
      saveAccountEntries(filtered);
      
      // Add new opening balance if needed
      if (newOpening > 0) {
        const oppositeAccountId = 'acc-opening-balance-equity';
        
        const oppositeAccount = getAccountById(oppositeAccountId) || 
          addAccount({
            id: 'acc-opening-balance-equity',
            name: 'Opening Balance Equity',
            type: 'equity',
            isSystemAccount: true
          });
        
        // Create opening balance entry
        const entry: AccountEntry = {
          id: uuidv4(),
          date: new Date().toISOString().split('T')[0],
          accountId: account.id,
          accountName: account.name,
          oppositeAccountId: oppositeAccount.id,
          oppositeAccountName: oppositeAccount.name,
          amount: newOpening,
          type: account.openingBalanceType || 'debit',
          reference: 'Opening Balance',
          narration: `Opening Balance for ${account.name}`,
          transactionId: uuidv4(),
          transactionType: 'opening'
        };
        
        addAccountEntry(entry);
      }
    }
    
    // Clear cache for this account
    clearCacheForAccount(account.id);
    return account;
  }
  
  return account;
};

// Get account by ID
export const getAccountById = (id: string): Account | undefined => {
  const accounts = getAccounts();
  return accounts.find(account => account.id === id && !account.isDeleted);
};

// Get account by name
export const getAccountByName = (name: string): Account | undefined => {
  const accounts = getAccounts();
  return accounts.find(account => account.name === name && !account.isDeleted);
};

// Get entries for an account
export const getEntriesForAccount = (accountId: string): AccountEntry[] => {
  const entries = getAccountEntries();
  return entries.filter(entry => 
    (entry.accountId === accountId || entry.oppositeAccountId === accountId) && 
    !entry.isDeleted
  );
};

// Calculate account balance
export const calculateAccountBalance = (accountId: string): AccountBalance => {
  // Check cache first
  if (accountBalanceCache.has(accountId)) {
    return accountBalanceCache.get(accountId)!;
  }
  
  const account = getAccountById(accountId);
  if (!account) {
    return {
      accountId,
      accountName: 'Unknown',
      debit: 0,
      credit: 0,
      balance: 0,
      balanceType: 'DR',
      transactionCount: 0
    };
  }

  let debit = 0;
  let credit = 0;
  let transactionCount = 0;
  
  // Add opening balance if exists
  if (account.openingBalance) {
    if (account.openingBalanceType === 'debit') {
      debit += account.openingBalance;
    } else {
      credit += account.openingBalance;
    }
    transactionCount++;
  }
  
  const entries = getEntriesForAccount(accountId);
  
  entries.forEach(entry => {
    if (entry.accountId === accountId) {
      if (entry.type === 'debit') {
        debit += entry.amount;
      } else {
        credit += entry.amount;
      }
    } else {
      // This is the opposite account
      if (entry.type === 'debit') {
        credit += entry.amount;
      } else {
        debit += entry.amount;
      }
    }
    transactionCount++;
  });
  
  // Determine balance and balance type based on account type
  let balance = debit - credit;
  let balanceType: 'DR' | 'CR' = balance >= 0 ? 'DR' : 'CR';
  
  if (balance < 0) {
    balance = Math.abs(balance);
  }
  
  const result = {
    accountId,
    accountName: account.name,
    debit,
    credit,
    balance,
    balanceType,
    transactionCount
  };
  
  // Cache the result
  if (accountBalanceCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry if cache is full
    const firstKey = accountBalanceCache.keys().next().value;
    accountBalanceCache.delete(firstKey);
  }
  accountBalanceCache.set(accountId, result);
  
  return result;
};

// Create double entry
export const createDoubleEntry = (
  date: string,
  debitAccountId: string,
  creditAccountId: string,
  amount: number,
  reference: string,
  narration: string,
  transactionType: AccountEntry['transactionType'],
  transactionId: string
): void => {
  const debitAccount = getAccountById(debitAccountId);
  const creditAccount = getAccountById(creditAccountId);
  
  if (!debitAccount || !creditAccount) {
    console.error('One or both accounts not found');
    return;
  }
  
  // Create debit entry
  const debitEntry: AccountEntry = {
    id: uuidv4(),
    date,
    accountId: debitAccountId,
    accountName: debitAccount.name,
    oppositeAccountId: creditAccountId,
    oppositeAccountName: creditAccount.name,
    amount,
    type: 'debit',
    reference,
    narration,
    transactionId,
    transactionType
  };
  
  // Create credit entry
  const creditEntry: AccountEntry = {
    id: uuidv4(),
    date,
    accountId: creditAccountId,
    accountName: creditAccount.name,
    oppositeAccountId: debitAccountId,
    oppositeAccountName: debitAccount.name,
    amount,
    type: 'credit',
    reference,
    narration,
    transactionId,
    transactionType
  };
  
  // Add both entries
  addAccountEntry(debitEntry);
  addAccountEntry(creditEntry);
  
  // Clear cache for affected accounts
  clearCacheForAccount(debitAccountId);
  clearCacheForAccount(creditAccountId);
};

// Initialize system accounts
export const initializeSystemAccounts = (): void => {
  const existingAccounts = getAccounts();
  
  if (existingAccounts.length > 0) return; // Don't initialize if accounts already exist
  
  const systemAccounts: Account[] = [
    { id: 'acc-cash', name: 'Cash', type: 'cash', isSystemAccount: true },
    { id: 'acc-bank', name: 'Bank', type: 'bank', isSystemAccount: true },
    { id: 'acc-purchase', name: 'Purchase', type: 'expense', isSystemAccount: true },
    { id: 'acc-sales', name: 'Sales', type: 'income', isSystemAccount: true },
    { id: 'acc-commission', name: 'Commission', type: 'expense', isSystemAccount: true },
    { id: 'acc-transport', name: 'Transport', type: 'expense', isSystemAccount: true },
    { id: 'acc-expenses', name: 'Expenses', type: 'expense', isSystemAccount: true },
    { id: 'acc-office-expenses', name: 'Office Expenses', type: 'expense', isSystemAccount: true },
    { id: 'acc-salary', name: 'Salary', type: 'expense', isSystemAccount: true },
    { id: 'acc-opening-balance-equity', name: 'Opening Balance Equity', type: 'equity', isSystemAccount: true }
  ];
  
  systemAccounts.forEach(account => addAccount(account));
  
  // Create accounts for existing contacts
  createContactAccounts();
};

// Create accounts for existing contacts if not already created
export const createContactAccounts = (): void => {
  const agents = getAgents();
  const brokers = getBrokers();
  const customers = getCustomers();
  const transporters = getTransporters();
  const suppliers = getSuppliers();
  
  agents.forEach(agent => {
    if (!getAccountByName(agent.name)) {
      addAccount({
        id: `acc-agent-${agent.id}`,
        name: agent.name,
        type: 'agent',
        isSystemAccount: false,
        openingBalance: 0,
        openingBalanceType: 'credit'
      });
    }
  });
  
  brokers.forEach(broker => {
    if (!getAccountByName(broker.name)) {
      addAccount({
        id: `acc-broker-${broker.id}`,
        name: broker.name,
        type: 'broker',
        isSystemAccount: false,
        openingBalance: 0,
        openingBalanceType: 'credit'
      });
    }
  });
  
  customers.forEach(customer => {
    if (!getAccountByName(customer.name)) {
      addAccount({
        id: `acc-customer-${customer.id}`,
        name: customer.name,
        type: 'customer',
        isSystemAccount: false,
        openingBalance: 0,
        openingBalanceType: 'debit'
      });
    }
  });
  
  transporters.forEach(transporter => {
    if (!getAccountByName(transporter.name)) {
      addAccount({
        id: `acc-transporter-${transporter.id}`,
        name: transporter.name,
        type: 'transporter',
        isSystemAccount: false,
        openingBalance: 0,
        openingBalanceType: 'credit'
      });
    }
  });
  
  suppliers.forEach(supplier => {
    if (!getAccountByName(supplier.name)) {
      addAccount({
        id: `acc-supplier-${supplier.id}`,
        name: supplier.name,
        type: 'supplier',
        isSystemAccount: false,
        openingBalance: 0,
        openingBalanceType: 'credit'
      });
    }
  });
};

// Refresh accounting data from transactions
export const refreshAccountingData = throttle((): void => {
  // Clear existing entries
  saveAccountEntries([]);
  
  // Initialize system accounts
  initializeSystemAccounts();
  
  // Process purchases
  const purchases = getPurchases().filter(p => !p.isDeleted);
  purchases.forEach(purchase => {
    // Find or create agent account
    let agentAccountId = '';
    if (purchase.agentId) {
      const agentAccount = getAccountById(`acc-agent-${purchase.agentId}`);
      if (agentAccount) {
        agentAccountId = agentAccount.id;
      }
    }
    
    // Purchase entry: Dr. Purchase A/c, Cr. Agent/Supplier A/c
    if (agentAccountId) {
      createDoubleEntry(
        purchase.date,
        'acc-purchase', // Debit Purchase Account
        agentAccountId, // Credit Agent Account
        purchase.totalAmount, // Amount before expenses
        purchase.lotNumber,
        `Purchase of Lot ${purchase.lotNumber}`,
        'purchase',
        purchase.id
      );
    }
    
    // If there are transport expenses
    if (purchase.transportCost && purchase.transportCost > 0 && purchase.transporterId) {
      const transporterAccount = getAccountById(`acc-transporter-${purchase.transporterId}`);
      if (transporterAccount) {
        createDoubleEntry(
          purchase.date,
          'acc-transport', // Debit Transport Account
          transporterAccount.id, // Credit Transporter Account
          purchase.transportCost,
          purchase.lotNumber,
          `Transport for Lot ${purchase.lotNumber}`,
          'purchase',
          `${purchase.id}-transport`
        );
      }
    }
    
    // If there are other expenses
    if (purchase.expenses && purchase.expenses > 0) {
      createDoubleEntry(
        purchase.date,
        'acc-expenses', // Debit Expenses Account
        'acc-cash', // Credit Cash Account (assuming paid in cash)
        purchase.expenses,
        purchase.lotNumber,
        `Expenses for Lot ${purchase.lotNumber}`,
        'purchase',
        `${purchase.id}-expenses`
      );
    }
  });
  
  // Process sales
  const sales = getSales().filter(s => !s.isDeleted);
  sales.forEach(sale => {
    // Find customer account
    let customerAccountId = '';
    if (sale.customerId) {
      const customerAccount = getAccountById(`acc-customer-${sale.customerId}`);
      if (customerAccount) {
        customerAccountId = customerAccount.id;
      }
    }
    
    // Sale entry: Dr. Customer A/c, Cr. Sales A/c
    if (customerAccountId) {
      createDoubleEntry(
        sale.date,
        customerAccountId, // Debit Customer Account
        'acc-sales', // Credit Sales Account
        sale.totalAmount,
        sale.lotNumber,
        `Sale of Lot ${sale.lotNumber}`,
        'sale',
        sale.id
      );
    }
    
    // If there's a broker commission
    if (sale.brokerId) {
      // Calculate broker commission
      const broker = getBrokers().find(b => b.id === sale.brokerId);
      if (broker) {
        const brokerAccount = getAccountById(`acc-broker-${broker.id}`);
        if (brokerAccount) {
          const commission = sale.totalAmount * (broker.commissionRate / 100);
          
          createDoubleEntry(
            sale.date,
            'acc-commission', // Debit Commission Account
            brokerAccount.id, // Credit Broker Account
            commission,
            sale.lotNumber,
            `Commission for Lot ${sale.lotNumber} sale`,
            'commission',
            `${sale.id}-commission`
          );
        }
      }
    }
    
    // If there are transport costs in sales
    if (sale.transportCost && sale.transportCost > 0 && sale.transporterId) {
      const transporterAccount = getAccountById(`acc-transporter-${sale.transporterId}`);
      if (transporterAccount) {
        createDoubleEntry(
          sale.date,
          'acc-transport', // Debit Transport Account
          transporterAccount.id, // Credit Transporter Account
          sale.transportCost,
          sale.lotNumber,
          `Transport for Lot ${sale.lotNumber} sale`,
          'sale',
          `${sale.id}-transport`
        );
      }
    }
  });
  
  // Process payments
  const payments = getPayments().filter(p => !p.isDeleted);
  payments.forEach(payment => {
    // Find party account
    let partyAccountId = '';
    
    // Try to find the account based on partyId
    if (payment.partyId) {
      // Check in agents
      partyAccountId = `acc-agent-${payment.partyId}`;
      if (!getAccountById(partyAccountId)) {
        // Check in brokers
        partyAccountId = `acc-broker-${payment.partyId}`;
        if (!getAccountById(partyAccountId)) {
          // Check in transporters
          partyAccountId = `acc-transporter-${payment.partyId}`;
          if (!getAccountById(partyAccountId)) {
            // Check in suppliers
            partyAccountId = `acc-supplier-${payment.partyId}`;
            if (!getAccountById(partyAccountId)) {
              partyAccountId = '';
            }
          }
        }
      }
    }
    
    // Payment entry: Dr. Party A/c, Cr. Cash/Bank A/c
    if (partyAccountId) {
      createDoubleEntry(
        payment.date,
        partyAccountId, // Debit Party Account
        payment.mode === 'cash' ? 'acc-cash' : 'acc-bank', // Credit Cash or Bank Account
        payment.amount,
        payment.reference || '',
        `Payment to ${payment.partyName || 'party'}`,
        'payment',
        payment.id
      );
    }
  });
  
  // Process receipts
  const receipts = getReceipts().filter(r => !r.isDeleted);
  receipts.forEach(receipt => {
    // Find customer account
    let customerAccountId = '';
    if (receipt.customerId) {
      customerAccountId = `acc-customer-${receipt.customerId}`;
    }
    
    // Receipt entry: Dr. Cash/Bank A/c, Cr. Customer A/c
    if (customerAccountId && getAccountById(customerAccountId)) {
      createDoubleEntry(
        receipt.date,
        receipt.mode === 'cash' ? 'acc-cash' : 'acc-bank', // Debit Cash or Bank Account
        customerAccountId, // Credit Customer Account
        receipt.amount,
        receipt.reference || '',
        `Receipt from ${receipt.customerName || 'customer'}`,
        'receipt',
        receipt.id
      );
    }
  });
  
  // Process manual expenses
  const manualExpenses = getManualExpenses().filter(e => !e.isDeleted);
  manualExpenses.forEach(expense => {
    // Handle general expenses
    createDoubleEntry(
      expense.date,
      'acc-expenses', // Debit appropriate expense account based on category
      expense.paymentMode === 'cash' ? 'acc-cash' : 'acc-bank', // Credit Cash/Bank
      expense.amount,
      expense.reference || '',
      expense.description,
      'expense',
      expense.id
    );
  });
  
  // Clear all caches after refreshing
  clearAllCaches();
}, 500);

// Get formatted ledger for account
export interface LedgerEntry {
  date: string;
  reference: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: 'DR' | 'CR';
  transactionId: string;
  transactionType: AccountEntry['transactionType'];
}

export const getAccountLedger = (accountId: string): LedgerEntry[] => {
  // Check cache first
  if (ledgerCache.has(accountId)) {
    return ledgerCache.get(accountId)!;
  }
  
  const account = getAccountById(accountId);
  if (!account) return [];
  
  const entries = getEntriesForAccount(accountId);
  const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let balance = account.openingBalance || 0;
  let balanceType: 'DR' | 'CR' = account.openingBalanceType === 'debit' ? 'DR' : 'CR';
  
  const ledger: LedgerEntry[] = [];
  
  // Add opening balance if exists
  if (account.openingBalance && account.openingBalance > 0) {
    ledger.push({
      date: '1970-01-01', // Beginning of time for opening balance
      reference: 'Opening Balance',
      narration: 'Opening Balance',
      debit: account.openingBalanceType === 'debit' ? account.openingBalance : 0,
      credit: account.openingBalanceType === 'credit' ? account.openingBalance : 0,
      balance: account.openingBalance,
      balanceType,
      transactionId: '',
      transactionType: 'opening'
    });
  }
  
  // Process entries
  sortedEntries.forEach(entry => {
    let debit = 0;
    let credit = 0;
    
    // Determine if this is a debit or credit for this account
    if (entry.accountId === accountId) {
      if (entry.type === 'debit') {
        debit = entry.amount;
        
        if (balanceType === 'DR') {
          balance += debit;
        } else {
          balance -= debit;
          if (balance < 0) {
            balance = Math.abs(balance);
            balanceType = 'DR';
          }
        }
      } else { // credit
        credit = entry.amount;
        
        if (balanceType === 'CR') {
          balance += credit;
        } else {
          balance -= credit;
          if (balance < 0) {
            balance = Math.abs(balance);
            balanceType = 'CR';
          }
        }
      }
    } else { // This account is the opposite account
      if (entry.type === 'debit') { // If entry is debit, this is credit
        credit = entry.amount;
        
        if (balanceType === 'CR') {
          balance += credit;
        } else {
          balance -= credit;
          if (balance < 0) {
            balance = Math.abs(balance);
            balanceType = 'CR';
          }
        }
      } else { // If entry is credit, this is debit
        debit = entry.amount;
        
        if (balanceType === 'DR') {
          balance += debit;
        } else {
          balance -= debit;
          if (balance < 0) {
            balance = Math.abs(balance);
            balanceType = 'DR';
          }
        }
      }
    }
    
    ledger.push({
      date: entry.date,
      reference: entry.reference,
      narration: entry.narration,
      debit,
      credit,
      balance,
      balanceType,
      transactionId: entry.transactionId,
      transactionType: entry.transactionType
    });
  });
  
  // Cache the result
  if (ledgerCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry if cache is full
    const firstKey = ledgerCache.keys().next().value;
    ledgerCache.delete(firstKey);
  }
  ledgerCache.set(accountId, ledger);
  
  return ledger;
};

// Get cash book entries
export const getCashBookEntries = (startDate?: string, endDate?: string): LedgerEntry[] => {
  return getAccountLedger('acc-cash').filter(entry => {
    if (!startDate && !endDate) return true;
    
    const entryDate = new Date(entry.date);
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the full end day
      return entryDate >= start && entryDate <= end;
    }
    
    if (startDate) {
      const start = new Date(startDate);
      return entryDate >= start;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the full end day
      return entryDate <= end;
    }
    
    return true;
  });
};

// Get all accounts with balances for dashboard summary
export const getAllAccountBalances = (): Record<string, AccountBalance> => {
  const accounts = getAccounts().filter(a => !a.isDeleted);
  const balances: Record<string, AccountBalance> = {};
  
  accounts.forEach(account => {
    balances[account.id] = calculateAccountBalance(account.id);
  });
  
  return balances;
};

// Get total receivables (customers)
export const getTotalReceivables = (): { total: number, accounts: AccountBalance[] } => {
  const accounts = getAccounts().filter(a => a.type === 'customer' && !a.isDeleted);
  let total = 0;
  const accountBalances: AccountBalance[] = [];
  
  accounts.forEach(account => {
    const balance = calculateAccountBalance(account.id);
    if (balance.balanceType === 'DR') {
      total += balance.balance;
      accountBalances.push(balance);
    }
  });
  
  return { total, accounts: accountBalances };
};

// Get total payables (suppliers, agents, transporters, brokers)
export const getTotalPayables = (): { total: number, accounts: AccountBalance[] } => {
  const accounts = getAccounts().filter(a => 
    (a.type === 'supplier' || a.type === 'agent' || 
     a.type === 'transporter' || a.type === 'broker') && 
    !a.isDeleted
  );
  
  let total = 0;
  const accountBalances: AccountBalance[] = [];
  
  accounts.forEach(account => {
    const balance = calculateAccountBalance(account.id);
    if (balance.balanceType === 'CR') {
      total += balance.balance;
      accountBalances.push(balance);
    }
  });
  
  return { total, accounts: accountBalances };
};

// Get today's cash transactions
export const getTodayCashTransactions = (): { cashIn: number, cashOut: number } => {
  const today = new Date().toISOString().split('T')[0];
  const entries = getCashBookEntries(today, today);
  
  let cashIn = 0;
  let cashOut = 0;
  
  entries.forEach(entry => {
    if (entry.debit > 0) cashIn += entry.debit;
    if (entry.credit > 0) cashOut += entry.credit;
  });
  
  return { cashIn, cashOut };
};

// Get total stock value
export const getTotalStockValue = (): number => {
  const inventory = getInventory().filter(item => !item.isDeleted);
  return inventory.reduce((total, item) => {
    return total + (item.finalCost * item.remainingQuantity);
  }, 0);
};

// Initialize accounting data
export const initializeAccounting = debounce((): void => {
  initializeSystemAccounts();
  refreshAccountingData();
}, 300);
