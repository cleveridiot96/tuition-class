
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { RefreshCcw, Plus, Search } from "lucide-react";
import { 
  getLedgerEntries,
  addCashbookEntry,
  LedgerEntry
} from "@/services/storageService";

const CashBook = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [viewMode, setViewMode] = useState<"day" | "all">("all");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    type: "debit",
    amount: 0,
  });
  
  useEffect(() => {
    loadCashEntries();
  }, [selectedDate, viewMode]);
  
  const loadCashEntries = () => {
    try {
      // Get all ledger entries
      const allEntries = getLedgerEntries();
      
      // Filter for cash entries
      let cashEntries = allEntries.filter(entry => entry.partyType === "cash");
      
      if (viewMode === "day") {
        // Filter for entries on the selected date
        const startDate = startOfDay(parseISO(selectedDate));
        const endDate = endOfDay(parseISO(selectedDate));
        
        cashEntries = cashEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return isWithinInterval(entryDate, { start: startDate, end: endDate });
        });
      }

      // Sort entries by date
      cashEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calculate running balance
      let runningBalance = 0;
      const entriesWithBalance = cashEntries.map(entry => {
        runningBalance += entry.credit - entry.debit;
        return { ...entry, balance: runningBalance };
      });
      
      setEntries(entriesWithBalance);
      
      // Set current balance
      // For the overall balance, we need to calculate from all entries regardless of view mode
      const allCashEntries = allEntries.filter(entry => entry.partyType === "cash");
      const overallBalance = allCashEntries.reduce((bal, entry) => bal + (entry.credit - entry.debit), 0);
      setCurrentBalance(overallBalance);
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

  // Calculate daily totals
  const getDayTotals = () => {
    const debitTotal = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const creditTotal = entries.reduce((sum, entry) => sum + entry.credit, 0);
    return { debitTotal, creditTotal };
  };

  const { debitTotal, creditTotal } = getDayTotals();

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
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setViewMode(value as "day" | "all")}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="day">Daily View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day" className="space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="date-select">Select Date:</Label>
                <Input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
                <Button variant="outline" size="sm" onClick={() => loadCashEntries()}>
                  <Search size={16} className="mr-2" />
                  View
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card className="p-4">
          {/* T-Account Style Cashbook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Debit Side */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 font-bold text-center border-b">
                DEBIT (Payments Made)
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Particulars</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.filter(entry => entry.debit > 0).length > 0 ? (
                      entries
                        .filter(entry => entry.debit > 0)
                        .map((entry) => (
                          <TableRow key={`debit-${entry.id}`} className="hover:bg-gray-50">
                            <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(entry.debit).replace('₹', '')}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No debit entries found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableCaption>
                    <div className="flex justify-between font-bold p-2">
                      <span>Total</span>
                      <span>{formatCurrency(debitTotal).replace('₹', '')}</span>
                    </div>
                  </TableCaption>
                </Table>
              </div>
            </div>
            
            {/* Credit Side */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 font-bold text-center border-b">
                CREDIT (Payments Received)
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Particulars</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.filter(entry => entry.credit > 0).length > 0 ? (
                      entries
                        .filter(entry => entry.credit > 0)
                        .map((entry) => (
                          <TableRow key={`credit-${entry.id}`} className="hover:bg-gray-50">
                            <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(entry.credit).replace('₹', '')}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No credit entries found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableCaption>
                    <div className="flex justify-between font-bold p-2">
                      <span>Total</span>
                      <span>{formatCurrency(creditTotal).replace('₹', '')}</span>
                    </div>
                  </TableCaption>
                </Table>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Balance:</span>
              <span className={`text-lg font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(currentBalance))} {currentBalance >= 0 ? 'Cr' : 'Dr'}
              </span>
            </div>
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
                <option value="debit">Debit (Payment Made)</option>
                <option value="credit">Credit (Payment Received)</option>
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
