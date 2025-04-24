
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getParties, getTransactions } from '@/services/storageService';

export const useLedger = () => {
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [balance, setBalance] = useState(0);

  const partyOptions = useMemo(() => {
    const parties = getParties();
    return parties.map(party => ({
      value: party.id,
      label: party.name
    }));
  }, []);

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

  const getPartyName = (partyId: string) => {
    const parties = getParties();
    const party = parties.find((p) => p.id === partyId);
    return party ? party.name : "Unknown";
  };

  return {
    selectedParty,
    dateRange,
    balance,
    partyOptions,
    handlePartyChange,
    handleDateChange,
    handlePrintLedger,
    handleExportToExcel,
    getPartyName,
    setBalance
  };
};

export type UseLedgerReturn = ReturnType<typeof useLedger>;
