
import { v4 as uuidv4 } from 'uuid';
import { 
  getPurchases, 
  getSales, 
  getPayments, 
  getReceipts,
  getAgents,
  getBrokers,
  getCustomers,
  getTransporters,
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
  transactionType: 'purchase' | 'sale' | 'payment' | 'receipt' | 'commission' | 'opening' | 'other';
  isDeleted?: boolean;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
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

// Get all account entries
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
  } catch (error) {
    console.error('Error saving accounts:', error);
  }
};

// Add an account entry
export const addAccountEntry = (entry: AccountEntry): void => {
  const entries = getAccountEntries();
  entries.push({
    ...entry,
    id: entry.id || uuidv4()
  });
  saveAccountEntries(entries);
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
  return newAccount;
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
  const account = getAccountById(accountId);
  if (!account) {
    return {
      accountId,
      accountName: 'Unknown',
      debit: 0,
      credit: 0,
      balance: 0,
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
  
  // Calculate balance based on account type
  let balance = debit - credit;
  
  return {
    accountId,
    accountName: account.name,
    debit,
    credit,
    balance,
    transactionCount
  };
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
    { id: 'acc-expenses', name: 'Expenses', type: 'expense', isSystemAccount: true }
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
};

// Refresh accounting data from transactions
export const refreshAccountingData = (): void => {
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
            partyAccountId = '';
          }
        }
      }
    }
    
    // Payment entry: Dr. Party A/c, Cr. Cash/Bank A/c
    if (partyAccountId) {
      createDoubleEntry(
        payment.date,
        partyAccountId, // Debit Party Account
        payment.paymentMode === 'cash' ? 'acc-cash' : 'acc-bank', // Credit Cash or Bank Account
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
        receipt.paymentMode === 'cash' ? 'acc-cash' : 'acc-bank', // Debit Cash or Bank Account
        customerAccountId, // Credit Customer Account
        receipt.amount,
        receipt.reference || '',
        `Receipt from ${receipt.customerName || 'customer'}`,
        'receipt',
        receipt.id
      );
    }
  });
};

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
      return entryDate >= start && entryDate <= end;
    }
    
    if (startDate) {
      const start = new Date(startDate);
      return entryDate >= start;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      return entryDate <= end;
    }
    
    return true;
  });
};

// Initialize accounting data
export const initializeAccounting = (): void => {
  initializeSystemAccounts();
  refreshAccountingData();
};
