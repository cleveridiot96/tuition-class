
import { useState, useEffect, useCallback } from "react";
import { useMasterData } from "@/hooks/useMasterData";

export const usePartyManagement = ({ form }: { form: any }) => {
  const { 
    suppliers, 
    agents, 
    transporters, 
    refresh, 
    loading 
  } = useMasterData();

  const loadData = useCallback(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    suppliers,
    agents,
    transporters,
    loadData,
    loading
  };
};
