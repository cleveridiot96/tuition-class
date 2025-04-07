
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, Edit, Trash } from "lucide-react";
import { getCashBookEntries, addCashBookEntry, updateCashBookEntry, deleteCashBookEntry } from "@/services/storageService";

const CashBook = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    type: "debit", // debit = outflow, credit = inflow
    amount: "",
  });
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Load entries
  useEffect(() => {
    loadEntries();
  }, []);

  // Filter entries based on selected date
  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const filtered = entries.filter(entry => entry.date === dateStr);
    setFilteredEntries(filtered);
    
    // Calculate totals
    const debitTotal = filtered
      .filter(entry => entry.type === "debit")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    
    const creditTotal = filtered
      .filter(entry => entry.type === "credit")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    
    setTotalDebit(debitTotal);
    setTotalCredit(creditTotal);
  }, [selectedDate, entries]);

  const loadEntries = () => {
    const loadedEntries = getCashBookEntries() || [];
    setEntries(loadedEntries);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setNewEntry(prev => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.description || !newEntry.amount) {
      return;
    }
    
    if (editingEntry) {
      // Update existing entry
      updateCashBookEntry({
        ...editingEntry,
        description: newEntry.description,
        type: newEntry.type,
        amount: Number(newEntry.amount)
      });
      setEditingEntry(null);
    } else {
      // Add new entry
      addCashBookEntry({
        id: Date.now().toString(),
        date: newEntry.date,
        description: newEntry.description,
        type: newEntry.type,
        amount: Number(newEntry.amount)
      });
    }
    
    // Reset form and reload entries
    setNewEntry({
      date: format(selectedDate, "yyyy-MM-dd"),
      description: "",
      type: "debit",
      amount: "",
    });
    loadEntries();
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setNewEntry({
      date: entry.date,
      description: entry.description,
      type: entry.type,
      amount: entry.amount.toString(),
    });
  };

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteCashBookEntry(entryToDelete);
      loadEntries();
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setNewEntry({
      date: format(selectedDate, "yyyy-MM-dd"),
      description: "",
      type: "debit",
      amount: "",
    });
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Cash Book" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">Cash Book</h2>
              
              <div className="flex items-center space-x-2">
                <span>Date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[180px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "dd MMMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md bg-ag-beige-light">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    name="description"
                    value={newEntry.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    name="type"
                    value={newEntry.type}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="debit">Expense (Debit)</option>
                    <option value="credit">Income (Credit)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                  <Input
                    name="amount"
                    type="number"
                    value={newEntry.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingEntry ? "Update Entry" : "Add Entry"}
                  </Button>
                  {editingEntry && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px] text-right">Debit (₹)</TableHead>
                    <TableHead className="w-[150px] text-right">Credit (₹)</TableHead>
                    <TableHead className="w-[100px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        No entries for this date
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-right">
                          {entry.type === "debit" ? entry.amount.toLocaleString() : ""}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.type === "credit" ? entry.amount.toLocaleString() : ""}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditEntry(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(entry.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                  {/* Totals row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{totalDebit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{totalCredit.toLocaleString()}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  
                  {/* Balance row */}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={2} className="font-bold">Balance</TableCell>
                    <TableCell colSpan={2} className={`text-right font-bold ${totalCredit - totalDebit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(totalCredit - totalDebit).toLocaleString()} 
                      {totalCredit - totalDebit >= 0 ? ' (Surplus)' : ' (Deficit)'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CashBook;
