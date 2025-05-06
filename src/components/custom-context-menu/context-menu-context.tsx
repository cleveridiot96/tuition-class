
import React, { createContext, useContext, useState, ReactNode } from "react";

type ContextMenuContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <ContextMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
};
