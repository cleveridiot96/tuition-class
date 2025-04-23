
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
      try {
        onConfirmCallback(newItemValue);
        setShowConfirmDialog(false);
        toast.success(`"${newItemValue}" added to master list`);
      } catch (error) {
        console.error("Error adding item to master list:", error);
        toast.error(`Failed to add "${newItemValue}" to master list. Please try again.`);
      }
    }
  }, [newItemValue, onConfirmCallback]);
  
  /**
   * Renders the confirmation dialog component
   */
  const AddToMasterDialog = useCallback(() => (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent className="sm:max-w-md bg-white">
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
              autoComplete="off"
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
