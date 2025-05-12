
import React, { useState, useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { getAgents } from "@/services/storageService";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { useGlobalMasterDialog } from "@/hooks/useGlobalMasterDialog";

const AUTO_REFRESH_INTERVAL = 1000; // 1 second refresh

interface BrokerSelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const BrokerSelector: React.FC<BrokerSelectorProps> = ({ form, partyManagement }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [agentOptions, setAgentOptions] = useState<any[]>([]);
  const { GlobalMasterAddDialog } = useGlobalMasterDialog();
  
  const loadAgents = useCallback(() => {
    const agentData = getAgents() || [];
    const activeAgents = agentData.filter(a => !a.isDeleted);
    setAgents(activeAgents);
    
    // Convert to options for select
    const options = activeAgents.map(agent => ({
      value: agent.id,
      label: `${agent.name}${agent.commissionRate ? ` (${agent.commissionRate}%)` : ''}`
    }));
    
    setAgentOptions(options);
  }, []);
  
  useEffect(() => {
    loadAgents();
    
    // Set up auto-refresh
    const refreshInterval = setInterval(() => {
      loadAgents();
    }, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(refreshInterval);
  }, [loadAgents]);
  
  return (
    <>
      <FormField
        control={form.control}
        name="agentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Broker / Agent</FormLabel>
            <FormControl>
              <EnhancedSearchableSelect
                options={agentOptions}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Select broker or agent"
                masterType="agent"
                emptyMessage="No agents found"
                label="Broker / Agent"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <GlobalMasterAddDialog />
    </>
  );
};

export default BrokerSelector;
