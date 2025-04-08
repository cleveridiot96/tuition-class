
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormatConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FormatConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: FormatConfirmationDialogProps) => {
  const [confirmationStage, setConfirmationStage] = useState<1 | 2>(1);

  // Reset stage when dialog opens or closes
  useEffect(() => {
    if (isOpen === false) {
      setConfirmationStage(1);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (confirmationStage === 1) {
      // First confirmation, move to second stage
      setConfirmationStage(2);
    } else {
      // Second confirmation, proceed with format
      onConfirm();
      // No need to call handleClose here as onConfirm will handle it
    }
  };

  const handleClose = () => {
    // Reset to first stage whenever dialog is closed
    setConfirmationStage(1);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="border-2 border-red-200">
        <AlertDialogHeader>
          <AlertDialogTitle className={confirmationStage === 2 ? "text-red-600 font-bold text-2xl animate-pulse" : ""}>
            {confirmationStage === 1 ? "Format Data?" : "EMERGENCY: Are You Absolutely Sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div className="font-medium text-red-500 p-2 bg-red-50 border border-red-200 rounded">
              FOR EMERGENCY USE ONLY! THIS ACTION CANNOT BE UNDONE!
            </div>
            {confirmationStage === 1
              ? "This will reset and reformat all your data. This action cannot be undone. A backup will be created automatically in both Excel format and software-readable format."
              : "Your data will be completely reformatted and all current information will be replaced with fresh demo data. A backup has been created in Excel and software-readable formats for safety."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel className="bg-white border-2 border-gray-300 hover:bg-gray-100 transition-all shadow-sm hover:shadow">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className={`bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 ${confirmationStage === 2 ? 'animate-pulse ring-2 ring-red-300 ring-offset-2' : ''}`}
          >
            {confirmationStage === 1 ? "Format Data" : "Yes, Format All Data"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormatConfirmationDialog;
