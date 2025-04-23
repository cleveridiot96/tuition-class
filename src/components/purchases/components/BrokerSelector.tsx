
import React from "react";
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

interface BrokerSelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const BrokerSelector: React.FC<BrokerSelectorProps> = ({ form, partyManagement }) => {
  const agents = partyManagement?.agents || [];
  
  return (
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
              onClick={() => partyManagement.setShowAddAgentDialog(true)}
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
              <SelectContent>
                {agents.map((agent: any) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrokerSelector;
