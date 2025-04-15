
export type AccountType = 'agent' | 'customer' | 'supplier' | 'broker' | 'transporter' | 'cash' | 'bank' | 'stock';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  openingBalance: number;
  openingBalanceType: 'debit' | 'credit';
  isDeleted?: boolean;
  isSystemAccount?: boolean;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  date: string;
  reference: string;
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
  paymentMode: 'cash' | 'bank';
  category: string;
  reference?: string;
  partyId?: string;
  partyName?: string;
}
