
import { useState, useEffect } from 'react';
import { getSuppliers, getTransporters, getAgents, getLocations } from '@/services/storageService';

export const useEntityData = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations] = useState<string[]>(['Mumbai', 'Chiplun', 'Sawantwadi']);

  const loadData = () => {
    // Only include non-deleted entities
    setSuppliers(getSuppliers().filter(s => !s.isDeleted) || []);
    setTransporters(getTransporters().filter(t => !t.isDeleted) || []);
    setAgents(getAgents().filter(a => !a.isDeleted) || []);
  };

  useEffect(() => {
    loadData();
    // Refresh data every second to catch updates from master data
    const refreshInterval = setInterval(loadData, 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  return {
    suppliers,
    transporters,
    agents,
    locations,
    loadData
  };
};
