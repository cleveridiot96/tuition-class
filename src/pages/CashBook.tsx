
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { RefreshCcw, Plus } from "lucide-react";
import { 
  getLedgerEntries,
  addCashbookEntry,
  LedgerEntry
} from "@/services/storageService";

const CashBook = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    type: "debit",
    amount: 0,
  });
  
  useEffect(() => {
    loadCashEntries();
  }, []);
  
  const loadCashEntries = () => {
    try {
      // Get all ledger entries
      const allEntries = getLedgerEntries();
      
      // Filter for cash entries
      const cashEntries = allEntries.filter(entry => entry.partyType === "cash");
      
      // Calculate running balance
      let runningBalance = 0;
      const entriesWithBalance = cashEntries.map(entry => {
        runningBalance += entry.credit - entry.debit;
        return { ...entry, balance: runningBalance };
      });
      
      setEntries(entriesWithBalance);
      
      // Set current balance
      if (entriesWithBalance.length > 0) {
        setCurrentBalance(entriesWithBalance[entriesWithBalance.length - 1].balance);
      } else {
        setCurrentBalance(0);
      }
    } catch (error) {
      console.error("Error loading cash entries:", error);
      toast({
        title: "Error",
        description: "Failed to load cash book entries",
        variant: "destructive"
      });
    }
  };
  
  const handleRefresh = () => {
    loadCashEntries();
    toast({
      title: "Refreshed",
      description: "Cash book entries have been refreshed"
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = () => {
    if (!formData.description || formData.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const debitAmount = formData.type === "debit" ? formData.amount : 0;
      const creditAmount = formData.type === "credit" ? formData.amount : 0;
      
      addCashbookEntry(
        formData.date,
        formData.description,
        debitAmount,
        creditAmount
      );
      
      loadCashEntries();
      
      toast({
        title: "Entry Added",
        description: `Cash book entry for ${formatCurrency(formData.amount)} has been added`
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding entry:", error);
      toast({
        title: "Error",
        description: "Failed to add cash book entry",
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      type: "debit",
      amount: 0,
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Cash Book" showBackButton showHomeButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cash Book</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCcw size={20} />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Entry
            </Button>
          </div>
        </div>
        
        <Card className="p-4 mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Current Cash Balance</h3>
          </div>
          <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(currentBalance))}
            <span className="ml-2 text-sm">{currentBalance >= 0 ? 'Cr' : 'Dr'}</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="text-right">Debit (Dr)</TableHead>
                  <TableHead className="text-right">Credit (Cr)</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right font-medium">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(entry.balance))}
                        <span className="ml-1 text-xs">{entry.balance >= 0 ? 'Cr' : 'Dr'}</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No entries found in cash book
                    </TableCell>
                  </TableRow>
                )}
                
                {entries.length > 0 && (
                  <TableRow className="font-bold border-t-2">
                    <TableCell colSpan={2} className="text-right">Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(entries.reduce((sum, entry) => sum + entry.debit, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(entries.reduce((sum, entry) => sum + entry.credit, 0))}
                    </TableCell>
                    <TableCell className={`text-right ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(currentBalance))}
                      <span className="ml-1 text-xs">{currentBalance >= 0 ? 'Cr' : 'Dr'}</span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      {/* Add Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cash Book Entry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter transaction description"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select 
                id="type" 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange}
                className="col-span-3 w-full p-2 border rounded-md"
              >
                <option value="debit">Debit (Dr)</option>
                <option value="credit">Credit (Cr)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                value={formData.amount || ''} 
                onChange={handleInputChange}
                className="col-span-3"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashBook;
