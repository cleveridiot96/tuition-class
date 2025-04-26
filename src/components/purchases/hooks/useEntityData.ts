
import { useState, useEffect } from 'react';
import { getSuppliers, getTransporters, getAgents, getLocations } from '@/services/storageService';

export const useEntityData = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>(['Mumbai', 'Chiplun', 'Sawantwadi']);

  const loadData = () => {
    setSuppliers(getSuppliers().filter(s => !s.isDeleted) || []);
    setTransporters(getTransporters().filter(t => !t.isDeleted) || []);
    setAgents(getAgents().filter(a => !a.isDeleted) || []);
    
    const storedLocations = getLocations();
    if (storedLocations && storedLocations.length > 0) {
      setLocations(storedLocations);
    }
  };

  useEffect(() => {
    loadData();
    
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
