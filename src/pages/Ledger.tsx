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
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { Printer, Download, Search, ChevronDown, ChevronUp, FileText, CircleDollarSign } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getFinancialYearString } from "@/utils/helpers";

import { getPurchaseAgents, getSalesBrokers, getCustomers, getTransporters, getPurchases, getSales, getPayments, getReceipts } from "@/services/storageService";

const Ledger = () => {
  const [activeTab, setActiveTab] = useState("purchaseAgents");
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [expandedParty, setExpandedParty] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [partiesWithTransactions, setPartiesWithTransactions] = useState<Record<string, any[]>>({
    purchaseAgents: [],
    salesBrokers: [],
    customers: [],
    transporters: []
  });
  const [financialYear, setFinancialYear] = useState(getFinancialYearString());

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Ledger - ${selectedParty?.name || activeTab}`,
    onAfterPrint: () => {
      toast.success("Ledger has been sent to printer");
    },
  });

  const handleExportCSV = () => {
    if (!selectedParty && filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const dataToExport = selectedParty ? [selectedParty] : filteredData;
      
      let csvContent = "data:text/csv;charset=utf-8,";
      
      csvContent += "Name,Address,Balance\n";
      
      dataToExport.forEach(party => {
        const row = [
          party.name,
          party.address || "",
          party.balance
        ].map(cell => `"${cell}"`).join(",");
        
        csvContent += row + "\n";
        
        if (selectedParty && party.transactions && party.transactions.length > 0) {
          csvContent += "Date,Description,Debit,Credit,Balance\n";
          
          let runningBalance = 0;
          party.transactions.forEach((t: any) => {
            const amount = t.type === 'debit' ? t.amount : -t.amount;
            runningBalance += amount;
            
            const row = [
              format(new Date(t.date), "dd/MM/yyyy"),
              t.description,
              t.type === 'debit' ? t.amount.toFixed(2) : "",
              t.type === 'credit' ? t.amount.toFixed(2) : "",
              runningBalance.toFixed(2)
            ].map(cell => `"${cell}"`).join(",");
            
            csvContent += row + "\n";
          });
        }
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${activeTab}-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Ledger data exported successfully");
    } catch (err) {
      console.error("Error exporting data:", err);
      toast.error("Failed to export data");
    }
  };

  useEffect(() => {
    loadLedgerData();
  }, []);

  const loadLedgerData = () => {
    const agents = getPurchaseAgents();
    const brokers = getSalesBrokers();
    const customers = getCustomers();
    const transporters = getTransporters();
    
    const purchases = getPurchases();
    const sales = getSales();
    const payments = getPayments();
    const receipts = getReceipts();
    
    console.log("Loaded purchases:", purchases.length);
    console.log("Loaded sales:", sales.length);
    
    const agentTransactions = agents.map(agent => {
      const relatedPurchases = purchases.filter(p => p.agentId === agent.id);
      const relatedPayments = payments.filter(p => p.partyId === agent.id);
      
      const totalPurchases = relatedPurchases.reduce((sum, p) => sum + (p.totalAfterExpenses || p.totalAmount || 0), 0);
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
            amount: p.totalAfterExpenses || p.totalAmount || 0,
            type: 'debit'
          })),
          ...relatedPayments.map(p => ({
            date: p.date,
            description: `Payment: ${p.referenceNumber || p.reference || 'Cash'}`,
            amount: p.amount,
            type: 'credit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(agent => agent.transactions.length > 0);
    
    const brokerTransactions = brokers.map(broker => {
      const relatedSales = sales.filter(s => s.brokerId === broker.id);
      const relatedPayments = payments.filter(p => p.partyId === broker.id);
      const relatedReceipts = receipts.filter(r => r.customerId === broker.id);
      
      const commissionRate = broker.commissionRate || 1;
      const totalSales = relatedSales.reduce((sum, s) => sum + s.totalAmount * (commissionRate / 100), 0);
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
            amount: s.totalAmount * (commissionRate / 100),
            type: 'debit'
          })),
          ...relatedPayments.map(p => ({
            date: p.date,
            description: `Payment: ${p.referenceNumber || p.reference || 'Cash'}`,
            amount: p.amount,
            type: 'credit'
          })),
          ...relatedReceipts.map(r => ({
            date: r.date,
            description: `Receipt: ${r.referenceNumber || r.reference || 'Cash'}`,
            amount: r.amount,
            type: 'debit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(broker => broker.transactions.length > 0);
    
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
            description: `Receipt: ${r.referenceNumber || r.reference || 'Cash'}`,
            amount: r.amount,
            type: 'credit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(customer => customer.transactions.length > 0);
    
    const transporterTransactions = transporters.map(transporter => {
      const relatedPurchases = purchases.filter(p => p.transporterId === transporter.id);
      const relatedSales = sales.filter(s => s.transporterId === transporter.id);
      const relatedPayments = payments.filter(p => p.partyId === transporter.id);
      
      const totalPurchaseTransport = relatedPurchases.reduce((sum, p) => sum + (p.transportCost || 0), 0);
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
            amount: p.transportCost || 0,
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
            description: `Payment: ${p.referenceNumber || p.reference || 'Cash'}`,
            amount: p.amount,
            type: 'credit'
          }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    }).filter(transporter => transporter.transactions.length > 0);
    
    setPartiesWithTransactions({
      purchaseAgents: agentTransactions,
      salesBrokers: brokerTransactions,
      customers: customerTransactions,
      transporters: transporterTransactions
    });
    
    setLedgerData(agentTransactions);
    setFilteredData(agentTransactions);
  };

  useEffect(() => {
    const newData = partiesWithTransactions[activeTab as keyof typeof partiesWithTransactions];
    setLedgerData(newData);
    filterData(newData, searchTerm);
    setExpandedParty(null);
    setSelectedParty(null);
  }, [activeTab, partiesWithTransactions]);

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

  const partyOptions = ledgerData.map(party => ({
    value: party.id,
    label: party.name
  }));

  const getTabTitle = () => {
    switch (activeTab) {
      case 'purchaseAgents': return 'Purchase Agent Ledger';
      case 'salesBrokers': return 'Sales Broker Ledger';
      case 'customers': return 'Customer Ledger';
      case 'transporters': return 'Transporter Ledger';
      default: return 'Ledger';
    }
  };

  const getPartyTypeBadgeColor = () => {
    switch (activeTab) {
      case 'purchaseAgents': return 'bg-blue-100 text-blue-800';
      case 'salesBrokers': return 'bg-green-100 text-green-800';
      case 'customers': return 'bg-purple-100 text-purple-800';
      case 'transporters': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Ledger" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{getTabTitle()}</CardTitle>
                <CardDescription>
                  Financial Year: {financialYear}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-1">
                  <Printer size={16} />
                  Print
                </Button>
                <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex items-center gap-1">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="purchaseAgents" value={activeTab} onValueChange={handleTabChange}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="purchaseAgents" className="px-3 py-2">
                    Purchase Agents
                  </TabsTrigger>
                  <TabsTrigger value="salesBrokers" className="px-3 py-2">
                    Sales Brokers
                  </TabsTrigger>
                  <TabsTrigger value="customers" className="px-3 py-2">
                    Customers
                  </TabsTrigger>
                  <TabsTrigger value="transporters" className="px-3 py-2">
                    Transporters
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2 items-center w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Search..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={selectedParty?.id || ''} onValueChange={handlePartySelect}>
                    <SelectTrigger className="w-64 hidden sm:flex">
                      <SelectValue placeholder="Select party..." />
                    </SelectTrigger>
                    <SelectContent>
                      {partyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="bg-white border rounded-md">
                <div ref={printRef} className="print-container">
                  <div className="print-header mb-4 print:block hidden">
                    <h2 className="text-2xl font-bold text-center">{getTabTitle()}</h2>
                    <p className="text-center text-gray-600">Financial Year: {financialYear}</p>
                    <hr className="my-4" />
                  </div>
                  
                  <PartyLedger 
                    filteredData={filteredData} 
                    expandedParty={expandedParty}
                    togglePartyExpansion={togglePartyExpansion}
                    activeTab={activeTab}
                    selectedParty={selectedParty}
                  />
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PartyLedger = ({ 
  filteredData, 
  expandedParty, 
  togglePartyExpansion, 
  activeTab,
  selectedParty
}: { 
  filteredData: any[],
  expandedParty: string | null,
  togglePartyExpansion: (id: string, party: any) => void,
  activeTab: string,
  selectedParty: any
}) => {
  
  const getBalanceStyling = (balance: number) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('print').matches) {
      return "font-bold";
    }
    
    return `font-bold ${balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-600'}`;
  };
  
  const getBalanceText = (balance: number) => {
    const formatted = formatCurrency(Math.abs(balance));
    
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('print').matches) {
      return formatted;
    }
    
    return `${formatted} ${balance > 0 ? 'DR' : balance < 0 ? 'CR' : ''}`;
  };
  
  return (
    <>
      {filteredData.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText className="inline-block mb-2 h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium">No Records Found</p>
          <p className="text-sm">
            {activeTab === 'purchaseAgents' && "No purchase agents with transactions found"}
            {activeTab === 'salesBrokers' && "No sales brokers with transactions found"}
            {activeTab === 'customers' && "No customers with transactions found"}
            {activeTab === 'transporters' && "No transporters with transactions found"}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-1/3">Name</TableHead>
                <TableHead className="w-1/3">Contact Information</TableHead>
                <TableHead className="w-1/6 text-right">Balance</TableHead>
                <TableHead className="w-1/12 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((party) => (
                <React.Fragment key={party.id}>
                  <TableRow 
                    className={`hover:bg-gray-50 ${expandedParty === party.id ? 'bg-gray-50' : ''}`}
                  >
                    <TableCell className="font-medium">
                      {party.name}
                      {activeTab === 'salesBrokers' && party.commissionRate && (
                        <span className="text-xs text-gray-500 block">
                          Commission Rate: {party.commissionRate}%
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {party.address && (
                        <span className="block text-gray-600 text-sm">{party.address}</span>
                      )}
                      {party.phone && (
                        <span className="block text-gray-600 text-sm">{party.phone}</span>
                      )}
                    </TableCell>
                    <TableCell className={`text-right ${getBalanceStyling(party.balance)}`}>
                      {getBalanceText(party.balance)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => togglePartyExpansion(party.id, party)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedParty === party.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedParty === party.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0 border-t-0">
                        <div className="border-t border-gray-100 bg-gray-50 p-4">
                          <div className="mb-3 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-700">Transaction History</h3>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="bg-blue-50">
                                <CircleDollarSign className="h-3 w-3 mr-1" />
                                Total: {formatCurrency(Math.abs(party.balance))}
                              </Badge>
                            </div>
                          </div>
                          
                          {party.transactions && party.transactions.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader className="bg-gray-100">
                                  <TableRow>
                                    <TableHead className="py-2 w-1/6">Date</TableHead>
                                    <TableHead className="py-2 w-2/6">Description</TableHead>
                                    <TableHead className="py-2 w-1/6 text-right">Debit</TableHead>
                                    <TableHead className="py-2 w-1/6 text-right">Credit</TableHead>
                                    <TableHead className="py-2 w-1/6 text-right">Balance</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(() => {
                                    let runningBalance = 0;
                                    return party.transactions.map((transaction: any, idx: number) => {
                                      const amount = transaction.type === 'debit' ? transaction.amount : -transaction.amount;
                                      runningBalance += amount;
                                      return (
                                        <TableRow key={`transaction-${idx}`} className="border-b border-gray-100">
                                          <TableCell className="py-1.5">
                                            {format(new Date(transaction.date), "dd/MM/yyyy")}
                                          </TableCell>
                                          <TableCell className="py-1.5">{transaction.description}</TableCell>
                                          <TableCell className="py-1.5 text-right">
                                            {transaction.type === 'debit' ? formatCurrency(transaction.amount) : ''}
                                          </TableCell>
                                          <TableCell className="py-1.5 text-right">
                                            {transaction.type === 'credit' ? formatCurrency(transaction.amount) : ''}
                                          </TableCell>
                                          <TableCell className={`py-1.5 text-right ${getBalanceStyling(runningBalance)}`}>
                                            {getBalanceText(runningBalance)}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    });
                                  })()}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">No transaction history available</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
};

export default Ledger;
