
import { useState, useEffect, useCallback } from 'react';
import { 
  getSuppliers, 
  getCustomers, 
  getBrokers, 
  getTransporters, 
  getAgents
} from '@/services/storageService';
import { SelectOption } from '@/components/ui/enhanced-select/types';
import { Master, MasterType } from '@/types/master.types';

interface UseMasterDataReturn {
  suppliers: SelectOption[];
  customers: SelectOption[];
  brokers: SelectOption[];
  agents: SelectOption[];
  transporters: SelectOption[];
  parties: SelectOption[]; // We'll create this from all available master data
  loading: boolean;
  refresh: () => void;
  getByType: (type: MasterType) => SelectOption[];
  getById: (id: string) => Master | undefined;
  rawData: {
    suppliers: Master[];
    customers: Master[];
    brokers: Master[];
    agents: Master[];
    transporters: Master[];
    parties: Master[]; // Combined data from all types
  };
}

export const useMasterData = (): UseMasterDataReturn => {
  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);
  const [customers, setCustomers] = useState<SelectOption[]>([]);
  const [brokers, setBrokers] = useState<SelectOption[]>([]);
  const [agents, setAgents] = useState<SelectOption[]>([]);
  const [transporters, setTransporters] = useState<SelectOption[]>([]);
  const [parties, setParties] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rawData, setRawData] = useState<any>({
    suppliers: [],
    customers: [],
    brokers: [],
    agents: [],
    transporters: [],
    parties: []
  });

  const mapToOptions = useCallback((items: Master[]): SelectOption[] => {
    return items
      .filter(item => !item.isDeleted)
      .map(item => ({
        value: item.id,
        label: item.name,
        data: item
      }));
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    
    // Get raw data
    const rawSuppliers = getSuppliers() || [];
    const rawCustomers = getCustomers() || [];
    const rawBrokers = getBrokers() || [];
    const rawAgents = getAgents() || [];
    const rawTransporters = getTransporters() || [];
    
    // Create a combined list of all parties
    const rawParties = [
      ...rawSuppliers,
      ...rawCustomers,
      ...rawBrokers,
      ...rawAgents
    ];
    
    // Store raw data for reference
    setRawData({
      suppliers: rawSuppliers,
      customers: rawCustomers,
      brokers: rawBrokers,
      agents: rawAgents,
      transporters: rawTransporters,
      parties: rawParties
    });
    
    // Convert to options
    setSuppliers(mapToOptions(rawSuppliers));
    setCustomers(mapToOptions(rawCustomers));
    setBrokers(mapToOptions(rawBrokers));
    setAgents(mapToOptions(rawAgents));
    setTransporters(mapToOptions(rawTransporters));
    setParties(mapToOptions(rawParties));
    
    setLoading(false);
  }, [mapToOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getByType = useCallback((type: MasterType): SelectOption[] => {
    switch (type) {
      case 'supplier':
        return suppliers;
      case 'customer':
        return customers;
      case 'broker':
        return brokers;
      case 'agent':
        return agents;
      case 'transporter':
        return transporters;
      case 'party':
        return parties;
      default:
        return [];
    }
  }, [suppliers, customers, brokers, agents, transporters, parties]);

  const getById = useCallback((id: string): Master | undefined => {
    const allEntities = [
      ...rawData.suppliers,
      ...rawData.customers,
      ...rawData.brokers,
      ...rawData.agents,
      ...rawData.transporters
    ];
    return allEntities.find(entity => entity.id === id);
  }, [rawData]);

  return {
    suppliers,
    customers,
    brokers,
    agents,
    transporters,
    parties,
    loading,
    refresh: fetchData,
    getByType,
    getById,
    rawData
  };
};
