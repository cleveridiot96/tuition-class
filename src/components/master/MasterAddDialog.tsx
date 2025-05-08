
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addToMasterList } from "@/services/masterOperations";
import { MasterType } from "@/types/master.types";
import { useMasterValidation } from "@/hooks/master/useMasterValidation";

interface MasterAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: MasterType;
  initialName?: string;
}

const MasterAddDialog: React.FC<MasterAddDialogProps> = ({
  open,
  onOpenChange,
  initialType = "supplier",
  initialName = "",
}) => {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<MasterType>(initialType);
  const [commissionRate, setCommissionRate] = useState("1");
  const { nameError, setNameError, validateMaster } = useMasterValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName(initialName);
      setType(initialType);
      setCommissionRate("1");
      setNameError("");
    }
  }, [open, initialName, initialType, setNameError]);

  const validateForm = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }

    return validateMaster(name.trim(), type);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const result = addToMasterList(type, {
        name: name.trim(),
        type,
        commissionRate: ["broker", "agent"].includes(type) ? parseFloat(commissionRate) : undefined,
      });

      if (result) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
        onOpenChange(false);
      } else {
        // addToMasterList already shows error toast
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast.error(`Failed to add ${type}. Please try again.`);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="master-type" className="text-right">
              Type
            </Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as MasterType)}
            >
              <SelectTrigger className="col-span-3">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              className={`col-span-3 ${nameError ? "border-red-500" : ""}`}
            />
            {nameError && <p className="text-red-500 text-sm col-start-2 col-span-3">{nameError}</p>}
          </div>
          
          {(type === "broker" || type === "agent") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commissionRate" className="text-right">
                Commission Rate (%)
              </Label>
              <NumericInput
                id="commissionRate"
                value={commissionRate}
                onChange={(value) => setCommissionRate(value.toString())}
                step="0.01"
                min={0}
                max={100}
                placeholder="Enter commission rate"
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MasterAddDialog;
