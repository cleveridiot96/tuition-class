
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from 'react-to-print';
import Navigation from "@/components/Navigation";
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
import { Printer, Download, RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getCashBookEntries, initializeAccounting } from "@/services/accountingService";
import { formatCurrency, formatDate, formatBalance } from "@/utils/helpers";

const CashBook = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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
    // Mock export function - in reality you'd generate an Excel file
    toast({
      title: "Export initiated",
      description: "Cashbook data is being exported to Excel",
    });
    
    // Simulate delay for export
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Cashbook data has been exported to Excel",
      });
    }, 1500);
  };

  const calculateOpeningBalance = () => {
    if (entries.length === 0) return 0;
    
    // Find first entry and get its balance before transactions
    const firstEntry = entries[0];
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
    const lastEntry = entries[entries.length - 1];
    return lastEntry.balance;
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
            <div className="flex justify-between items-center">
              <CardTitle>Cash Book</CardTitle>
              <div className="flex gap-2">
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
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
              
              <ScrollArea className="h-[calc(100vh-360px)]">
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
                        <TableRow key={`${entry.transactionId}-${index}`}>
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
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-header {
            display: block !important;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
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
