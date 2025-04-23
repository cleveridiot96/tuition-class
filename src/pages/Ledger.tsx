
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { 
  getParties, 
  getTransactions, 
  getSuppliers, 
  getCustomers
} from "@/services/storageService";
import { getSales } from "@/services/saleService";
import { getPurchases } from "@/services/purchaseService";
import { toast } from "sonner";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { ExternalLink, Printer, FileSpreadsheet } from "lucide-react";

const Ledger = () => {
  const [parties, setParties] = useState<any[]>([]);
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllParties();
  }, []);

  const loadAllParties = () => {
    try {
      // Get parties from all relevant sources
      const ledgerParties = getParties() || [];
      const suppliers = getSuppliers() || [];
      const customers = getCustomers() || [];
      
      // Combine all unique parties
      const allParties = [...ledgerParties];
      
      // Add suppliers if not already in the list
      suppliers.forEach(supplier => {
        if (!allParties.some(p => p.id === supplier.id)) {
          allParties.push({
            id: supplier.id,
            name: supplier.name,
            type: 'supplier'
          });
        }
      });
      
      // Add customers if not already in the list
      customers.forEach(customer => {
        if (!allParties.some(p => p.id === customer.id)) {
          allParties.push({
            id: customer.id,
            name: customer.name,
            type: 'customer'
          });
        }
      });
      
      setParties(allParties);
    } catch (error) {
      console.error("Error loading parties:", error);
      toast.error("Failed to load parties");
    }
  };

  useEffect(() => {
    if (selectedParty) {
      loadPartiedData(selectedParty);
    } else {
      setTransactions([]);
    }
  }, [selectedParty]);

  const loadPartiedData = async (partyId: string) => {
    setIsLoading(true);
    try {
      // Get regular transactions
      const allTransactions = getTransactions() || [];
      let partyTransactions = allTransactions.filter(
        (transaction) => transaction.partyId === partyId && !transaction.isDeleted
      );
      
      // Get sales related to this party
      const sales = getSales() || [];
      const partySales = sales.filter(sale => 
        (sale.customerId === partyId || sale.customer === getPartyName(partyId)) && !sale.isDeleted
      );
      
      // Convert sales to transaction format
      const salesTransactions = partySales.map(sale => ({
        id: `sale-${sale.id}`,
        partyId,
        date: sale.date,
        type: 'credit', // Assuming sale is credit to party account
        amount: sale.totalAmount,
        description: `Sale - ${sale.lotNumber || ''}`,
        reference: `Bill #${sale.billNumber || sale.id.substring(0, 6)}`,
      }));
      
      // Get purchases related to this party
      const purchases = getPurchases() || [];
      const partyPurchases = purchases.filter(purchase => 
        (purchase.party === getPartyName(partyId)) && !purchase.isDeleted
      );
      
      // Convert purchases to transaction format
      const purchaseTransactions = partyPurchases.map(purchase => ({
        id: `purchase-${purchase.id}`,
        partyId,
        date: purchase.date,
        type: 'debit', // Assuming purchase is debit to party account
        amount: purchase.totalAmount,
        description: `Purchase - ${purchase.lotNumber || ''}`,
        reference: `PO #${purchase.id.substring(0, 6)}`,
      }));
      
      // Combine all transactions
      const combinedTransactions = [
        ...partyTransactions,
        ...salesTransactions,
        ...purchaseTransactions
      ];
      
      // Sort by date
      combinedTransactions.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      
      setTransactions(combinedTransactions);
    } catch (error) {
      console.error("Error loading party data:", error);
      toast.error("Failed to load party transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      setFilteredTransactions(filtered);

      // Calculate balance
      let totalBalance = 0;
      filtered.forEach((transaction) => {
        if (transaction.type === "debit") {
          totalBalance -= transaction.amount;
        } else {
          totalBalance += transaction.amount;
        }
      });
      setBalance(totalBalance);
    } else {
      setFilteredTransactions([]);
      setBalance(0);
    }
  }, [transactions, dateRange]);

  const handlePartyChange = (partyId: string) => {
    setSelectedParty(partyId);
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getPartyName = (partyId: string) => {
    const party = parties.find((p) => p.id === partyId);
    return party ? party.name : "Unknown";
  };

  const handlePrintLedger = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    toast.info("Export to Excel", {
      description: "This feature is coming soon!"
    });
  };
  
  const partyOptions = parties.map(party => ({
    value: party.id,
    label: party.name
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation title="Party Ledger" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 shadow print:shadow-none print:border-none">
          <CardHeader className="print:hidden">
            <CardTitle className="text-gray-800">Party Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:hidden">
              <div>
                <Label htmlFor="party-select">Select Party</Label>
                <EnhancedSearchableSelect
                  options={partyOptions}
                  value={selectedParty}
                  onValueChange={handlePartyChange}
                  placeholder="Select a party"
                  masterType="party"
                />
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                />
              </div>
            </div>

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
              <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200 print:mb-6 print:border-none">
                <h3 className="text-lg font-semibold text-gray-700">
                  {getPartyName(selectedParty)}
                </h3>
                <p className={`text-lg font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"} print:text-black`}>
                  Balance: ₹{Math.abs(balance).toLocaleString()}
                  {balance >= 0 ? " (Credit)" : " (Debit)"}
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                <p className="mt-2">Loading ledger data...</p>
              </div>
            ) : (
              <>
                {selectedParty && filteredTransactions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden print:border-none">
                    <Table>
                      <TableHeader className="bg-gray-100 print:bg-gray-200">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Debit</TableHead>
                          <TableHead>Credit</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction, index) => {
                          let runningBalance = 0;
                          for (let i = 0; i <= index; i++) {
                            if (filteredTransactions[i].type === "debit") {
                              runningBalance -= filteredTransactions[i].amount;
                            } else {
                              runningBalance += filteredTransactions[i].amount;
                            }
                          }

                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                {format(new Date(transaction.date), "dd/MM/yyyy")}
                              </TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.reference || "-"}</TableCell>
                              <TableCell>
                                {transaction.type === "debit"
                                  ? `₹${transaction.amount.toLocaleString()}`
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {transaction.type === "credit"
                                  ? `₹${transaction.amount.toLocaleString()}`
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className={
                                  runningBalance >= 0 ? "text-green-600 print:text-black" : "text-red-600 print:text-black"
                                }
                              >
                                ₹{Math.abs(runningBalance).toLocaleString()}
                                {runningBalance >= 0 ? " Cr" : " Dr"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : selectedParty ? (
                  <p className="text-center py-8 text-gray-500">No transactions found for the selected period.</p>
                ) : (
                  <p className="text-center py-8 text-gray-500">Please select a party to view their ledger.</p>
                )}
              </>
            )}

            {selectedParty && filteredTransactions.length > 0 && (
              <div className="mt-4 flex justify-end space-x-2 print:hidden">
                <Button variant="outline" onClick={handlePrintLedger} className="flex items-center gap-2">
                  <Printer size={16} />
                  Print
                </Button>
                <Button variant="outline" onClick={handleExportToExcel} className="flex items-center gap-2">
                  <FileSpreadsheet size={16} />
                  Export to Excel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Print Styles */}
      <style jsx global>{`
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
      `}</style>
    </div>
  );
};

export default Ledger;
