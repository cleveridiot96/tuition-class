
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Master, MasterType } from "@/types/master.types";

interface EditMasterFormProps {
  editName: string;
  editType: MasterType;
  editCommissionRate: string;
  master: Master;
  onNameChange: (value: string) => void;
  onTypeChange: (value: MasterType) => void;
  onCommissionRateChange: (value: string) => void;
  onSave: (masterId: string) => void;
  onCancel: () => void;
}

const EditMasterForm = ({
  editName,
  editType,
  editCommissionRate,
  master,
  onNameChange,
  onTypeChange,
  onCommissionRateChange,
  onSave,
  onCancel
}: EditMasterFormProps) => {
  return (
    <div className="space-y-3">
      <Input
        value={editName}
        onChange={(e) => onNameChange(e.target.value)}
        className="font-semibold"
        placeholder="Enter name"
      />
      
      <Select 
        value={editType} 
        onValueChange={(value) => onTypeChange(value as MasterType)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="supplier">Supplier</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="broker">Broker</SelectItem>
          <SelectItem value="agent">Agent</SelectItem>
          <SelectItem value="transporter">Transporter</SelectItem>
        </SelectContent>
      </Select>
      
      {(editType === "broker" || editType === "agent") && (
        <Input
          type="number"
          value={editCommissionRate}
          onChange={(e) => onCommissionRateChange(e.target.value)}
          className="mt-2"
          placeholder="Commission Rate %"
          step="0.01"
        />
      )}
      
      <div className="flex space-x-2 mt-2">
        <Button 
          size="sm" 
          className="flex items-center" 
          onClick={() => onSave(master.id)}
        >
          <Check className="h-4 w-4 mr-1" /> Save
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center" 
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditMasterForm;
