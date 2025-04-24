
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getTransactions, getSuppliers, getCustomers, saveStorageItem } from "@/services/storageService";
import { toast } from "sonner";

export const usePartyLedger = () => {
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
      // Use empty string for startDate (get all history) and current date for endDate
      const startDate = "";
      const endDate = format(new Date(), "yyyy-MM-dd");
      
      // Call getTransactions with all required parameters
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

  const addParty = (partyData: any) => {
    try {
      const currentList = partyType === "supplier" ? suppliers : customers;
      
      // Check for duplicates
      if (currentList.some(p => p.name.toLowerCase() === partyData.name.toLowerCase())) {
        toast.error(`${partyType} with this name already exists`);
        return null;
      }
      
      // Add to the appropriate list
      const updatedList = [...currentList, partyData];
      
      // Update local state
      if (partyType === "supplier") {
        setSuppliers(updatedList);
      } else {
        setCustomers(updatedList);
      }
      
      // Save to storage
      saveStorageItem(partyType === "supplier" ? "suppliers" : "customers", updatedList);
      
      toast.success(`${partyType} added successfully`);
      return partyData.id;
    } catch (error) {
      console.error(`Error adding ${partyType}:`, error);
      toast.error(`Failed to add ${partyType}`);
      return null;
    }
  };

  const partyOptions = partyType === "supplier" 
    ? suppliers.filter(Boolean).map(s => ({ value: s.id || 'unknown', label: s.name || 'Unknown Supplier' }))
    : customers.filter(Boolean).map(c => ({ value: c.id || 'unknown', label: c.name || 'Unknown Customer' }));

  return {
    partyId,
    setPartyId,
    partyType,
    setPartyType,
    transactions,
    balance,
    loading,
    partyOptions,
    loadEntities,
    addParty
  };
};
