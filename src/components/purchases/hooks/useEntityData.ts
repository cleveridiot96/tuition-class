
import { useState, useEffect } from 'react';
import { getSuppliers, getTransporters, getAgents } from '@/services/storageService';

export const useEntityData = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations] = useState<string[]>(['Mumbai', 'Chiplun', 'Sawantwadi']);

  const loadData = () => {
    try {
      // Get master data and filter out deleted entities
      const suppliersData = getSuppliers().filter(s => !s.isDeleted) || [];
      const transportersData = getTransporters().filter(t => !t.isDeleted) || [];
      const agentsData = getAgents().filter(a => !a.isDeleted) || [];
      
      // Format data to match EnhancedSearchableSelect requirements
      const formattedSuppliers = suppliersData.map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        value: supplier.name,
        label: supplier.name
      }));
      
      const formattedTransporters = transportersData.map(transporter => ({
        id: transporter.id,
        name: transporter.name,
        value: transporter.id,
        label: transporter.name
      }));
      
      const formattedAgents = agentsData.map(agent => ({
        id: agent.id,
        name: agent.name,
        value: agent.id,
        label: agent.name
      }));
      
      // Update state with formatted data
      setSuppliers(formattedSuppliers);
      setTransporters(formattedTransporters);
      setAgents(formattedAgents);
    } catch (error) {
      console.error("Error loading entity data:", error);
    }
  };

  useEffect(() => {
    // Load data initially
    loadData();
    
    // Set up an interval to refresh data every second
    const refreshInterval = setInterval(loadData, 1000);
    
    // Clean up interval on component unmount
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
