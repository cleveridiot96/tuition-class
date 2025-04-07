
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAgents, getBrokers, getCustomers, getTransporters, getPurchases, getSales, getPayments, getReceipts } from "@/services/storageService";

const Ledger = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [partiesWithTransactions, setPartiesWithTransactions] = useState<Record<string, any[]>>({
    agents: [],
    brokers: [],
    customers: [],
    transporters: []
  });

  useEffect(() => {
    // Fetch all data
    const agents = getAgents();
    const brokers = getBrokers();
    const customers = getCustomers();
    const transporters = getTransporters();
    
    const purchases = getPurchases();
    const sales = getSales();
    const payments = getPayments();
    const receipts = getReceipts();
    
    // Process agent transactions
    const agentTransactions = agents.map(agent => {
      const relatedPurchases = purchases.filter(p => p.agentId === agent.id);
      const relatedPayments = payments.filter(p => p.partyId === agent.id);
      
      const totalPurchases = relatedPurchases.reduce((sum, p) => sum + p.totalAfterExpenses, 0);
      const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const balance = totalPurchases - totalPayments;
      
      return {
        ...agent,
        totalPurchases,
        totalPayments,
        balance,
        transactions: [
          ...relatedPurchases.map(p => ({
            date: p.date,
            description: `Purchase: ${p.lotNumber}`,
            amount: p.totalAfterExpenses,
            type: 'debit'
          })),
          ...relatedPayments.map(p => ({
            date: p.date,
            description: `Payment: ${p.reference || 'Cash'}`,
            amount: p.amount,
            type: 'credit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(agent => agent.transactions.length > 0);
    
    // Process broker transactions
    const brokerTransactions = brokers.map(broker => {
      const relatedSales = sales.filter(s => s.brokerId === broker.id);
      const relatedPayments = payments.filter(p => p.partyId === broker.id);
      const relatedReceipts = receipts.filter(r => r.customerId === broker.id);
      
      const totalSales = relatedSales.reduce((sum, s) => sum + s.totalAmount * (broker.commissionRate / 100), 0);
      const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalReceipts = relatedReceipts.reduce((sum, r) => sum + r.amount, 0);
      const balance = totalSales - totalPayments + totalReceipts;
      
      return {
        ...broker,
        totalSales,
        totalPayments,
        totalReceipts,
        balance,
        transactions: [
          ...relatedSales.map(s => ({
            date: s.date,
            description: `Sale Commission: ${s.lotNumber}`,
            amount: s.totalAmount * (broker.commissionRate / 100),
            type: 'debit'
          })),
          ...relatedPayments.map(p => ({
            date: p.date,
            description: `Payment: ${p.reference || 'Cash'}`,
            amount: p.amount,
            type: 'credit'
          })),
          ...relatedReceipts.map(r => ({
            date: r.date,
            description: `Receipt: ${r.reference || 'Cash'}`,
            amount: r.amount,
            type: 'debit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(broker => broker.transactions.length > 0);
    
    // Process customer transactions
    const customerTransactions = customers.map(customer => {
      const relatedSales = sales.filter(s => s.customerId === customer.id);
      const relatedReceipts = receipts.filter(r => r.customerId === customer.id);
      
      const totalSales = relatedSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const totalReceipts = relatedReceipts.reduce((sum, r) => sum + r.amount, 0);
      const balance = totalSales - totalReceipts;
      
      return {
        ...customer,
        totalSales,
        totalReceipts,
        balance,
        transactions: [
          ...relatedSales.map(s => ({
            date: s.date,
            description: `Sale: ${s.lotNumber}`,
            amount: s.totalAmount,
            type: 'debit'
          })),
          ...relatedReceipts.map(r => ({
            date: r.date,
            description: `Receipt: ${r.reference || 'Cash'}`,
            amount: r.amount,
            type: 'credit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(customer => customer.transactions.length > 0);
    
    // Process transporter transactions
    const transporterTransactions = transporters.map(transporter => {
      const relatedPurchases = purchases.filter(p => p.transporterId === transporter.id);
      const relatedSales = sales.filter(s => s.transporterId === transporter.id);
      const relatedPayments = payments.filter(p => p.partyId === transporter.id);
      
      const totalPurchaseTransport = relatedPurchases.reduce((sum, p) => sum + p.transportCost, 0);
      const totalSaleTransport = relatedSales.reduce((sum, s) => sum + (s.transportCost || 0), 0);
      const totalTransport = totalPurchaseTransport + totalSaleTransport;
      const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const balance = totalTransport - totalPayments;
      
      return {
        ...transporter,
        totalTransport,
        totalPayments,
        balance,
        transactions: [
          ...relatedPurchases.map(p => ({
            date: p.date,
            description: `Transport: ${p.lotNumber}`,
            amount: p.transportCost,
            type: 'debit'
          })),
          ...relatedSales.map(s => ({
            date: s.date,
            description: `Transport: ${s.lotNumber}`,
            amount: s.transportCost || 0,
            type: 'debit'
          })),
          ...relatedPayments.map(p => ({
            date: p.date,
            description: `Payment: ${p.reference || 'Cash'}`,
            amount: p.amount,
            type: 'credit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(transporter => transporter.transactions.length > 0);
    
    // Update state
    setPartiesWithTransactions({
      agents: agentTransactions,
      brokers: brokerTransactions,
      customers: customerTransactions,
      transporters: transporterTransactions
    });
    
    // Set initial ledger data based on active tab
    setLedgerData(agentTransactions);
  }, []);
  
  // Update ledger data when tab changes
  useEffect(() => {
    setLedgerData(partiesWithTransactions[activeTab as keyof typeof partiesWithTransactions]);
  }, [activeTab, partiesWithTransactions]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Ledger" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="agents" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="agents" className="data-[state=active]:bg-F2FCE2">
                  Agents
                </TabsTrigger>
                <TabsTrigger value="brokers" className="data-[state=active]:bg-F2FCE2">
                  Brokers
                </TabsTrigger>
                <TabsTrigger value="customers" className="data-[state=active]:bg-F2FCE2">
                  Customers
                </TabsTrigger>
                <TabsTrigger value="transporters" className="data-[state=active]:bg-F2FCE2">
                  Transporters
                </TabsTrigger>
              </TabsList>
              
              {['agents', 'brokers', 'customers', 'transporters'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue}>
                  <div className="space-y-8">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ledgerData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              No {tabValue} with transactions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          ledgerData.map((party) => (
                            <React.Fragment key={party.id}>
                              <TableRow className="bg-muted/50">
                                <TableCell className="font-medium">{party.name}</TableCell>
                                <TableCell>{party.contactNumber}</TableCell>
                                <TableCell>{party.address}</TableCell>
                                <TableCell className={`text-right font-bold ${party.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  ₹{Math.abs(party.balance).toLocaleString()}
                                  {party.balance > 0 ? ' DR' : party.balance < 0 ? ' CR' : ''}
                                </TableCell>
                              </TableRow>
                              
                              {/* Transaction details */}
                              <TableRow>
                                <TableCell colSpan={4} className="p-0 border-b-0">
                                  <Table className="border-collapse">
                                    <TableHeader>
                                      <TableRow className="bg-gray-50">
                                        <TableHead className="py-2">Date</TableHead>
                                        <TableHead className="py-2">Description</TableHead>
                                        <TableHead className="py-2 text-right">Debit</TableHead>
                                        <TableHead className="py-2 text-right">Credit</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {party.transactions.map((transaction: any, idx: number) => (
                                        <TableRow key={idx} className="border-t border-gray-100">
                                          <TableCell className="py-2">{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                                          <TableCell className="py-2">{transaction.description}</TableCell>
                                          <TableCell className="py-2 text-right">
                                            {transaction.type === 'debit' ? `₹${transaction.amount.toLocaleString()}` : ''}
                                          </TableCell>
                                          <TableCell className="py-2 text-right">
                                            {transaction.type === 'credit' ? `₹${transaction.amount.toLocaleString()}` : ''}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      {/* Balance row */}
                                      <TableRow className="border-t border-gray-300 bg-gray-50 font-medium">
                                        <TableCell colSpan={2} className="py-2 text-right">Balance</TableCell>
                                        <TableCell className={`py-2 text-right ${party.balance > 0 ? 'text-red-600' : ''}`}>
                                          {party.balance > 0 ? `₹${party.balance.toLocaleString()}` : ''}
                                        </TableCell>
                                        <TableCell className={`py-2 text-right ${party.balance < 0 ? 'text-green-600' : ''}`}>
                                          {party.balance < 0 ? `₹${Math.abs(party.balance).toLocaleString()}` : ''}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                              {/* Spacer row */}
                              <TableRow>
                                <TableCell colSpan={4} className="h-4"></TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ledger;
