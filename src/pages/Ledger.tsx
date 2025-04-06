
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, RefreshCcw } from "lucide-react";
import { 
  getAgents, 
  getTransporters, 
  getSuppliers, 
  getCustomers, 
  getBrokers, 
  getLedgerEntries,
  getLedgerEntriesByParty,
  LedgerEntry as StorageLedgerEntry
} from "@/services/storageService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface LedgerEntry {
  id: string;
  date: string;
  partyId: string;
  partyName: string;
  partyType: 'agent' | 'supplier' | 'customer' | 'broker' | 'transporter';
  description: string;
  debit: number;
  credit: number;
  balance: number;
  referenceId?: string;
  referenceType?: string;
}

interface Party {
  id: string;
  name: string;
  type: string;
}

const Ledger = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('');
  const [selectedPartyType, setSelectedPartyType] = useState<string>('agent');
  const [ledgerEntries, setLedgerEntries] = useState<StorageLedgerEntry[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const { toast } = useToast();
  
  useEffect(() => {
    loadParties('agent');
  }, []);
  
  useEffect(() => {
    if (selectedPartyId) {
      loadLedgerData();
    } else {
      setLedgerEntries([]);
      setCurrentBalance(0);
    }
  }, [selectedPartyId, parties]);
  
  const loadLedgerData = () => {
    const selectedParty = parties.find(p => p.id === selectedPartyId);
    if (selectedParty) {
      try {
        console.log("Loading ledger for", selectedParty.name, selectedParty.type);
        const entries = getLedgerEntriesByParty(selectedParty.name, selectedParty.type);
        console.log("Found entries:", entries);
        setLedgerEntries(entries);
        
        // Calculate current balance
        if (entries.length > 0) {
          const balance = entries.reduce((total, entry) => total + entry.credit - entry.debit, 0);
          setCurrentBalance(balance);
        } else {
          setCurrentBalance(0);
        }
      } catch (error) {
        console.error("Error loading ledger data:", error);
        toast({
          title: "Error",
          description: "Failed to load ledger data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const loadParties = (type: string) => {
    let partyList: any[] = [];
    
    switch (type) {
      case 'agent':
        partyList = getAgents();
        break;
      case 'supplier':
        partyList = getSuppliers();
        break;
      case 'customer':
        partyList = getCustomers();
        break;
      case 'broker':
        partyList = getBrokers();
        break;
      case 'transporter':
        partyList = getTransporters();
        break;
      default:
        partyList = [];
    }
    
    setParties(partyList.map(p => ({ id: p.id, name: p.name, type })));
    setSelectedPartyId('');
    setSelectedPartyType(type);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const clearSelectedParty = () => {
    setSelectedPartyId('');
    setLedgerEntries([]);
    setCurrentBalance(0);
  };

  const refreshLedger = () => {
    if (selectedPartyId) {
      loadLedgerData();
      toast({
        title: "Refreshed",
        description: "Ledger data has been refreshed",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-ag-beige">
        <Navigation title="Ledger" showBackButton showHomeButton />
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="agent" className="w-full" onValueChange={loadParties}>
            <TabsList className="grid grid-cols-5 mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="agent" className="text-lg py-3">Agents</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View ledger entries for agents</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="supplier" className="text-lg py-3">Suppliers</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View ledger entries for suppliers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="customer" className="text-lg py-3">Customers</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View ledger entries for customers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="broker" className="text-lg py-3">Brokers</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View ledger entries for brokers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="transporter" className="text-lg py-3">Transporters</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View ledger entries for transporters</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
            
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1 relative">
                <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Select Party" />
                      </SelectTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose a party to view their ledger</p>
                    </TooltipContent>
                  </Tooltip>
                  <SelectContent>
                    {parties.map((party) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPartyId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-12 top-1/2 -translate-y-1/2"
                    onClick={clearSelectedParty}
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
              <Button className="p-6 mr-2" onClick={refreshLedger}>
                <RefreshCcw size={24} className="mr-2" /> Refresh
              </Button>
              <Button className="p-6">
                <Search size={24} className="mr-2" /> Search
              </Button>
            </div>
            
            {selectedPartyId ? (
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    Ledger for {parties.find(p => p.id === selectedPartyId)?.name || "Unknown Party"}
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-ag-brown">Current Balance:</p>
                    <p className={`font-bold text-lg ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(currentBalance))}
                      <span className="ml-1">{currentBalance >= 0 ? 'Cr' : 'Dr'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Date</TableHead>
                        <TableHead>Particulars</TableHead>
                        <TableHead className="text-right">Debit (Dr)</TableHead>
                        <TableHead className="text-right">Credit (Cr)</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerEntries.length > 0 ? (
                        ledgerEntries.map((entry) => (
                          <TableRow key={entry.id} className="hover:bg-gray-50">
                            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(entry.balance))}
                              <span className="ml-1 text-xs">{entry.balance >= 0 ? 'Cr' : 'Dr'}</span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
                      {ledgerEntries.length > 0 && (
                        <TableRow className="font-bold border-t-2">
                          <TableCell colSpan={2} className="text-right">Total</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(ledgerEntries.reduce((sum, entry) => sum + entry.debit, 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(ledgerEntries.reduce((sum, entry) => sum + entry.credit, 0))}
                          </TableCell>
                          <TableCell className={`text-right ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(currentBalance))}
                            <span className="ml-1 text-xs">{currentBalance >= 0 ? 'Cr' : 'Dr'}</span>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  Please select a party to view their ledger
                </p>
              </Card>
            )}
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Ledger;
