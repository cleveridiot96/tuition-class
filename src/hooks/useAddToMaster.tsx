
import React, { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface UseAddToMasterReturn {
  confirmAddToMaster: (value: string, onConfirm: (value: string) => void) => void;
  AddToMasterDialog: React.FC;
}

export function useAddToMaster(): UseAddToMasterReturn {
  const [showDialog, setShowDialog] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<((value: string) => void) | null>(null);

  const confirmAddToMaster = useCallback((value: string, onConfirm: (value: string) => void) => {
    setCurrentValue(value);
    setOnConfirmCallback(() => onConfirm);
    setShowDialog(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (onConfirmCallback && currentValue) {
      try {
        onConfirmCallback(currentValue);
        toast.success(`"${currentValue}" added to master successfully`);
      } catch (error) {
        console.error('Error adding to master:', error);
        toast.error('Failed to add to master');
      }
    }
    setShowDialog(false);
  }, [currentValue, onConfirmCallback]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
  }, []);

  const AddToMasterDialog = useCallback(() => {
    return (
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add to Master</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to add "{currentValue}" to the master list? This will make it available for future use.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [showDialog, currentValue, handleCancel, handleConfirm]);

  return { confirmAddToMaster, AddToMasterDialog };
}
