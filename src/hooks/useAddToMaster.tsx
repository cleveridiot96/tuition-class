
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { addToMasterList } from "@/services/masterOperations";
import { MasterType } from "@/types/master.types";
import { useMasterValidation } from "@/hooks/master/useMasterValidation";

export const useAddToMaster = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [commissionRate, setCommissionRate] = useState<string>("1");
  const [masterType, setMasterType] = useState<MasterType>("supplier");
  const [onConfirm, setOnConfirm] = useState<((value: string) => void) | null>(null);
  const { nameError, validateMaster } = useMasterValidation();

  const confirmAddToMaster = (
    name: string,
    callback: (value: string) => void,
    type: MasterType = "supplier"
  ) => {
    setItemName(name);
    setMasterType(type);
    setOnConfirm(() => callback);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    // Don't proceed if validation fails
    if (!validateMaster(itemName, masterType)) {
      return;
    }

    // Convert commission rate to number if needed
    const commissionRateNum = ["broker", "agent"].includes(masterType) 
      ? parseFloat(commissionRate) 
      : undefined;

    // Add to master list with appropriate data
    const result = addToMasterList(masterType, {
      name: itemName,
      commissionRate: commissionRateNum,
      type: masterType
    });

    // If successful and callback exists, call it
    if (result && onConfirm) {
      onConfirm(result);
    }

    // Close dialog and reset state
    setIsDialogOpen(false);
    setItemName("");
    setCommissionRate("1");
  };

  const AddToMasterDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add to {masterType.charAt(0).toUpperCase() + masterType.slice(1)} Master</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="itemName" className="flex items-center">
              Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={`Enter ${masterType} name`}
              className="mt-1"
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {(masterType === "broker" || masterType === "agent") && (
            <div>
              <Label htmlFor="commissionRate" className="flex items-center">
                Commission Rate (%) <span className="text-red-500 ml-1">*</span>
              </Label>
              <NumericInput
                id="commissionRate"
                value={commissionRate}
                onChange={(value) => setCommissionRate(value.toString())}
                className="mt-1"
                step="0.01"
                min={0}
                max={100}
                placeholder="Enter commission rate"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Add {masterType.charAt(0).toUpperCase() + masterType.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    confirmAddToMaster,
    AddToMasterDialog,
  };
};
