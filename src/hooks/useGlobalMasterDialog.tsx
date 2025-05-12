
import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { addSupplier, addAgent, addTransporter } from '@/services/storageService';

type MasterType = 'supplier' | 'agent' | 'transporter';

interface MasterDialogState {
  isOpen: boolean;
  masterType: MasterType | null;
  initialName: string;
  commissionRate?: string; // Only for agents
}

export function useGlobalMasterDialog() {
  const [dialogState, setDialogState] = useState<MasterDialogState>({
    isOpen: false,
    masterType: null,
    initialName: '',
    commissionRate: '1'
  });
  
  const [name, setName] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('1');
  const [nameError, setNameError] = useState<string>('');

  const open = useCallback((masterType: MasterType, initialName: string = '') => {
    setDialogState({
      isOpen: true,
      masterType,
      initialName,
      commissionRate: '1'
    });
    setName(initialName);
    setCommissionRate('1');
    setNameError('');
  }, []);

  const close = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleAddMaster = useCallback((onSuccess?: (id: string, name: string) => void) => {
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    try {
      let newId = '';
      let successMessage = '';

      switch (dialogState.masterType) {
        case 'supplier':
          newId = `supplier-${uuidv4()}`;
          addSupplier({
            id: newId,
            name: name.trim(),
            type: "supplier",
            isDeleted: false
          });
          successMessage = "Supplier added successfully";
          break;
          
        case 'agent':
          newId = `agent-${uuidv4()}`;
          addAgent({
            id: newId,
            name: name.trim(),
            commissionRate: parseFloat(commissionRate) || 1,
            type: "agent",
            isDeleted: false
          });
          successMessage = "Agent added successfully";
          break;
          
        case 'transporter':
          newId = `transporter-${uuidv4()}`;
          addTransporter({
            id: newId,
            name: name.trim(),
            type: "transporter",
            isDeleted: false
          });
          successMessage = "Transporter added successfully";
          break;
          
        default:
          throw new Error("Unknown master type");
      }

      toast.success(successMessage);
      if (onSuccess) {
        onSuccess(newId, name.trim());
      }
      close();
      
    } catch (error) {
      console.error(`Error adding ${dialogState.masterType}:`, error);
      toast.error(`Failed to add ${dialogState.masterType}`);
    }
  }, [name, commissionRate, dialogState.masterType, close]);

  const GlobalMasterAddDialog = useCallback(() => {
    const { isOpen, masterType } = dialogState;
    
    const title = masterType 
      ? `Add New ${masterType.charAt(0).toUpperCase() + masterType.slice(1)}` 
      : "Add New Entry";
      
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="masterName">
                {masterType ? `${masterType.charAt(0).toUpperCase() + masterType.slice(1)} Name` : "Name"} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="masterName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                }}
                placeholder={`Enter ${masterType || 'item'} name`}
                className={nameError ? "border-red-500" : ""}
                autoComplete="off"
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>
            
            {masterType === 'agent' && (
              <div>
                <Label htmlFor="commissionRate">Commission (%)</Label>
                <Input 
                  id="commissionRate"
                  type="number"
                  step="0.01"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="Enter commission percentage"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button onClick={() => handleAddMaster()}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [dialogState, name, commissionRate, nameError, close, handleAddMaster]);

  return {
    open,
    close,
    handleAddMaster,
    GlobalMasterAddDialog,
  };
}
