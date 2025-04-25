
import { useState } from "react";
import type { DialogState } from "@/types/master.types";

export const useAddToMasterDialog = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    itemName: "",
  });

  const openDialog = (itemName: string, onConfirm: (value: string) => void, masterType?: string) => {
    setDialogState({
      isOpen: true,
      itemName,
      onConfirm,
      masterType,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return {
    dialogState,
    openDialog,
    closeDialog,
  };
};
