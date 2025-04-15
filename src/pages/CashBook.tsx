
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

// Import the newly created components
import CashBookHeader from "@/components/cashbook/CashBookHeader";
import CashBookSummary from "@/components/cashbook/CashBookSummary";
import CashBookFilters from "@/components/cashbook/CashBookFilters";
import CashBookTable from "@/components/cashbook/CashBookTable";
import TransactionButtons from "@/components/cashbook/TransactionButtons";
import TransactionDialogs from "@/components/cashbook/TransactionDialogs";
import PrintStyles from "@/components/cashbook/PrintStyles";

// Import services and utilities
import { getCashBookEntries, initializeAccounting, getTodayCashTransactions } from "@/services/accountingService";

const CashBook = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
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
        Date: entry.date,
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

  const handleBackupData = () => {
    try {
      // Get all necessary data
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
      const agents = JSON.parse(localStorage.getItem('agents') || '[]');
      const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const brokers = JSON.parse(localStorage.getItem('brokers') || '[]');
      const transporters = JSON.parse(localStorage.getItem('transporters') || '[]');
      const cashbookEntries = entries;
      
      // Create a single workbook with multiple sheets
      const wb = XLSX.utils.book_new();
      
      // Add each data set as its own sheet
      if (purchases.length > 0) {
        const ws = XLSX.utils.json_to_sheet(purchases);
        XLSX.utils.book_append_sheet(wb, ws, "Purchases");
      }
      
      if (sales.length > 0) {
        const ws = XLSX.utils.json_to_sheet(sales);
        XLSX.utils.book_append_sheet(wb, ws, "Sales");
      }
      
      if (inventory.length > 0) {
        const ws = XLSX.utils.json_to_sheet(inventory);
        XLSX.utils.book_append_sheet(wb, ws, "Inventory");
      }
      
      if (agents.length > 0) {
        const ws = XLSX.utils.json_to_sheet(agents);
        XLSX.utils.book_append_sheet(wb, ws, "Agents");
      }
      
      if (suppliers.length > 0) {
        const ws = XLSX.utils.json_to_sheet(suppliers);
        XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
      }
      
      if (customers.length > 0) {
        const ws = XLSX.utils.json_to_sheet(customers);
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
      }
      
      if (brokers.length > 0) {
        const ws = XLSX.utils.json_to_sheet(brokers);
        XLSX.utils.book_append_sheet(wb, ws, "Brokers");
      }
      
      if (transporters.length > 0) {
        const ws = XLSX.utils.json_to_sheet(transporters);
        XLSX.utils.book_append_sheet(wb, ws, "Transporters");
      }
      
      if (cashbookEntries.length > 0) {
        const ws = XLSX.utils.json_to_sheet(cashbookEntries);
        XLSX.utils.book_append_sheet(wb, ws, "CashBook");
      }
      
      // Generate file name with date
      const fileName = `ERP_Backup_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      
      // Save workbook
      XLSX.writeFile(wb, fileName);
      
      toast({
        title: "Backup successful",
        description: "All data has been backed up to Excel file",
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      toast({
        title: "Backup failed",
        description: "There was an error creating the backup",
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

  const handlePaymentAdded = () => {
    setPaymentDialogOpen(false);
    loadCashbookData();
    
    toast({
      title: "Success",
      description: "Payment has been added to cashbook",
    });
  };

  const handleReceiptAdded = () => {
    setReceiptDialogOpen(false);
    loadCashbookData();
    
    toast({
      title: "Success",
      description: "Receipt has been added to cashbook",
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
              <CashBookHeader
                onPrint={handlePrint}
                onExportToExcel={handleExportToExcel}
                onBackupData={handleBackupData}
              />
              <TransactionButtons
                onRefresh={loadCashbookData}
                isLoading={isLoading}
                onExpenseDialogOpen={() => setExpenseDialogOpen(true)}
                onPaymentDialogOpen={() => setPaymentDialogOpen(true)}
                onReceiptDialogOpen={() => setReceiptDialogOpen(true)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <CashBookSummary
                todaySummary={todaySummary}
                closingBalance={closingBalance}
                lastBalanceType={lastBalanceType}
              />
            </div>
            
            <CashBookFilters
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
            
            <CashBookTable
              entries={entries}
              openingBalance={openingBalance}
              closingBalance={closingBalance}
              lastBalanceType={lastBalanceType}
              startDate={startDate}
              endDate={endDate}
              printRef={printRef}
            />
          </CardContent>
        </Card>
      </div>
      
      <TransactionDialogs
        expenseDialogOpen={expenseDialogOpen}
        setExpenseDialogOpen={setExpenseDialogOpen}
        paymentDialogOpen={paymentDialogOpen}
        setPaymentDialogOpen={setPaymentDialogOpen}
        receiptDialogOpen={receiptDialogOpen}
        setReceiptDialogOpen={setReceiptDialogOpen}
        handleManualExpenseAdded={handleManualExpenseAdded}
        handlePaymentAdded={handlePaymentAdded}
        handleReceiptAdded={handleReceiptAdded}
      />
      
      <PrintStyles />
    </div>
  );
};

export default CashBook;
