
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AgentForm from "@/components/agents/AgentForm";
import { AgentSectionProps } from '../../shared/types/PurchaseFormTypes';

const AgentSection: React.FC<AgentSectionProps> = ({
  agents,
  agentId,
  onSelectChange,
  onAddAgentClick,
  showAddAgentDialog,
  setShowAddAgentDialog,
  onAgentAdded
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Label htmlFor="agentId">Agent</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onAddAgentClick}
        >
          Add New
        </Button>
      </div>
      <Select
        name="agentId"
        value={agentId}
        onValueChange={(value) => onSelectChange('agentId', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent>
          {agents.map(agent => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
          </DialogHeader>
          <AgentForm onAgentAdded={onAgentAdded} onCancel={() => setShowAddAgentDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentSection;
