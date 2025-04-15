
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AccountOpeningBalance from './AccountOpeningBalance';
import { LedgerTable } from './ledger/LedgerTable';
import { usePartyLedger } from '@/hooks/usePartyLedger';
import { formatCurrency } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

interface PartyLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

const PartyLedger = ({ isOpen, onClose, accountId }: PartyLedgerProps) => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const {
    account,
    transactionEntries,
    openingBalance,
    closingBalance,
    isOpeningBalanceDialogOpen,
    setIsOpeningBalanceDialogOpen,
    handleExportToExcel,
    handleOpeningBalanceSave
  } = usePartyLedger(accountId, isOpen);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Ledger - ${account?.name || 'Party'}`,
    onAfterPrint: () => {
      toast({
        description: 'Ledger has been sent to printer'
      });
    },
  });

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
            </div>
            
            <div className="flex justify-between mb-4">
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
              <div className="mb-4 p-3 bg-gray-50 rounded-md border">
                <strong>Opening Balance:</strong> {formatCurrency(openingBalance.balance)} {openingBalance.balanceType === 'debit' ? 'DR' : 'CR'}
              </div>
            )}
            
            <LedgerTable entries={transactionEntries} />
            
            {closingBalance && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                <strong>Closing Balance:</strong> {formatCurrency(closingBalance.balance)} {closingBalance.balanceType === 'debit' ? 'DR' : 'CR'}
              </div>
            )}
          </div>
          
          <DrawerFooter className="border-t">
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
    </>
  );
};

export default PartyLedger;
