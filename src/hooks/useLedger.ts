
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

// Helper function to get parties
export const getParties = (): Party[] => {
  return getStorageItem<Party[]>('parties') || [];
};

// Helper function to get transactions
export const getTransactions = (partyId: string, startDate: string, endDate: string) => {
  const allTransactions = getStorageItem('transactions') || [];
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
  }, []);

  // Load transactions when selectedParty changes
  useEffect(() => {
    if (selectedParty) {
      setIsLoading(true);
      // Get transactions for the selected party - implement this based on your data structure
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
