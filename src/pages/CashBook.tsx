
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import Navigation from "@/components/Navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Printer, Download, RefreshCw, Search, Plus, FileSpreadsheet } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import ManualExpenseForm from "@/components/ManualExpenseForm";

import { getCashBookEntries, initializeAccounting, getTodayCashTransactions } from "@/services/accountingService";
import { formatCurrency, formatDate, formatBalance } from "@/utils/helpers";

const CashBook = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [todaySummary, setTodaySummary] = useState({ cashIn: 0, cashOut: 0 });
  const printRef = useRef(null);

  useEffect(() => {
    loadCashbookData();
  }, []);

  const loadCashbookData = () => {
    setIsLoading(true);
    
    try {
      initializeAccounting();
      
      const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
      
      const cashbookEntries = getCashBookEntries(formattedStartDate, formattedEndDate);
      setEntries(cashbookEntries);
      
      // Get today's summary
      const { cashIn, cashOut } = getTodayCashTransactions();
      setTodaySummary({ cashIn, cashOut });
      
      console.log("Cashbook entries loaded:", cashbookEntries.length);
    } catch (error) {
      console.error("Error loading cashbook data:", error);
      toast({
        title: "Error",
        description: "Failed to load cashbook data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = () => {
    loadCashbookData();
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    
    setTimeout(() => {
      loadCashbookData();
    }, 0);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Cashbook",
    onAfterPrint: () => {
      toast({
        title: "Print successful",
        description: "Cashbook has been sent to printer",
      });
    },
  });

  const handleExportToExcel = () => {
    try {
      // Prepare data for Excel export
      const excelData = entries.map(entry => ({
        Date: formatDate(entry.date),
        Reference: entry.reference,
        Description: entry.narration,
        Debit: entry.debit > 0 ? entry.debit : '',
        Credit: entry.credit > 0 ? entry.credit : '',
        Balance: entry.balance,
        'Balance Type': entry.balanceType
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Cashbook");
      
      // Generate file name with date
      const fileName = `Cashbook_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      
      // Save workbook
      XLSX.writeFile(wb, fileName);
      
      toast({
        title: "Export completed",
        description: "Cashbook data has been exported to Excel",
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

  const calculateOpeningBalance = () => {
    if (entries.length === 0) return 0;
    
    // Find first entry and get its balance before transactions
    const firstEntry = entries[0];
    
    // Special case for opening balance entry
    if (firstEntry.reference === 'Opening Balance') {
      return 0; // The opening balance is already reflected in the first entry
    }
    
    let openingBalance = firstEntry.balance;
    
    // Adjust for the first transaction
    if (firstEntry.debit > 0) {
      openingBalance -= firstEntry.debit;
    } else if (firstEntry.credit > 0) {
      openingBalance += firstEntry.credit;
    }
    
    return openingBalance;
  };

  const calculateClosingBalance = () => {
    if (entries.length === 0) return 0;
    return entries[entries.length - 1].balance;
  };

  const handleManualExpenseAdded = () => {
    setExpenseDialogOpen(false);
    loadCashbookData();
    
    toast({
      title: "Success",
      description: "Manual expense has been added to cashbook",
    });
  };

  const openingBalance = calculateOpeningBalance();
  const closingBalance = calculateClosingBalance();
  const lastBalanceType = entries.length > 0 ? entries[entries.length - 1].balanceType : 'DR';

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Cash Book" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <CardTitle>Cash Book</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your cash transactions and expenses
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadCashbookData}
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin mr-2" : "mr-2"} />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                >
                  <Printer size={16} className="mr-2" />
                  Print
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportToExcel}
                >
                  <FileSpreadsheet size={16} className="mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={() => setExpenseDialogOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Expense
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Today's Cash In</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(todaySummary.cashIn)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Today's Cash Out</div>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(todaySummary.cashOut)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Net Balance</div>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(todaySummary.cashIn - todaySummary.cashOut)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Cash Balance</div>
                    <div className="text-2xl font-bold text-purple-600">{formatBalance(closingBalance, lastBalanceType)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker
                  id="startDate"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  id="endDate"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="w-full"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilterChange} className="flex-grow">
                  <Search size={16} className="mr-2" />
                  Filter
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden" ref={printRef}>
              <div className="bg-gray-50 p-4 text-center border-b print-header">
                <h2 className="text-xl font-bold">Cash Book</h2>
                <p className="text-gray-600">
                  {startDate ? format(startDate, 'dd/MM/yyyy') : 'All time'} to {endDate ? format(endDate, 'dd/MM/yyyy') : 'present'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 border-b bg-gray-50">
                <div>
                  <div className="text-sm font-medium">Opening Balance:</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(openingBalance)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Closing Balance:</div>
                  <div className="text-lg font-bold">
                    {formatBalance(closingBalance, lastBalanceType)}
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-500px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Narration</TableHead>
                      <TableHead className="text-right">Debit (₹)</TableHead>
                      <TableHead className="text-right">Credit (₹)</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No cash entries found for the selected period.
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry, index) => (
                        <TableRow key={`${entry.transactionId}-${index}`} className={
                          entry.reference === 'Opening Balance' ? 'bg-gray-50' :
                          entry.debit > 0 ? 'bg-green-50' : 'bg-red-50'
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
                            {formatBalance(entry.balance, entry.balanceType)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              <div className="bg-gray-50 p-4 border-t flex justify-between">
                <div>
                  <span className="font-medium">Total Entries:</span> {entries.length}
                </div>
                <div>
                  <span className="font-medium">Closing Balance:</span> {formatBalance(closingBalance, lastBalanceType)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Manual Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Manual Expense</DialogTitle>
            <DialogDescription>
              Record a cash expense or withdrawal for your business.
            </DialogDescription>
          </DialogHeader>
          <ManualExpenseForm 
            onSubmit={handleManualExpenseAdded}
            onCancel={() => setExpenseDialogOpen(false)}
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
        }
      `}</style>
    </div>
  );
};

export default CashBook;
