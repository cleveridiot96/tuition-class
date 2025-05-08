
import React, { createContext, useContext, useState, ReactNode } from "react";
import { MasterType } from "@/types/master.types";
import MasterAddDialog from "@/components/master/MasterAddDialog";

// Define the context type
interface MasterDialogContextType {
  isOpen: boolean;
  initialName: string;
  type: MasterType;
  openDialog: (type: MasterType, initialName?: string) => void;
  closeDialog: () => void;
}

// Create the context
const MasterDialogContext = createContext<MasterDialogContextType | undefined>(undefined);

// Hook for using the context
export const useMasterDialog = () => {
  const context = useContext(MasterDialogContext);
  if (!context) {
    throw new Error("useMasterDialog must be used within a MasterDialogProvider");
  }
  return context;
};

// Provider component
interface MasterDialogProviderProps {
  children: ReactNode;
}

export const MasterDialogProvider: React.FC<MasterDialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initialName, setInitialName] = useState<string>("");
  const [type, setType] = useState<MasterType>("supplier");

  const openDialog = (dialogType: MasterType, name: string = "") => {
    setType(dialogType);
    setInitialName(name);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    initialName,
    type,
    openDialog,
    closeDialog,
  };

  return (
    <MasterDialogContext.Provider value={value}>
      {children}
      <MasterAddDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        initialType={type}
        initialName={initialName}
      />
    </MasterDialogContext.Provider>
  );
};
