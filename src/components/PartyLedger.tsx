
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AccountOpeningBalance from './AccountOpeningBalance';

import { 
  getAccountById, 
  getAccountLedger,
  Account, 
  LedgerEntry
} from '@/services/accountingService';
import { formatDate, formatBalance, formatCurrency } from '@/utils/helpers';

interface PartyLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

const PartyLedger = ({ isOpen, onClose, accountId }: PartyLedgerProps) => {
  const { toast } = useToast();
  const [account, setAccount] = useState<Account | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
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

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Ledger - ${account?.name || 'Party'}`,
    onAfterPrint: () => {
      toast({
        title: 'Print Successful',
        description: 'Ledger has been sent to printer',
      });
    },
  });

  const handleExportToExcel = () => {
    try {
      if (!account) return;
      
      // Prepare data for Excel export
      const excelData = ledger.map(entry => ({
        Date: formatDate(entry.date),
        Reference: entry.reference,
        Narration: entry.narration,
        Debit: entry.debit > 0 ? entry.debit : '',
        Credit: entry.credit > 0 ? entry.credit : '',
        Balance: entry.balance
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, `${account.name} Ledger`);
      
      // Generate filename with date
      const fileName = `Ledger_${account.name}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      
      // Save workbook
      XLSX.writeFile(wb, fileName);
      
      toast({
        title: "Export completed",
        description: "Ledger data has been exported to Excel",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to Excel",
        variant: "destructive"
      });
    }
  };

  const handleOpeningBalanceSave = () => {
    setIsOpeningBalanceDialogOpen(false);
    
    // Refresh ledger data
    if (accountId) {
      const accountData = getAccountById(accountId);
      if (accountData) {
        setAccount(accountData);
        const ledgerData = getAccountLedger(accountId);
        setLedger(ledgerData);
      }
    }
    
    toast({
      title: 'Opening Balance Updated',
      description: 'Party opening balance has been updated successfully',
    });
  };

  const openingBalance = ledger.length > 0 && ledger[0].reference === 'Opening Balance'
    ? ledger[0]
    : null;

  // Filter out opening balance from the main list if it exists
  const transactionEntries = openingBalance
    ? ledger.filter(entry => entry.reference !== 'Opening Balance')
    : ledger;

  const closingBalance = ledger.length > 0
    ? ledger[ledger.length - 1]
    : null;

  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-lg font-bold">
              {account?.name} Ledger
            </DrawerTitle>
            <DrawerDescription>
              Account Type: {account?.type}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4" ref={printRef}>
            <div className="print-header text-center mb-4 hidden">
              <h2 className="text-2xl font-bold">{account?.name} Ledger</h2>
              <p className="text-gray-600">Account Type: {account?.type}</p>
              <p className="text-gray-600">Financial Year: {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
            </div>
            
            <div className="flex justify-between mb-4 print:hidden">
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => setIsOpeningBalanceDialogOpen(true)}
                  variant="outline"
                >
                  Set Opening Balance
                </Button>
              </div>
              
              <div className="text-right">
                {account?.openingBalance ? (
                  <div className="text-sm">
                    Initial Opening Balance: 
                    <span className="font-medium ml-1">
                      {formatCurrency(account.openingBalance)} {account.openingBalanceType === 'debit' ? 'DR' : 'CR'}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
            
            {openingBalance && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md border print:bg-white print:border-0">
                <strong>Opening Balance:</strong> {formatCurrency(openingBalance.balance)}
              </div>
            )}
            
            <ScrollArea className="h-[calc(90vh-240px)] print:h-auto">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Reference</TableHead>
                      <TableHead>Narration</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Debit (₹)</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Credit (₹)</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No transactions found for this account.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactionEntries.map((entry, index) => (
                        <TableRow key={index} className={
                          entry.debit > 0 ? 'bg-green-50 print:bg-white' : 'bg-red-50 print:bg-white'
                        }>
                          <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.reference}</TableCell>
                          <TableCell>{entry.narration}</TableCell>
                          <TableCell className="text-right">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(entry.balance)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
            
            {closingBalance && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border print:bg-white print:border-0">
                <strong>Closing Balance:</strong> {formatCurrency(closingBalance.balance)}
              </div>
            )}
          </div>
          
          <DrawerFooter className="border-t print:hidden">
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer size={16} />
                  Print Ledger
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportToExcel}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet size={16} />
                  Export to Excel
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Opening Balance Dialog */}
      <Dialog open={isOpeningBalanceDialogOpen} onOpenChange={setIsOpeningBalanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Opening Balance for {account?.name}</DialogTitle>
          </DialogHeader>
          <AccountOpeningBalance 
            accountId={accountId}
            onSaved={handleOpeningBalanceSave}
            onCancel={() => setIsOpeningBalanceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-header {
            display: block !important;
          }
          #printRef, #printRef * {
            visibility: visible;
          }
          #printRef {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .text-red-600, .text-green-600 {
            color: black !important;
          }
        }
      `}</style>
    </>
  );
};

export default PartyLedger;
