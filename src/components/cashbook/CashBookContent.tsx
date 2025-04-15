
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { getCashBookEntries, initializeAccounting, getTodayCashTransactions } from "@/services/ledger";
import CashBookSummary from "./CashBookSummary";
import CashBookFilters from "./CashBookFilters";
import CashBookTable from "./CashBookTable";
import TransactionButtons from "./TransactionButtons";
import TransactionDialogs from "./TransactionDialogs";
import useCashBook from "@/hooks/useCashBook";

const CashBookContent = () => {
  const { toast } = useToast();
  const {
    entries,
    startDate,
    endDate,
    isLoading,
    todaySummary,
    expenseDialogOpen,
    paymentDialogOpen,
    receiptDialogOpen,
    setStartDate,
    setEndDate,
    setExpenseDialogOpen,
    setPaymentDialogOpen,
    setReceiptDialogOpen,
    loadCashbookData,
    resetFilters,
    handleFilterChange,
    handleManualExpenseAdded,
    handlePaymentAdded,
    handleReceiptAdded
  } = useCashBook();

  const printRef = useRef(null);

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
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, "Cashbook");
      const fileName = `Cashbook_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
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
    const firstEntry = entries[0];
    if (firstEntry.reference === 'Opening Balance') return 0;
    let openingBalance = firstEntry.balance;
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

  const openingBalance = calculateOpeningBalance();
  const closingBalance = calculateClosingBalance();
  const lastBalanceType = entries.length > 0 ? entries[entries.length - 1].balanceType : 'DR';

  return (
    <>
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
    </>
  );
};

export default CashBookContent;
