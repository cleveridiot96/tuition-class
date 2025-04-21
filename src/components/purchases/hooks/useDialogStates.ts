
import { useState } from "react";

export const useDialogStates = () => {
  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [showAddBrokerDialog, setShowAddBrokerDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);
  const [showSimilarPartyDialog, setShowSimilarPartyDialog] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  
  return {
    showAddPartyDialog,
    setShowAddPartyDialog,
    showAddBrokerDialog,
    setShowAddBrokerDialog,
    showAddTransporterDialog,
    setShowAddTransporterDialog,
    showSimilarPartyDialog,
    setShowSimilarPartyDialog,
    showMobileMenu,
    setShowMobileMenu,
  };
};
