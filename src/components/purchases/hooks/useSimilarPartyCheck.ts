
import { useState, useCallback } from "react";
import stringSimilarity from "string-similarity";
import { getSuppliers, getAgents } from "@/services/storageService";

export const useSimilarPartyCheck = () => {
  const [similarParty, setSimilarParty] = useState<any>(null);
  const [enteredPartyName, setEnteredPartyName] = useState<string>("");

  const resetSimilarPartyState = useCallback(() => {
    try {
      setSimilarParty(null);
      setEnteredPartyName("");
    } catch (error) {
      console.error("Error resetting similar party state:", error);
    }
  }, []);

  const checkSimilarPartyNames = useCallback((name: string) => {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return false;
    }

    try {
      const normalizedName = name.toLowerCase().trim();
      const suppliers = Array.isArray(getSuppliers()) ? getSuppliers() : [];
      const agents = Array.isArray(getAgents()) ? getAgents() : [];
      const allParties = [...suppliers, ...agents].filter(Boolean);
      
      resetSimilarPartyState();
      
      for (const party of allParties) {
        if (!party || !party.name) continue;
        
        const partyName = party.name.toLowerCase();
        const similarity = stringSimilarity.compareTwoStrings(normalizedName, partyName);
        
        if (similarity > 0.7 && similarity < 1) {
          setSimilarParty(party);
          setEnteredPartyName(name);
          return true;
        }
      }
    } catch (error) {
      console.error("Error checking similar party names:", error);
      resetSimilarPartyState();
    }
    
    return false;
  }, [resetSimilarPartyState]);

  return {
    similarParty,
    enteredPartyName,
    checkSimilarPartyNames,
    resetSimilarPartyState
  };
};
