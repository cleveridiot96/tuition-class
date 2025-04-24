import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  getTransactions,
  getSuppliers,
  getCustomers,
} from "@/services/storageService";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";

const PartyLedger = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [partyId, setPartyId] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [partyType, setPartyType] = useState<string>("supplier");
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    if (partyId) {
      loadTransactions();
    } else {
      setTransactions([]);
      setBalance(0);
    }
  }, [partyId, partyType]);

  const loadEntities = () => {
    const suppliersData = getSuppliers() || [];
    const customersData = getCustomers() || [];
    
    setSuppliers(suppliersData.filter(s => !s.isDeleted));
    setCustomers(customersData.filter(c => !c.isDeleted));
  };

  const loadTransactions = () => {
    setLoading(true);
    try {
      const startDate = "";
      const endDate = format(new Date(), "yyyy-MM-dd");
      
      const allTransactions = getTransactions(partyId, startDate, endDate) || [];
      
      setTransactions(allTransactions);
      
      let partyBalance = 0;
      allTransactions.forEach((transaction) => {
        if (transaction.type === "purchase") {
          partyBalance -= transaction.amount;
        } else if (transaction.type === "sale") {
          partyBalance += transaction.amount;
        } else if (transaction.type === "payment") {
          if (transaction.paymentDirection === "to-party") {
            partyBalance -= transaction.amount;
          } else {
            partyBalance += transaction.amount;
          }
        }
      });
      
      setBalance(partyBalance);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePartyChange = (newPartyId: string) => {
    setPartyId(newPartyId);
  };

  const handleViewTransaction = (transactionId: string, type: string) => {
    if (type === "purchase") {
      navigate(`/purchases/${transactionId}`);
    } else if (type === "sale") {
      navigate(`/sales/${transactionId}`);
    } else if (type === "payment") {
      navigate(`/payments/${transactionId}`);
    }
  };

  const partyOptions = partyType === "supplier" 
    ? suppliers.filter(Boolean).map(s => ({ value: s.id || 'unknown', label: s.name || 'Unknown Supplier' }))
    : customers.filter(Boolean).map(c => ({ value: c.id || 'unknown', label: c.name || 'Unknown Customer' }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Party Ledger" showBackButton className="bg-purple-700" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Party Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs defaultValue="supplier" onValueChange={setPartyType}>
                <TabsList className="mb-4">
                  <TabsTrigger value="supplier">Suppliers</TabsTrigger>
                  <TabsTrigger value="customer">Customers</TabsTrigger>
                </TabsList>

                <div className="mb-4">
                  <EnhancedSearchableSelect
                    options={partyOptions}
                    value={partyId}
                    onValueChange={handlePartyChange}
                    placeholder={`Select ${partyType === "supplier" ? "supplier" : "customer"}`}
                    emptyMessage="No parties found"
                  />
                </div>

                {partyId && transactions.length > 0 ? (
                  <div>
                    <div className="mb-4">
                      <div className="bg-purple-50 p-4 rounded-md shadow border border-purple-300">
                        <div className="font-semibold text-purple-800">
                          Current Balance: 
                          <span className={`${balance >= 0 ? 'text-green-600' : 'text-red-600'} text-lg ml-2`}>
                            ₹{Math.abs(balance).toFixed(2)}
                            {balance >= 0 ? ' (To Receive)' : ' (To Pay)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Table>
                      <TableHeader className="bg-purple-100">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount (₹)</TableHead>
                          <TableHead className="text-right">Balance (₹)</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction, index) => {
                          let runningBalance = 0;
                          for (let i = 0; i <= index; i++) {
                            const t = transactions[i];
                            if (t.type === "purchase") {
                              runningBalance -= t.amount;
                            } else if (t.type === "sale") {
                              runningBalance += t.amount;
                            } else if (t.type === "payment") {
                              if (t.paymentDirection === "to-party") {
                                runningBalance -= t.amount;
                              } else {
                                runningBalance += t.amount;
                              }
                            }
                          }

                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                {format(
                                  new Date(transaction.date),
                                  "dd-MM-yyyy"
                                )}
                              </TableCell>
                              <TableCell>
                                {transaction.type === "purchase"
                                  ? "Purchase"
                                  : transaction.type === "sale"
                                  ? "Sale"
                                  : transaction.paymentDirection === "to-party"
                                  ? "Payment (To Party)"
                                  : "Payment (From Party)"}
                              </TableCell>
                              <TableCell>
                                {transaction.reference ||
                                  transaction.billNumber ||
                                  transaction.paymentId ||
                                  "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                {transaction.amount.toFixed(2)}
                              </TableCell>
                              <TableCell
                                className={`text-right ${
                                  runningBalance >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {Math.abs(runningBalance).toFixed(2)}
                                {runningBalance >= 0 ? " (DR)" : " (CR)"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() =>
                                    handleViewTransaction(
                                      transaction.id,
                                      transaction.type
                                    )
                                  }
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white rounded-lg border border-amber-200">
                    {partyId ? (
                      loading ? (
                        <p>Loading transactions...</p>
                      ) : (
                        <p>No transactions found for this party.</p>
                      )
                    ) : (
                      <p>Select a party to view their ledger.</p>
                    )}
                  </div>
                )}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartyLedger;
