
import { useState, useEffect, useCallback } from "react";
import { useMasterData } from "@/hooks/useMasterData";

// Define proper types for your data structures
interface MasterDataItem {
  value: string;
  label: string;
  // Add any additional properties that might exist on your master data items
  commissionRate?: number; // Use optional property if it may not exist on all items
}

// You might want to adjust this type based on the actual return type of useMasterData
interface UseMasterDataReturn {
  suppliers: MasterDataItem[];
  agents: MasterDataItem[];
  transporters: MasterDataItem[];
  refresh: () => void;
  loading: boolean;
  getByType: (type: string) => MasterDataItem[];
}

export const usePartyManagement = ({ form }: { form: any }) => {
  const { 
    suppliers, 
    agents, 
    transporters, 
    refresh, 
    loading,
    getByType
  } = useMasterData() as UseMasterDataReturn;

  // Format data for each dropdown
  const formattedSuppliers = suppliers.map(supplier => ({
    value: supplier.value,
    label: supplier.label
  }));
  
  const formattedAgents = agents.map(agent => ({
    value: agent.value,
    label: agent.label,
    commissionRate: agent.commissionRate // Access the property directly
  }));
  
  const formattedTransporters = transporters.map(transporter => ({
    value: transporter.value,
    label: transporter.label
  }));

  const loadData = useCallback(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    suppliers: formattedSuppliers,
    agents: formattedAgents,
    transporters: formattedTransporters,
    loadData,
    loading
  };
};
