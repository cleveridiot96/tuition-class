
import { useEffect, useState, useCallback } from 'react';
import { getSuppliers, getAgents, getTransporters } from '@/services/storageService';

interface UsePartyManagementProps {
  form: any;
}

export const usePartyManagement = ({ form }: UsePartyManagementProps) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);

  const loadData = useCallback(() => {
    // Load suppliers
    const loadedSuppliers = getSuppliers() || [];
    const activeSuppliers = loadedSuppliers
      .filter(supplier => !supplier.isDeleted)
      .map(supplier => ({
        value: supplier.name,
        label: supplier.name
      }));
    setSuppliers(activeSuppliers);

    // Load agents
    const loadedAgents = getAgents() || [];
    const activeAgents = loadedAgents
      .filter(agent => !agent.isDeleted)
      .map(agent => ({
        value: agent.id,
        label: agent.name
      }));
    setAgents(activeAgents);

    // Load transporters
    const loadedTransporters = getTransporters() || [];
    const activeTransporters = loadedTransporters
      .filter(transporter => !transporter.isDeleted)
      .map(transporter => ({
        value: transporter.id,
        label: transporter.name
      }));
    setTransporters(activeTransporters);

    // If form has a value for agentId that no longer exists, clear it
    const agentId = form.getValues("agentId");
    if (agentId && !activeAgents.some(a => a.value === agentId)) {
      form.setValue("agentId", "");
    }

    // If form has a value for transporterId that no longer exists, clear it
    const transporterId = form.getValues("transporterId");
    if (transporterId && !activeTransporters.some(t => t.value === transporterId)) {
      form.setValue("transporterId", "");
    }
  }, [form]);

  // Load data initially
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up polling to check for new data (every 2 seconds)
  useEffect(() => {
    const intervalId = setInterval(loadData, 2000);
    return () => clearInterval(intervalId);
  }, [loadData]);

  return {
    suppliers,
    agents,
    transporters,
    loadData
  };
};
