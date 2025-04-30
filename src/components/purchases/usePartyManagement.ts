
import { useState, useEffect, useCallback } from "react";
import { useMasterData } from "@/hooks/useMasterData";

export const usePartyManagement = ({ form }: { form: any }) => {
  const { 
    suppliers, 
    agents, 
    transporters, 
    refresh, 
    loading,
    getByType
  } = useMasterData();

  // Format data for each dropdown
  const formattedSuppliers = suppliers.map(supplier => ({
    value: supplier.value,
    label: supplier.label
  }));

  const formattedAgents = agents.map(agent => ({
    value: agent.value,
    label: agent.label,
    commissionRate: agent.data?.commissionRate
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
