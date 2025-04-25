
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddToMasterProps } from "@/types/master.types";
import { useAddToMasterDialog } from "./master/useAddToMasterDialog";
import { useMasterValidation } from "./master/useMasterValidation";
import { addToMasterList } from "@/services/masterOperations";

export const useAddToMaster = (props?: AddToMasterProps) => {
  const [newItemName, setNewItemName] = useState("");
  const [currentMasterType, setCurrentMasterType] = useState<string>(props?.masterType || "item");
  const { dialogState, openDialog, closeDialog } = useAddToMasterDialog();
  const { nameError, setNameError, validateMaster } = useMasterValidation();

  const handleConfirmAdd = () => {
    if (!validateMaster(newItemName.trim())) {
      return "";
    }

    const itemData = {
      name: newItemName.trim()
    };
    
    const addedValue = addToMasterList(currentMasterType, itemData);
    
    if (addedValue && dialogState.onConfirm) {
      dialogState.onConfirm(addedValue);
      closeDialog();
      setNewItemName("");
      setNameError("");
    }
    
    return addedValue;
  };

  const confirmAddToMaster = (itemName: string, onConfirm: (value: string) => void, masterType?: string) => {
    setNewItemName(itemName);
    setNameError("");
    
    if (masterType) {
      setCurrentMasterType(masterType);
    }
    
    openDialog(itemName, onConfirm, masterType);
  };
  
  const AddToMasterDialog = () => (
    <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add {currentMasterType}</DialogTitle>
          <DialogDescription>
            Add a new {currentMasterType} to the master list. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="mb-4">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              className={nameError ? "border-red-500" : ""}
              value={newItemName}
              onChange={(e) => {
                setNewItemName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              placeholder={`Enter ${currentMasterType} name`}
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>
          
          {currentMasterType === "broker" && (
            <div className="mb-4">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                placeholder="Enter commission rate"
                defaultValue="1"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAdd}>
            Add {currentMasterType}
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
