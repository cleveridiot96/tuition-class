
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { Account, LedgerEntry } from '@/services/ledger/types';
import { getAccountById } from '@/services/ledger/accountService';
import { getAccountLedger } from '@/services/ledger/ledgerService';

export function usePartyLedger(accountId: string, isOpen: boolean) {
  const { toast } = useToast();
  const [account, setAccount] = useState<Account | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isOpeningBalanceDialogOpen, setIsOpeningBalanceDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen && accountId) {
      const accountData = getAccountById(accountId);
      if (accountData) {
        setAccount(accountData);
        const ledgerData = getAccountLedger(accountId);
        setLedger(ledgerData);
      }
    }
  }, [isOpen, accountId]);

  const handleExportToExcel = () => {
    try {
      if (!account) return;
      
      const excelData = ledger.map(entry => ({
        Date: format(new Date(entry.date), 'yyyy-MM-dd'),
        Reference: entry.reference,
        Narration: entry.narration,
        Debit: entry.debit > 0 ? entry.debit : '',
        Credit: entry.credit > 0 ? entry.credit : '',
        Balance: entry.balance,
        'Balance Type': entry.balanceType
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, `${account.name} Ledger`);
      const fileName = `Ledger_${account.name}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast({
        description: "Ledger data has been exported to Excel"
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        description: "There was an error exporting to Excel",
        variant: "destructive"
      });
    }
  };

  const handleOpeningBalanceSave = () => {
    setIsOpeningBalanceDialogOpen(false);
    
    if (accountId) {
      const accountData = getAccountById(accountId);
      if (accountData) {
        setAccount(accountData);
        const ledgerData = getAccountLedger(accountId);
        setLedger(ledgerData);
      }
    }
    
    toast({
      description: 'Party opening balance has been updated successfully'
    });
  };

  const openingBalance = ledger.length > 0 && ledger[0].reference === 'Opening Balance'
    ? ledger[0]
    : null;

  const transactionEntries = openingBalance
    ? ledger.filter(entry => entry.reference !== 'Opening Balance')
    : ledger;

  const closingBalance = ledger.length > 0
    ? ledger[ledger.length - 1]
    : null;

  return {
    account,
    ledger,
    openingBalance,
    transactionEntries,
    closingBalance,
    isOpeningBalanceDialogOpen,
    setIsOpeningBalanceDialogOpen,
    handleExportToExcel,
    handleOpeningBalanceSave
  };
}
