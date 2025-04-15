
export interface Account {
  id: string;
  name: string;
  type: string;
  openingBalance: number;
  openingBalanceType: 'debit' | 'credit';
  isSystemAccount?: boolean;
  isDeleted?: boolean;
}

export interface LedgerEntry {
  id: string;
  date: string;
  accountId: string;
  reference: string;
  referenceId?: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: 'debit' | 'credit';
}

export interface ManualExpense {
  id: string;
  date: string;
  amount: number;
  description: string;
  category?: string;
  expenseAccount?: string;
  reference?: string;
  partyId?: string;
  partyName?: string;
  paymentMode?: 'cash' | 'bank';
}

export type AccountType = 'customer' | 'supplier' | 'agent' | 'broker' | 'transporter' | 'bank' | 'cash' | 'expense' | 'income' | 'asset' | 'liability' | 'equity' | 'other';
