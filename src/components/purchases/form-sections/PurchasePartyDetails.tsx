
import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { addToMasterList } from "@/services/masterOperations";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PurchasePartyDetailsProps {
  form: any;
  partyManagement: any;
  formSubmitted?: boolean;
}

const PurchasePartyDetails: React.FC<PurchasePartyDetailsProps> = ({
  form,
  partyManagement,
  formSubmitted = false,
}) => {
  const { suppliers = [], agents = [] } = partyManagement || {};
  const showErrors = formSubmitted || form.formState.isSubmitted;
  const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentCommission, setNewAgentCommission] = useState('1');

  // Convert to options for searchable selects
  const supplierOptions = suppliers.map(supplier => ({ 
    value: supplier.name, 
    label: supplier.name 
  }));
  
  const agentOptions = [
    { value: "", label: "None" },
    ...agents.map(agent => ({ 
      value: agent.id, 
      label: agent.name 
    }))
  ];

  const handleAddNewParty = () => {
    if (!newPartyName.trim()) {
      toast.error('Party name is required');
      return;
    }
    
    const result = addToMasterList('supplier', { 
      name: newPartyName.trim(),
      type: 'supplier'
    });
    
    if (result) {
      form.setValue('party', newPartyName.trim());
      partyManagement.loadData && partyManagement.loadData();
      setNewPartyName('');
      setShowAddPartyDialog(false);
      toast.success('New party added successfully');
    }
  };
  
  const handleAddNewAgent = () => {
    if (!newAgentName.trim()) {
      toast.error('Agent name is required');
      return;
    }
    
    const result = addToMasterList('agent', { 
      name: newAgentName.trim(),
      commissionRate: parseFloat(newAgentCommission) || 1,
      type: 'agent'
    });
    
    if (result) {
      // Refresh the agents list
      partyManagement.loadData && partyManagement.loadData();
      // The agent ID will be different than name, so we can't set it directly
      // We'll need to find the agent in the refreshed list
      setNewAgentName('');
      setNewAgentCommission('1');
      setShowAddAgentDialog(false);
      toast.success('New agent added successfully');
    }
  };
  
  const handleDirectAddParty = (name: string) => {
    if (!name.trim()) return "";
    
    const result = addToMasterList('supplier', { 
      name: name.trim(),
      type: 'supplier'
    });
    
    if (result) {
      partyManagement.loadData && partyManagement.loadData();
      return name.trim();
    }
    
    return "";
  };

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Party Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="party"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Party Name</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddPartyDialog(true)}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <FormControl>
                <EnhancedSearchableSelect
                  options={supplierOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select or enter party name"
                  className="w-full"
                  masterType="supplier"
                  onAddNew={handleDirectAddParty}
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="agentId"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Agent</FormLabel>
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
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Select agent"
                  className="w-full"
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
      
      {/* Add Party Dialog */}
      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Party</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <FormLabel>Party Name</FormLabel>
              <Input
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder="Enter party name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddPartyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewParty}>Add Party</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Agent Dialog */}
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <FormLabel>Agent Name</FormLabel>
              <Input
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="Enter agent name"
              />
            </div>
            <div>
              <FormLabel>Commission Rate (%)</FormLabel>
              <Input
                type="number"
                step="0.01"
                value={newAgentCommission}
                onChange={(e) => setNewAgentCommission(e.target.value)}
                placeholder="Enter commission percentage"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddAgentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewAgent}>Add Agent</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasePartyDetails;
