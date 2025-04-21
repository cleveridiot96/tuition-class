
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getParties, getTransactions } from "@/services/ledgerService";
import { format } from "date-fns";

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

  useEffect(() => {
    const loadParties = () => {
      const partiesData = getParties();
      setParties(partiesData || []);
    };

    loadParties();
  }, []);

  useEffect(() => {
    if (selectedParty) {
      const allTransactions = getTransactions() || [];
      const partyTransactions = allTransactions.filter(
        (transaction) => transaction.partyId === selectedParty && !transaction.isDeleted
      );
      setTransactions(partyTransactions);
    } else {
      setTransactions([]);
    }
  }, [selectedParty]);

  useEffect(() => {
    if (transactions.length > 0) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation title="Party Ledger" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 shadow">
          <CardHeader>
            <CardTitle className="text-gray-800">Party Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="party-select">Select Party</Label>
                <Select onValueChange={handlePartyChange} value={selectedParty}>
                  <SelectTrigger id="party-select">
                    <SelectValue placeholder="Select a party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.map((party) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {selectedParty && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">
                  {getPartyName(selectedParty)}
                </h3>
                <p className={`text-lg font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  Balance: ₹{Math.abs(balance).toLocaleString()}
                  {balance >= 0 ? " (Credit)" : " (Debit)"}
                </p>
              </div>
            )}

            {selectedParty && filteredTransactions.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100">
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
                              runningBalance >= 0 ? "text-green-600" : "text-red-600"
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

            {selectedParty && filteredTransactions.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline">Export to PDF</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ledger;
