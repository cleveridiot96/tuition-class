
import { useState, useEffect } from "react";
import { getSuppliers, getAgents, getTransporters } from "@/services/storageService";
import { useEntityData } from "./hooks/useEntityData";

interface UsePartyManagementProps {
  form: any;
}

export const usePartyManagement = ({ form }: UsePartyManagementProps) => {
  // Use the shared entity data hook instead of duplicating logic
  const entityData = useEntityData();
  
  return {
    suppliers: entityData.suppliers,
    agents: entityData.agents,
    transporters: entityData.transporters,
    locations: entityData.locations,
    loadData: entityData.loadData
  };
};
