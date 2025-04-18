
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * Hook for managing "Add to Master" functionality in dropdown components
 */
export function useAddToMaster() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newItemValue, setNewItemValue] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<((value: string) => void) | null>(null);
  
  /**
   * Shows the confirmation dialog for adding a new item
   */
  const confirmAddToMaster = useCallback((value: string, onConfirm: (value: string) => void) => {
    setNewItemValue(value);
    setOnConfirmCallback(() => onConfirm);
    setShowConfirmDialog(true);
  }, []);
  
  /**
   * Handles the confirmation action
   */
  const handleConfirmAdd = useCallback(() => {
    if (newItemValue && onConfirmCallback) {
      onConfirmCallback(newItemValue);
      setShowConfirmDialog(false);
      toast.success(`"${newItemValue}" added to master list`);
    }
  }, [newItemValue, onConfirmCallback]);
  
  /**
   * Renders the confirmation dialog component
   */
  const AddToMasterDialog = useCallback(() => (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Master List</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">"{newItemValue}" not found. Add to master list?</p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmValue">Value to add:</Label>
            <Input 
              id="confirmValue" 
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
            No, Cancel
          </Button>
          <Button onClick={handleConfirmAdd}>
            Yes, Add to Master
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ), [showConfirmDialog, newItemValue, handleConfirmAdd]);
  
  return {
    confirmAddToMaster,
    AddToMasterDialog
  };
}
