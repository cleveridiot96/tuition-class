
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addMaster } from "@/services/storageService";
import { MasterType } from "@/types/master.types";

interface MasterFormProps {
  onClose: () => void;
  onSaved: () => void;
}

export const MasterForm: React.FC<MasterFormProps> = ({ onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<MasterType>("supplier");
  const [commissionRate, setCommissionRate] = useState("1");
  const [nameError, setNameError] = useState("");

  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newMaster = {
      id: `master-${uuid()}`,
      name: name.trim(),
      isDeleted: false,
      type,
      commissionRate: ["broker", "agent"].includes(type) ? parseFloat(commissionRate) : undefined
    };

    try {
      addMaster(newMaster);
      toast.success("Master saved successfully.");

      setName("");
      setType("supplier");
      setCommissionRate("1");

      // Trigger immediate reload of data
      onSaved(); 
      onClose(); 
    } catch (error) {
      console.error("Error saving master:", error);
      toast.error("Failed to save master. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center">
          Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError("");
          }}
          className={nameError ? "border-red-500" : ""}
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type" className="flex items-center">
          Type <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select 
          value={type} 
          onValueChange={(value) => setType(value as MasterType)}
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
      </div>
      
      {(type === "broker" || type === "agent") && (
        <div className="space-y-2">
          <Label htmlFor="commissionRate">Commission Rate (%)</Label>
          <Input
            id="commissionRate"
            type="number"
            step="0.01"
            placeholder="Enter commission rate"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
          />
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button type="submit" className="w-full">Save Master</Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
