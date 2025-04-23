import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Eye, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getParties } from "@/services/ledgerService";
import { Sale, Purchase, Payment, Receipt } from "@/services/types";
import { optimizedStorage } from "@/services/core/storage-core";

interface Transaction {
  type: string;
  date: string;
  description: string;
  amount: number;
  reference?: string;
  balance?: number;
  id: string;
}

const PartyLedger: React.FC = () => {
  const { partyId, partyType } = useParams<{ partyId: string; partyType: string; }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [parties, setParties] = useState<any[]>([]);

  useEffect(() => {
    const loadParties = () => {
      const partiesData = getParties();
      setParties(partiesData);
    };

    loadParties();
  }, []);

  useEffect(() => {
    if (partyId) {
      const sales = optimizedStorage.get<Sale[]>('sales') || [];
      const purchases = optimizedStorage.get<Purchase[]>('purchases') || [];
      const payments = optimizedStorage.get<Payment[]>('payments') || [];
      const receipts = optimizedStorage.get<Receipt[]>('receipts') || [];
      
      const partySales = sales.filter(
        (sale) => !sale.isDeleted && 
        ((partyType === 'customer' && sale.customerId === partyId) || 
         (partyType === 'broker' && sale.brokerId === partyId))
      );
      
      const partyPurchases = purchases.filter(
        (purchase) => !purchase.isDeleted && 
        ((partyType === 'supplier' && purchase.partyId === partyId) || 
         (partyType === 'broker' && purchase.brokerId === partyId) ||
         (partyType === 'agent' && purchase.agentId === partyId))
      );
      
      const partyPayments = payments.filter(
        (payment) => !payment.isDeleted && payment.partyId === partyId
      );
      
      const partyReceipts = receipts.filter(
        (receipt) => !receipt.isDeleted && receipt.partyId === partyId
      );
      
      const allTransactions = [
        ...partySales.map(sale => ({
          type: 'sale',
          date: sale.date,
          description: `Sale - ${sale.lotNumber}`,
          amount: sale.totalAmount || 0,
          reference: sale.billNumber,
          id: sale.id
        })),
        ...partyPurchases.map(purchase => ({
          type: 'purchase',
          date: purchase.date,
          description: `Purchase - ${purchase.lotNumber}`,
          amount: purchase.totalAmount || 0,
          reference: purchase.billNumber,
          id: purchase.id
        })),
        ...partyPayments.map(payment => ({
          type: 'payment',
          date: payment.date,
          description: `Payment - ${payment.paymentNumber}`,
          amount: -payment.amount,
          reference: payment.reference,
          id: payment.id
        })),
        ...partyReceipts.map(receipt => ({
          type: 'receipt',
          date: receipt.date,
          description: `Receipt - ${receipt.receiptNumber}`,
          amount: -receipt.amount,
          reference: receipt.reference,
          id: receipt.id
        }))
      ];
      
      allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let balance = 0;
      const transactionsWithBalance = allTransactions.map(transaction => {
        balance += transaction.amount;
        return { ...transaction, balance };
      });
      
      setTransactions(transactionsWithBalance);
      setLoading(false);
    }
  }, [partyId, partyType]);

  const partyName = parties.find(party => party.id === partyId)?.name || 'Unknown Party';

  const confirmDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return;

    // Optimistic update
    const transactionIdToDelete = transactionToDelete.id;
    const transactionTypeToDelete = transactionToDelete.type;

    // Filter out the transaction to be deleted
    const updatedTransactions = transactions.filter(t => t.id !== transactionIdToDelete);
    setTransactions(updatedTransactions);
    setShowDeleteConfirm(false);

    // Perform deletion based on transaction type
    switch (transactionTypeToDelete) {
      case 'sale':
        // Delete sale
        const sales = optimizedStorage.get<Sale[]>('sales') || [];
        const updatedSales = sales.map(sale =>
          sale.id === transactionIdToDelete ? { ...sale, isDeleted: true } : sale
        );
        optimizedStorage.set('sales', updatedSales);
        break;
      case 'purchase':
        // Delete purchase
        const purchases = optimizedStorage.get<Purchase[]>('purchases') || [];
        const updatedPurchases = purchases.map(purchase =>
          purchase.id === transactionIdToDelete ? { ...purchase, isDeleted: true } : purchase
        );
        optimizedStorage.set('purchases', updatedPurchases);
        break;
      case 'payment':
        // Delete payment
        const payments = optimizedStorage.get<Payment[]>('payments') || [];
        const updatedPayments = payments.map(payment =>
          payment.id === transactionIdToDelete ? { ...payment, isDeleted: true } : payment
        );
        optimizedStorage.set('payments', updatedPayments);
        break;
      case 'receipt':
        // Delete receipt
        const receipts = optimizedStorage.get<Receipt[]>('receipts') || [];
        const updatedReceipts = receipts.map(receipt =>
          receipt.id === transactionIdToDelete ? { ...receipt, isDeleted: true } : receipt
        );
        optimizedStorage.set('receipts', updatedReceipts);
        break;
      default:
        console.warn('Unknown transaction type for deletion:', transactionTypeToDelete);
        break;
    }

    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white shadow rounded-md p-4">
          <h1 className="text-2xl font-bold mb-2">{partyName} Ledger</h1>
          <p className="text-gray-600 mb-4">
            {partyType ? `Type: ${partyType}` : 'No party type specified'}
          </p>

          <div className="mb-4">
            <Button variant="outline" onClick={() => navigate(`/master/${partyType}s`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit {partyType}
            </Button>
            <Button variant="default" className="ml-2" onClick={() => navigate(`/${partyType === 'customer' ? 'sales' : 'purchases'}/add`)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {partyType === 'customer' ? 'Sale' : 'Purchase'}
            </Button>
          </div>

          <ScrollArea className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No transactions found.</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell className="text-right">{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{transaction.balance?.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  View detailed information about this transaction.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="col-span-1 font-semibold">Type:</div>
                                  <div className="col-span-3">{transaction.type}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="col-span-1 font-semibold">Date:</div>
                                  <div className="col-span-3">{format(new Date(transaction.date), 'dd/MM/yyyy')}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="col-span-1 font-semibold">Description:</div>
                                  <div className="col-span-3">{transaction.description}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="col-span-1 font-semibold">Amount:</div>
                                  <div className="col-span-3">{transaction.amount.toFixed(2)}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="col-span-1 font-semibold">Reference:</div>
                                  <div className="col-span-3">{transaction.reference || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="col-span-1 font-semibold">Balance:</div>
                                  <div className="col-span-3">{transaction.balance?.toFixed(2)}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (transaction.type === 'sale') {
                              navigate(`/sales/edit/${transaction.id}`);
                            } else if (transaction.type === 'purchase') {
                              navigate(`/purchases/edit/${transaction.id}`);
                            } else if (transaction.type === 'payment') {
                              navigate(`/payments/edit/${transaction.id}`);
                            } else if (transaction.type === 'receipt') {
                              navigate(`/receipts/edit/${transaction.id}`);
                            }
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => confirmDeleteTransaction(transaction)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete this transaction?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PartyLedger;
