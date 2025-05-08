
import React, { useState } from "react";
import { MasterType } from "@/types/master.types";
import { useMasterDialog } from "@/contexts/MasterDialogContext";

export const useAddToMaster = () => {
  const { openDialog } = useMasterDialog();

  const confirmAddToMaster = (initialName: string, callback: (id: string) => void, type: MasterType) => {
    openDialog(type, initialName);
    // Note: The callback will need to be handled through a subscription pattern
    // or by updating the component after the master data changes
  };

  return { confirmAddToMaster };
};
