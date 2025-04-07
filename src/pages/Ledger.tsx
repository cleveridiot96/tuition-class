
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from 'react-to-print';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Save, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { getAgents, getBrokers, getCustomers, getTransporters, getPurchases, getSales, getPayments, getReceipts } from "@/services/storageService";

const Ledger = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("agents");
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [expandedParty, setExpandedParty] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [partiesWithTransactions, setPartiesWithTransactions] = useState<Record<string, any[]>>({
    agents: [],
    brokers: [],
    customers: [],
    transporters: []
  });

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Ledger - ${selectedParty?.name || activeTab}`,
    onAfterPrint: () => {
      toast({
        title: "Print successful",
        description: "Ledger has been sent to printer",
      });
    },
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
    
    console.log("Loaded purchases:", purchases);
    console.log("Loaded sales:", sales);
    
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
    setFilteredData(agentTransactions);
  }, []);
  
  // Update ledger data when tab changes
  useEffect(() => {
    const newData = partiesWithTransactions[activeTab as keyof typeof partiesWithTransactions];
    setLedgerData(newData);
    filterData(newData, searchTerm);
    setExpandedParty(null); // Reset expanded party when changing tabs
    setSelectedParty(null);
  }, [activeTab, partiesWithTransactions]);
  
  // Filter data when search term changes
  const filterData = (data: any[], term: string) => {
    if (!term.trim()) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(party => 
      party.name.toLowerCase().includes(term.toLowerCase()) ||
      party.contactNumber?.toLowerCase().includes(term.toLowerCase()) ||
      party.address?.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredData(filtered);
  };
  
  useEffect(() => {
    filterData(ledgerData, searchTerm);
  }, [searchTerm, ledgerData]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const togglePartyExpansion = (partyId: string, party: any) => {
    setExpandedParty(expandedParty === partyId ? null : partyId);
    setSelectedParty(expandedParty === partyId ? null : party);
  };

  const handlePartySelect = (partyId: string) => {
    const party = ledgerData.find(p => p.id === partyId);
    if (party) {
      setSearchTerm(party.name);
      setSelectedParty(party);
      setExpandedParty(partyId);
    }
  };

  const handleSave = () => {
    // This is a placeholder for actual save functionality
    toast({
      title: "Data Saved",
      description: "Ledger data has been saved successfully.",
    });
  };

  const partyOptions = ledgerData.map(party => ({
    value: party.id,
    label: party.name
  }));

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Ledger" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="agents" value={activeTab} onValueChange={handleTabChange}>
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <TabsList className="grid grid-cols-4 w-auto">
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
                
                <div className="flex gap-2 items-center">
                  <Select value={selectedParty?.id || ''} onValueChange={handlePartySelect}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Search parties..." />
                    </SelectTrigger>
                    <SelectContent searchable>
                      {partyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleSave} size="sm" className="flex items-center gap-1">
                    <Save size={16} />
                    Save
                  </Button>
                  
                  <Button onClick={handlePrint} size="sm" variant="outline" className="flex items-center gap-1">
                    <Printer size={16} />
                    Print
                  </Button>
                </div>
              </div>
              
              {['agents', 'brokers', 'customers', 'transporters'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue}>
                  <div className="space-y-8">
                    <div ref={printRef} className="print-container">
                      <h2 className="text-2xl font-bold mb-4 print-only">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Ledger</h2>
                      
                      <Table className="excel-style">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="border-r">Name</TableHead>
                            <TableHead className="border-r">Contact</TableHead>
                            <TableHead className="border-r">Address</TableHead>
                            <TableHead className="text-right border-r">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500 border-r">
                                {searchTerm ? "No matching parties found" : `No ${tabValue} with transactions found`}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredData.map((party) => (
                              <React.Fragment key={party.id}>
                                <TableRow 
                                  className={`bg-muted/50 cursor-pointer hover:bg-muted ${expandedParty === party.id ? 'bg-muted' : ''}`}
                                  onClick={() => togglePartyExpansion(party.id, party)}
                                >
                                  <TableCell className="font-medium border-r">{party.name}</TableCell>
                                  <TableCell className="border-r">{party.contactNumber}</TableCell>
                                  <TableCell className="border-r">{party.address}</TableCell>
                                  <TableCell className={`text-right font-bold border-r ${party.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ₹{Math.abs(party.balance).toLocaleString()}
                                    {party.balance > 0 ? ' DR' : party.balance < 0 ? ' CR' : ''}
                                  </TableCell>
                                </TableRow>
                                
                                {/* Transaction details in T-account format */}
                                {expandedParty === party.id && (
                                  <TableRow>
                                    <TableCell colSpan={4} className="p-0 border-b-0">
                                      <div className="border rounded-md my-2 overflow-hidden">
                                        <div className="grid grid-cols-2 border-b">
                                          <div className="p-2 font-medium bg-gray-50 border-r text-center">Debit</div>
                                          <div className="p-2 font-medium bg-gray-50 text-center">Credit</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 min-h-[100px]">
                                          {/* Debit side */}
                                          <div className="border-r">
                                            <div className="grid grid-cols-3 border-b bg-gray-50 p-2 font-medium">
                                              <div>Date</div>
                                              <div>Description</div>
                                              <div className="text-right">Amount</div>
                                            </div>
                                            {party.transactions
                                              .filter((t: any) => t.type === 'debit')
                                              .map((transaction: any, idx: number) => (
                                                <div key={`debit-${idx}`} className="grid grid-cols-3 border-b p-2">
                                                  <div>{format(new Date(transaction.date), 'dd/MM/yyyy')}</div>
                                                  <div>{transaction.description}</div>
                                                  <div className="text-right">₹{transaction.amount.toLocaleString()}</div>
                                                </div>
                                              ))}
                                            {/* Total debit */}
                                            {party.balance > 0 && (
                                              <div className="grid grid-cols-3 p-2 bg-gray-50 font-medium">
                                                <div></div>
                                                <div>Balance</div>
                                                <div className="text-right text-red-600">₹{party.balance.toLocaleString()}</div>
                                              </div>
                                            )}
                                          </div>
                                          
                                          {/* Credit side */}
                                          <div>
                                            <div className="grid grid-cols-3 border-b bg-gray-50 p-2 font-medium">
                                              <div>Date</div>
                                              <div>Description</div>
                                              <div className="text-right">Amount</div>
                                            </div>
                                            {party.transactions
                                              .filter((t: any) => t.type === 'credit')
                                              .map((transaction: any, idx: number) => (
                                                <div key={`credit-${idx}`} className="grid grid-cols-3 border-b p-2">
                                                  <div>{format(new Date(transaction.date), 'dd/MM/yyyy')}</div>
                                                  <div>{transaction.description}</div>
                                                  <div className="text-right">₹{transaction.amount.toLocaleString()}</div>
                                                </div>
                                              ))}
                                            {/* Total credit */}
                                            {party.balance < 0 && (
                                              <div className="grid grid-cols-3 p-2 bg-gray-50 font-medium">
                                                <div></div>
                                                <div>Balance</div>
                                                <div className="text-right text-green-600">₹{Math.abs(party.balance).toLocaleString()}</div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                
                                {/* Spacer row */}
                                <TableRow>
                                  <TableCell colSpan={4} className="h-4 border-r"></TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-only {
            display: block !important;
          }
          button, .hide-on-print {
            display: none !important;
          }
          .excel-style {
            border-collapse: collapse;
            width: 100%;
          }
          .excel-style th, .excel-style td {
            border: 1px solid #ddd;
          }
        }
        .print-only {
          display: none;
        }
        .excel-style {
          border-collapse: collapse;
          width: 100%;
        }
        .excel-style th, .excel-style td {
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
};

export default Ledger;
