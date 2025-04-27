
import { useState, useEffect } from 'react';
import { getSuppliers, getTransporters, getAgents } from '@/services/storageService';

export const useEntityData = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations] = useState<string[]>(['Mumbai', 'Chiplun', 'Sawantwadi']);

  const loadData = () => {
    try {
      // Log raw data for debugging
      console.log("Raw data from storage:", {
        suppliers: getSuppliers(),
        transporters: getTransporters(),
        agents: getAgents()
      });

      // Get master data and filter out deleted entities
      const suppliersData = getSuppliers().filter(s => !s.isDeleted) || [];
      const transportersData = getTransporters().filter(t => !t.isDeleted) || [];
      const agentsData = getAgents().filter(a => !a.isDeleted) || [];
      
      console.log("Filtered data:", {
        suppliers: suppliersData.length,
        transporters: transportersData.length,
        agents: agentsData.length
      });
      
      // Format data to match EnhancedSearchableSelect requirements
      const formattedSuppliers = suppliersData.map(supplier => ({
        id: supplier.id || `supplier-${Date.now()}-${Math.random()}`,
        name: supplier.name,
        value: supplier.id || `supplier-${Date.now()}-${Math.random()}`,
        label: supplier.name
      }));
      
      const formattedTransporters = transportersData.map(transporter => ({
        id: transporter.id || `transporter-${Date.now()}-${Math.random()}`,
        name: transporter.name,
        value: transporter.id || `transporter-${Date.now()}-${Math.random()}`,
        label: transporter.name
      }));
      
      const formattedAgents = agentsData.map(agent => ({
        id: agent.id || `agent-${Date.now()}-${Math.random()}`,
        name: agent.name,
        value: agent.id || `agent-${Date.now()}-${Math.random()}`,
        label: agent.name
      }));
      
      // Log formatted data for debugging
      console.log("Formatted data:", {
        suppliers: formattedSuppliers.length,
        transporters: formattedTransporters.length,
        agents: formattedAgents.length
      });
      
      // Update state with formatted data
      setSuppliers(formattedSuppliers);
      setTransporters(formattedTransporters);
      setAgents(formattedAgents);
    } catch (error) {
      console.error("Error loading entity data:", error);
    }
  };

  useEffect(() => {
    // Load data initially and set up a refresh interval
    loadData();
    
    // Set up an interval to refresh data every 3 seconds
    const refreshInterval = setInterval(loadData, 3000);
    
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
