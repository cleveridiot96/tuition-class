
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import LedgerFilters from "@/components/ledger/LedgerFilters";
import LedgerSummary from "@/components/ledger/LedgerSummary";
import LedgerTable from "@/components/ledger/LedgerTable";
import LedgerActions from "@/components/ledger/LedgerActions";
import { useLedger } from "@/hooks/useLedger";
import { useMemo } from "react";

// Define interfaces for type safety
interface Transaction {
  id: string;
  partyId: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
}

const Ledger = () => {
  const {
    selectedParty,
    dateRange,
    balance,
    partyOptions,
    parties,
    transactions,
    isLoading,
    handlePartyChange,
    handleDateChange,
    handlePrintLedger,
    handleExportToExcel,
    getPartyName,
    setBalance
  } = useLedger();

  // Filter transactions and calculate balance when transactions or date range changes
  // Use useMemo for performance
  const filteredTransactions = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Calculate running balance for each transaction
    let runningBalance = 0;
    const transactionsWithBalance = filtered.map(transaction => {
      if (transaction.type === "debit") {
        runningBalance -= transaction.amount;
      } else {
        runningBalance += transaction.amount;
      }
      return { ...transaction, runningBalance };
    });

    // Update the total balance
    setBalance(runningBalance);
    
    return transactionsWithBalance;
  }, [transactions, dateRange, setBalance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation title="Party Ledger" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 shadow print:shadow-none print:border-none">
          <CardHeader className="print:hidden">
            <CardTitle className="text-gray-800">Party Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <LedgerFilters
              selectedParty={selectedParty}
              dateRange={dateRange}
              partyOptions={partyOptions}
              onPartyChange={handlePartyChange}
              onDateChange={handleDateChange}
            />

            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block mb-8 text-center">
              <h1 className="text-2xl font-bold">Party Ledger</h1>
              <h2 className="text-xl">{selectedParty ? getPartyName(selectedParty) : ''}</h2>
              <p className="text-sm">
                From: {format(new Date(dateRange.startDate), "dd/MM/yyyy")} 
                To: {format(new Date(dateRange.endDate), "dd/MM/yyyy")}
              </p>
            </div>

            {selectedParty && (
              <LedgerSummary 
                partyName={selectedParty ? getPartyName(selectedParty) : ''}
                balance={balance}
              />
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                <p className="mt-2">Loading ledger data...</p>
              </div>
            ) : (
              <>
                {selectedParty && filteredTransactions.length > 0 ? (
                  <>
                    <LedgerTable transactions={filteredTransactions} />
                    <LedgerActions
                      onPrint={handlePrintLedger}
                      onExport={handleExportToExcel}
                    />
                  </>
                ) : selectedParty ? (
                  <p className="text-center py-8 text-gray-500">
                    No transactions found for the selected period.
                  </p>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Please select a party to view their ledger.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:block {
              display: block !important;
            }
            .container, .container * {
              visibility: visible;
            }
            .container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default Ledger;
