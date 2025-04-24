
import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getStorageItem } from '@/services/storageService';
import { Party } from '@/services/types';

// Export the getPartyName function for use in other components
export const getPartyName = (partyId: string, parties: Party[] = []): string => {
  const party = parties.find((p) => p.id === partyId);
  return party ? party.name : "Unknown";
};

// Helper function to get parties from all possible sources
export const getParties = (): Party[] => {
  // Get data from all potential sources
  const customers = getStorageItem<Party[]>('customers') || [];
  const suppliers = getStorageItem<Party[]>('suppliers') || [];
  const brokers = getStorageItem<Party[]>('brokers') || [];
  const agents = getStorageItem<Party[]>('agents') || [];
  const parties = getStorageItem<Party[]>('parties') || [];
  
  // Combine all sources and deduplicate by ID
  const allParties = [...customers, ...suppliers, ...brokers, ...agents, ...parties];
  const uniqueParties = allParties.reduce((acc, party) => {
    if (!acc.find(p => p.id === party.id)) {
      acc.push(party);
    }
    return acc;
  }, [] as Party[]);
  
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
