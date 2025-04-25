
import React, { useState, useEffect } from "react";
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
import { addMaster } from "@/services/masterService";
import { MasterType } from "@/types/master.types";
import { useMasterValidation } from "@/hooks/master/useMasterValidation";
import { NumericInput } from "@/components/ui/numeric-input";

interface MasterFormProps {
  onClose: () => void;
  onSaved: () => void;
  initialType?: MasterType;
}

export const MasterForm: React.FC<MasterFormProps> = ({ onClose, onSaved, initialType = "supplier" }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<MasterType>(initialType);
  const [commissionRate, setCommissionRate] = useState("1");
  const { nameError, setNameError, validateMaster } = useMasterValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update type when initialType prop changes
  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const validateForm = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }

    return validateMaster(name.trim(), type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const newMaster = {
      id: `${type}-${uuid()}`,
      name: name.trim(),
      isDeleted: false,
      type,
      commissionRate: ["broker", "agent"].includes(type) ? parseFloat(commissionRate) : undefined
    };

    try {
      addMaster(newMaster);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully.`);

      setName("");
      setType(initialType);
      setCommissionRate("1");

      // Trigger immediate reload of data
      onSaved(); 
    } catch (error) {
      console.error("Error saving master:", error);
      toast.error(`Failed to save ${type}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow mb-4">
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
          required
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
          required
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
          <Label htmlFor="commissionRate" className="flex items-center">
            Commission Rate (%) <span className="text-red-500 ml-1">*</span>
          </Label>
          <NumericInput
            id="commissionRate"
            value={commissionRate}
            onChange={(value) => setCommissionRate(value.toString())}
            step="0.01"
            min={0}
            max={100}
            placeholder="Enter commission rate"
            required
          />
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
