
import React, { useState, useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAgents, addAgent } from "@/services/storageService";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useAddToMaster } from "@/hooks/useAddToMaster";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-select";

const AUTO_REFRESH_INTERVAL = 1000; // 1 second refresh

interface BrokerSelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const BrokerSelector: React.FC<BrokerSelectorProps> = ({ form, partyManagement }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [agentOptions, setAgentOptions] = useState<any[]>([]);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState<boolean>(false);
  const [newAgentName, setNewAgentName] = useState<string>("");
  const [newAgentCommission, setNewAgentCommission] = useState<string>("1");
  const [nameError, setNameError] = useState<string>("");
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();
  
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
  
  const handleAddNewAgent = () => {
    if (!newAgentName.trim()) {
      setNameError("Agent name is required");
      return;
    }
    
    // Check for duplicates
    if (agents.some(a => a.name && a.name.toLowerCase() === newAgentName.trim().toLowerCase())) {
      setNameError("Agent with this name already exists");
      return;
    }
    
    const newAgent = {
      id: `agent-${uuidv4()}`,
      name: newAgentName.trim(),
      commissionRate: parseFloat(newAgentCommission) || 1,
      type: "agent",
      isDeleted: false
    };
    
    try {
      addAgent(newAgent);
      loadAgents(); // Refresh the list immediately
      form.setValue("agentId", newAgent.id);
      setShowAddAgentDialog(false);
      toast.success("New agent added successfully");
      setNewAgentName("");
      setNewAgentCommission("1");
      setNameError("");
    } catch (error) {
      console.error("Error adding new agent:", error);
      toast.error("Failed to add new agent. Please try again.");
    }
  };

  // Handle adding new agent directly from select
  const handleAddNewToMaster = (value: string): string => {
    if (!value.trim()) return "";
    
    // For agents, we need to open the dialog to collect commission rate
    confirmAddToMaster(value.trim(), (confirmedName) => {
      // After confirmation and adding in the dialog, refresh the list
      loadAgents();
      
      // Find the newly added agent
      const newAgent = agents.find(a => a.name && a.name.toLowerCase() === confirmedName.toLowerCase());
      if (newAgent) {
        form.setValue("agentId", newAgent.id);
      }
    }, "agent");
    
    return ""; // Return empty since we're using the dialog
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="agentId"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between">
              <FormLabel>Broker / Agent</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddAgentDialog(true)}
                className="h-6 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            <FormControl>
              <EnhancedSearchableSelect
                options={agentOptions}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Select broker or agent"
                onAddNew={handleAddNewToMaster}
                masterType="agent"
                emptyMessage="No agents found"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newAgentName">
                Agent Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="newAgentName"
                value={newAgentName}
                onChange={(e) => {
                  setNewAgentName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                }}
                placeholder="Enter agent name"
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>
            <div>
              <Label htmlFor="newAgentCommission">Commission (%)</Label>
              <Input 
                id="newAgentCommission"
                type="number"
                step="0.01"
                value={newAgentCommission}
                onChange={(e) => setNewAgentCommission(e.target.value)}
                placeholder="Enter commission percentage"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddAgentDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewAgent}>Add Agent</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AddToMasterDialog />
    </>
  );
};

export default BrokerSelector;
