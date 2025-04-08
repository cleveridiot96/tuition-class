
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
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
import { Printer, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  getAccountById, 
  getAccountLedger,
  Account, 
  LedgerEntry
} from '@/services/accountingService';
import { formatDate, formatBalance } from '@/utils/helpers';

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
          </div>
          
          {openingBalance && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border">
              <strong>Opening Balance:</strong> {formatBalance(openingBalance.balance, openingBalance.balanceType)}
            </div>
          )}
          
          <ScrollArea className="h-[calc(90vh-240px)]">
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
                      <TableRow key={index}>
                        <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                        <TableCell>{entry.reference}</TableCell>
                        <TableCell>{entry.narration}</TableCell>
                        <TableCell className="text-right">
                          {entry.debit > 0 ? new Intl.NumberFormat('en-IN').format(entry.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.credit > 0 ? new Intl.NumberFormat('en-IN').format(entry.credit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatBalance(entry.balance, entry.balanceType)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          
          {closingBalance && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border">
              <strong>Closing Balance:</strong> {formatBalance(closingBalance.balance, closingBalance.balanceType)}
            </div>
          )}
        </div>
        
        <DrawerFooter className="border-t">
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer size={16} />
              Print Ledger
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
      
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
        }
      `}</style>
    </Drawer>
  );
};

export default PartyLedger;
