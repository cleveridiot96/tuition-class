
import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getStorageItem } from '@/services/core/storageCore';
import { Party } from '@/services/types';
import { debugStorageOperations } from '@/utils/storage';

// Export the getPartyName function for use in other components
export const getPartyName = (partyId: string, parties: Party[] = []): string => {
  const party = parties.find((p) => p.id === partyId);
  return party ? party.name : "Unknown";
};

// Helper function to get parties from all possible sources with proper deduplication
export const getParties = (): Party[] => {
  // Get data from all potential sources
  const customers = getStorageItem<Party[]>('customers') || [];
  const suppliers = getStorageItem<Party[]>('suppliers') || [];
  const brokers = getStorageItem<Party[]>('brokers') || [];
  const agents = getStorageItem<Party[]>('agents') || [];
  const parties = getStorageItem<Party[]>('parties') || [];
  
  // Log for debugging
  console.log("Raw party data:", {
    customers: customers.length,
    suppliers: suppliers.length,
    brokers: brokers.length,
    agents: agents.length,
    parties: parties.length
  });
  
  // Filter out deleted entities first
  const activeCustomers = customers.filter(c => !c.isDeleted);
  const activeSuppliers = suppliers.filter(s => !s.isDeleted);
  const activeBrokers = brokers.filter(b => !b.isDeleted);
  const activeAgents = agents.filter(a => !a.isDeleted);
  const activeParties = parties.filter(p => !p.isDeleted);
  
  // Combine all sources
  const allParties = [...activeCustomers, ...activeSuppliers, ...activeBrokers, ...activeAgents, ...activeParties];
  
  // Deduplicate by ID
  const idMap = new Map();
  
  // Add by ID first (this handles duplicates with same ID)
  allParties.forEach(party => {
    if (party.id) {
      idMap.set(party.id, party);
    }
  });
  
  // Then deduplicate by name (in case same names but different IDs)
  const nameMap = new Map();
  
  Array.from(idMap.values()).forEach(party => {
    if (party.name) {
      // Convert name to lowercase for case-insensitive comparison
      const lowerName = party.name.toLowerCase();
      if (!nameMap.has(lowerName)) {
        nameMap.set(lowerName, party);
      }
    }
  });
  
  // Convert back to array
  const uniqueParties = Array.from(nameMap.values());
  
  console.log("Deduplicated parties:", uniqueParties.length);
  
  return uniqueParties;
};

// Helper function to get transactions
export const getTransactions = (partyId: string, startDate: string, endDate: string) => {
  const allTransactions = getStorageItem<any[]>('transactions') || [];
  return allTransactions.filter((t: any) => 
    t.partyId === partyId && 
    t.date >= startDate && 
    t.date <= endDate
  );
};

export const useLedger = () => {
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [balance, setBalance] = useState(0);
  const [parties, setParties] = useState<Party[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load parties on mount
  useEffect(() => {
    const loadedParties = getParties();
    setParties(loadedParties);
    console.log('Loaded parties:', loadedParties); // Debug output
  }, []);

  // Load transactions when selectedParty changes
  useEffect(() => {
    if (selectedParty) {
      setIsLoading(true);
      // Get transactions for the selected party
      const partyTransactions = getTransactions(selectedParty, dateRange.startDate, dateRange.endDate);
      setTransactions(partyTransactions);
      setIsLoading(false);
    } else {
      setTransactions([]);
    }
  }, [selectedParty, dateRange.startDate, dateRange.endDate]);

  const partyOptions = useMemo(() => {
    return parties.map(party => ({
      value: party.id,
      label: party.name
    }));
  }, [parties]);

  const handlePartyChange = (partyId: string) => {
    setSelectedParty(partyId);
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrintLedger = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    toast.info("Export to Excel", {
      description: "This feature is coming soon!"
    });
  };

  return {
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
    getPartyName: (partyId: string) => getPartyName(partyId, parties),
    setBalance
  };
};

export type UseLedgerReturn = ReturnType<typeof useLedger>;
