
import React, { useState, useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const AUTO_REFRESH_INTERVAL = 1000; // 1 second refresh

interface BrokerSelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const BrokerSelector: React.FC<BrokerSelectorProps> = ({ form, partyManagement }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState<boolean>(false);
  const [newAgentName, setNewAgentName] = useState<string>("");
  const [newAgentCommission, setNewAgentCommission] = useState<string>("1");
  const [nameError, setNameError] = useState<string>("");
  
  const loadAgents = useCallback(() => {
    const agentData = getAgents() || [];
    setAgents(agentData.filter(a => !a.isDeleted));
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
      balance: 0,
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
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select broker or agent" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {agents.length === 0 ? (
                    <div className="px-2 py-1 text-sm text-gray-500">No agents found</div>
                  ) : (
                    agents.map((agent: any) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} {agent.commissionRate && `(${agent.commissionRate}%)`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
    </>
  );
};

export default BrokerSelector;
