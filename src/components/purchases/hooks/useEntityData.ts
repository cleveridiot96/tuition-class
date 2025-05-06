
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
      
      // Format data to match searchable select requirements - using name as both value and label
      const formattedSuppliers = suppliersData.map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        value: supplier.name, // Using name for validation like Google Sheets
        label: supplier.name
      }));
      
      const formattedTransporters = transportersData.map(transporter => ({
        id: transporter.id,
        name: transporter.name,
        value: transporter.name, // Using name for validation like Google Sheets
        label: transporter.name
      }));
      
      const formattedAgents = agentsData.map(agent => ({
        id: agent.id,
        name: agent.name,
        value: agent.id, // Using ID for agents since we need to store agent ID
        label: `${agent.name}${agent.commissionRate ? ` (${agent.commissionRate}%)` : ''}`
      }));
      
      console.log('Loaded suppliers:', formattedSuppliers);
      console.log('Loaded transporters:', formattedTransporters);
      console.log('Loaded agents:', formattedAgents);
      
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
