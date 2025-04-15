import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Filter, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const mockExpenses = [
  {
    id: "exp-1",
    date: "2023-11-01",
    category: "Maintenance",
    amount: 2500,
    description: "Equipment repair",
    paymentMode: "Cash"
  },
  {
    id: "exp-2",
    date: "2023-11-05",
    category: "Utilities",
    amount: 1800,
    description: "Electricity bill",
    paymentMode: "Bank Transfer"
  },
  {
    id: "exp-3",
    date: "2023-11-12",
    category: "Fuel",
    amount: 3000,
    description: "Diesel for generator",
    paymentMode: "Cash"
  },
  {
    id: "exp-4",
    date: "2023-11-18",
    category: "Office",
    amount: 1200,
    description: "Stationery",
    paymentMode: "Cash"
  },
  {
    id: "exp-5",
    date: "2023-11-25",
    category: "Travel",
    amount: 4500,
    description: "Field visit expenses",
    paymentMode: "Bank Transfer"
  }
];

const ExpensesPage = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(mockExpenses);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Expenses loaded");
  }, []);

  const filterExpenses = () => {
    let filtered = [...mockExpenses];
    
    if (fromDate) {
      filtered = filtered.filter(exp => new Date(exp.date) >= fromDate);
    }
    
    if (toDate) {
      filtered = filtered.filter(exp => new Date(exp.date) <= toDate);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(exp => exp.category === categoryFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.description.toLowerCase().includes(term) || 
        exp.category.toLowerCase().includes(term)
      );
    }
    
    setExpenses(filtered);
    
    toast({
      title: "Filters Applied",
      description: `Showing ${filtered.length} expense records`
    });
  };

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setCategoryFilter("");
    setSearchTerm("");
    setExpenses(mockExpenses);
    
    toast({
      title: "Filters Reset",
      description: "Showing all expense records"
    });
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const handleAddExpense = () => {
    setIsAddDialogOpen(true);
    
    toast({
      title: "Add Expense",
      description: "Expense form will be implemented soon"
    });
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="खर्च (Expenses)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl flex items-center">
              Expense Management
            </CardTitle>
            <Button onClick={handleAddExpense} className="flex items-center gap-1">
              <PlusCircle size={18} />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
              <div className="lg:col-span-2">
                <DatePicker
                  date={fromDate}
                  setDate={setFromDate}
                  className="w-full"
                />
              </div>
              <div className="lg:col-span-2">
                <DatePicker
                  date={toDate}
                  setDate={setToDate}
                  className="w-full"
                />
              </div>
              <div className="lg:col-span-1">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Fuel">Fuel</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="flex gap-2">
                <Button onClick={filterExpenses} className="flex items-center gap-1">
                  <Filter size={16} />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
                  <RefreshCw size={16} />
                  Reset
                </Button>
              </div>
              <div className="flex-1 max-w-xs">
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.paymentMode}</TableCell>
                      <TableCell className="text-right font-semibold">₹{expense.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Expenses:</span>
                <span className="text-xl font-bold">₹{calculateTotal()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesPage;
