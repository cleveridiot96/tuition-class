
import React, { useState } from "react";
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

  const handleConfirm = () => {
    if (confirmationStage === 1) {
      // First confirmation, move to second stage
      setConfirmationStage(2);
    } else {
      // Second confirmation, proceed with format
      onConfirm();
      handleClose();
    }
  };

  const handleClose = () => {
    setConfirmationStage(1);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={confirmationStage === 2 ? "text-red-600" : ""}>
            {confirmationStage === 1 ? "Format Data?" : "EMERGENCY: Are You Absolutely Sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p className="font-medium text-red-500">
              FOR EMERGENCY USE ONLY! THIS ACTION CANNOT BE UNDONE!
            </p>
            {confirmationStage === 1
              ? "This will reset and reformat all your data. This action cannot be undone. A backup will be created automatically in both Excel format and software-readable format."
              : "Your data will be reformatted and previous settings may be lost. A backup has been created in Excel and software-readable formats for safety."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            {confirmationStage === 1 ? "Format Data" : "Yes, Format Data"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormatConfirmationDialog;
