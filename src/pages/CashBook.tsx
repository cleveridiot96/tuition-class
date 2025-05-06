import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCashTransactions, addCashTransaction, deleteCashTransaction } from "@/services/cashService";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CashTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
}

const CashBook = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "income" as 'income' | 'expense',
    amount: "",
    description: "",
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const cashData = getCashTransactions();
    setTransactions(cashData);
    
    // Calculate balance
    const totalIncome = cashData
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const totalExpense = cashData
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    setBalance(totalIncome - totalExpense);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!newTransaction.description) {
      toast.error("Please enter a description");
      return;
    }

    const transaction: CashTransaction = {
      id: Date.now().toString(),
      date: newTransaction.date || format(new Date(), "yyyy-MM-dd"),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description
    };

    addCashTransaction(transaction);
    setIsAddDialogOpen(false);
    setNewTransaction({
      date: format(new Date(), "yyyy-MM-dd"),
      type: "income" as 'income' | 'expense',
      amount: "",
      description: "",
    });
    loadTransactions();
    toast.success("Transaction added successfully");
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteCashTransaction(id);
      loadTransactions();
      toast.success("Transaction deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <Navigation title="Cash Book" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200 shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-pink-800">Cash Book</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-md shadow-sm">
                <span className="text-sm text-gray-500">Current Balance:</span>
                <span className={`ml-2 font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{balance.toLocaleString()}
                </span>
              </div>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Plus size={16} className="mr-1" /> Add Transaction
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === "income" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.type === "income" ? "Income" : "Expense"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                            ₹{transaction.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value: 'income' | 'expense') => setNewTransaction({ ...newTransaction, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction} className="bg-pink-600 hover:bg-pink-700">
              Add Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashBook;
