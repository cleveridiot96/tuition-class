
import React, { createContext, useContext, useState, useCallback } from "react";
import { MasterType } from "@/types/master.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomerForm from "@/components/master/CustomerForm";
import SupplierForm from "@/components/master/SupplierForm";
import BrokerForm from "@/components/master/BrokerForm";
import TransporterForm from "@/components/master/TransporterForm";
import AgentForm from "@/components/master/AgentForm";

interface GlobalMasterDialogContextType {
  open: (type: MasterType, initialName?: string) => void;
  close: () => void;
  isOpen: boolean;
  masterType: MasterType | null;
  initialName: string;
  handleAddMaster: (callback: (id: string, name: string) => void) => void;
}

const GlobalMasterDialogContext = createContext<GlobalMasterDialogContextType | null>(null);

export function GlobalMasterDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [masterType, setMasterType] = useState<MasterType | null>(null);
  const [initialName, setInitialName] = useState('');
  const [onConfirm, setOnConfirm] = useState<((id: string, name: string) => void) | null>(null);

  const open = useCallback((type: MasterType, initialValue = '') => {
    setMasterType(type);
    setInitialName(initialValue);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOnConfirm(null);
  }, []);

  const handleAddMaster = useCallback((callback: (id: string, name: string) => void) => {
    setOnConfirm(() => callback);
  }, []);

  // Get the correct form based on master type
  const getFormComponent = () => {
    if (!masterType) return null;

    const onClose = () => setIsOpen(false);
    
    // Pass any callback that needs to be executed after successful add/edit
    const handleSave = () => {
      setIsOpen(false);
      // Any additional logic could be added here
    };

    switch (masterType) {
      case 'customer':
        return <CustomerForm onClose={onClose} initialData={initialName ? { name: initialName } : undefined} />;
      case 'supplier':
        return <SupplierForm onClose={onClose} initialData={initialName ? { name: initialName } : undefined} />;
      case 'broker':
        return <BrokerForm onClose={onClose} initialData={initialName ? { name: initialName } : undefined} />;
      case 'agent':
        return <AgentForm onClose={onClose} initialData={initialName ? { name: initialName } : undefined} />;
      case 'transporter':
        return <TransporterForm onClose={onClose} initialData={initialName ? { name: initialName } : undefined} />;
      case 'party':
        return <SupplierForm onClose={onClose} initialData={initialName ? { name: initialName } : undefined} />;
      default:
        return null;
    }
  };

  const formComponent = getFormComponent();

  const contextValue: GlobalMasterDialogContextType = {
    open,
    close,
    isOpen,
    masterType,
    initialName,
    handleAddMaster,
  };

  return (
    <GlobalMasterDialogContext.Provider value={contextValue}>
      {children}
      
      {isOpen && masterType && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Add New {masterType.charAt(0).toUpperCase() + masterType.slice(1)}
              </DialogTitle>
            </DialogHeader>
            {formComponent}
          </DialogContent>
        </Dialog>
      )}
    </GlobalMasterDialogContext.Provider>
  );
}

export function useGlobalMasterDialog() {
  const context = useContext(GlobalMasterDialogContext);
  
  if (!context) {
    throw new Error("useGlobalMasterDialog must be used within a GlobalMasterDialogProvider");
  }
  
  return context;
}
